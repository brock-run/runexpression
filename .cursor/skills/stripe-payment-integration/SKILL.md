---
name: stripe-payment-integration
description: Implementing Stripe Checkout, webhooks, and order management for Next.js App Router. Use when implementing shop features, payment flows, webhook handlers, order management, digital product delivery, or debugging Stripe integration issues.
---

# Stripe Payment Integration

## Setup

**Installation:**
```bash
npm install stripe @stripe/stripe-js
```

**Environment Variables:**
```typescript
// env.ts
STRIPE_SECRET_KEY=sk_test_... // Server-side only
STRIPE_WEBHOOK_SECRET=whsec_... // Webhook signature verification
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... // Client-side
```

**Initialize Stripe Client (Server-Side):**
```typescript
// lib/stripe/server.ts
import Stripe from 'stripe'
import { env } from '@/env'

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})
```

**Never expose secret key to client.** Only use `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in client components.

---

## Checkout Session Creation

### API Route Pattern

```typescript
// app/api/stripe/create-checkout-session/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/server'
import { env } from '@/env'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { priceId, productId } = await request.json()

  // Verify product exists and is active
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id, stripe_price_id, type, name')
    .eq('id', productId)
    .eq('is_active', true)
    .single()

  if (productError || !product || product.stripe_price_id !== priceId) {
    return NextResponse.json({ error: 'Invalid product' }, { status: 400 })
  }

  const origin = request.headers.get('origin') || 'http://localhost:3000'

  // Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    customer_email: user.email,
    success_url: `${origin}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/shop/cancel`,
    metadata: {
      user_id: user.id,
      product_id: productId,
      product_type: product.type, // 'physical' or 'digital'
    },
  })

  return NextResponse.json({ sessionId: session.id, url: session.url })
}
```

### Client-Side Checkout Button

```typescript
// components/shop/checkout-button.tsx
'use client'

import { loadStripe } from '@stripe/stripe-js'
import { env } from '@/env'
import { useState } from 'react'

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function CheckoutButton({ priceId, productId }: { priceId: string; productId: string }) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const stripe = await stripePromise
      if (!stripe) throw new Error('Stripe failed to load')

      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, productId }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create checkout session')
      }

      const { sessionId } = await response.json()
      const { error } = await stripe.redirectToCheckout({ sessionId })

      if (error) throw error
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handleCheckout} disabled={loading}>
      {loading ? 'Processing...' : 'Buy Now'}
    </button>
  )
}
```

---

## Webhook Handler

**Always verify webhook signatures** to prevent fraud.

```typescript
// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { env } from '@/env'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createAdminClient() // Use admin client to bypass RLS

  // Handle checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    // Retrieve session with line items
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items'],
    })

    const lineItems = fullSession.line_items?.data || []
    const metadata = session.metadata || {}

    // Create order record
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: metadata.user_id || null,
        stripe_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent as string,
        status: 'paid',
        total_cents: session.amount_total || 0,
        currency: session.currency || 'usd',
        items: lineItems.map((item) => ({
          product_id: metadata.product_id,
          quantity: item.quantity || 1,
          price_cents: item.price?.unit_amount || 0,
        })),
        metadata: {
          customer_email: session.customer_email,
          payment_status: session.payment_status,
        },
      })
      .select()
      .single()

    if (orderError) {
      console.error('Failed to create order:', orderError)
      return NextResponse.json({ error: 'Order creation failed' }, { status: 500 })
    }

    // Handle digital product delivery
    if (metadata.product_type === 'digital') {
      // Fetch product to get download URL
      const { data: product } = await supabase
        .from('products')
        .select('metadata')
        .eq('id', metadata.product_id)
        .single()

      const downloadUrl = product?.metadata?.download_url

      if (downloadUrl && session.customer_email) {
        // Send email with download link (implement email service)
        // For V1, you might use Stripe's built-in email or a service like Resend
        console.log('Digital product delivery:', {
          email: session.customer_email,
          downloadUrl,
          orderId: order.id,
        })
      }
    }

    return NextResponse.json({ received: true, orderId: order.id })
  }

  // Handle other events (payment_intent.succeeded, etc.)
  return NextResponse.json({ received: true })
}
```

**Webhook Configuration:**
- In Stripe Dashboard: Developers → Webhooks
- Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
- Select events: `checkout.session.completed`, `payment_intent.succeeded`
- Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

---

## Order Management

### Fetch User Orders

```typescript
// app/shop/orders/page.tsx (Server Component)
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function OrdersPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: orders } = await supabase
    .from('orders')
    .select('id, status, total_cents, currency, items, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1>Your Orders</h1>
      {orders?.map((order) => (
        <div key={order.id}>
          <p>Order #{order.id.slice(0, 8)}</p>
          <p>Status: {order.status}</p>
          <p>Total: ${(order.total_cents / 100).toFixed(2)}</p>
        </div>
      ))}
    </div>
  )
}
```

### Success Page

```typescript
// app/shop/success/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string }
}) {
  if (!searchParams.session_id) {
    redirect('/shop')
  }

  const supabase = createClient()
  const { data: order } = await supabase
    .from('orders')
    .select('id, status, items')
    .eq('stripe_session_id', searchParams.session_id)
    .single()

  if (!order) {
    return <div>Order not found</div>
  }

  return (
    <div>
      <h1>Thank you for your purchase!</h1>
      <p>Order #{order.id.slice(0, 8)}</p>
      {order.status === 'paid' && (
        <p>Your order has been confirmed. You'll receive an email shortly.</p>
      )}
    </div>
  )
}
```

---

## Digital Product Delivery

### Email Delivery Pattern

```typescript
// lib/stripe/deliver-digital-product.ts
import { createAdminClient } from '@/lib/supabase/admin'
import { stripe } from '@/lib/stripe/server'

export async function deliverDigitalProduct(
  orderId: string,
  customerEmail: string
) {
  const supabase = createAdminClient()

  // Fetch order with product info
  const { data: order } = await supabase
    .from('orders')
    .select('items, metadata')
    .eq('id', orderId)
    .single()

  if (!order) throw new Error('Order not found')

  // Extract product IDs from order items
  const productIds = order.items.map((item: any) => item.product_id)

  // Fetch products to get download URLs
  const { data: products } = await supabase
    .from('products')
    .select('id, name, metadata')
    .in('id', productIds)
    .eq('type', 'digital')

  // Send email with download links
  // For V1, use Resend or similar service
  // Example:
  // await sendEmail({
  //   to: customerEmail,
  //   subject: 'Your RunExpression Digital Product',
  //   body: generateDownloadEmail(products),
  // })

  // Mark order as delivered
  await supabase
    .from('orders')
    .update({ status: 'delivered', metadata: { ...order.metadata, delivered_at: new Date().toISOString() } })
    .eq('id', orderId)
}
```

---

## Error Handling

### API Route Error Pattern

```typescript
export async function POST(request: NextRequest) {
  try {
    // ... checkout session creation
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      console.error('Stripe error:', error.message)
      return NextResponse.json(
        { error: 'Payment processing error. Please try again.' },
        { status: 500 }
      )
    }

    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
```

### Client-Side Error Handling

```typescript
try {
  await stripe.redirectToCheckout({ sessionId })
} catch (error: any) {
  if (error.message) {
    // User cancelled or error occurred
    console.error('Checkout error:', error.message)
  }
  // Redirect to cancel page or show error message
}
```

---

## Security Best Practices

### Checklist

- [ ] **Never expose secret key:** Only use `STRIPE_SECRET_KEY` server-side
- [ ] **Verify webhook signatures:** Always validate `stripe-signature` header
- [ ] **Use admin client for webhooks:** Bypass RLS when creating orders from webhooks
- [ ] **Validate product ownership:** Check product exists and is active before creating session
- [ ] **Store metadata securely:** Use session metadata for user/product IDs, not sensitive data
- [ ] **Idempotent webhook handling:** Check if order already exists before creating
- [ ] **HTTPS only:** Stripe requires secure connections
- [ ] **Test mode:** Use test keys during development (`sk_test_`, `pk_test_`)

### Idempotent Order Creation

```typescript
// In webhook handler, check for existing order
const { data: existingOrder } = await supabase
  .from('orders')
  .select('id')
  .eq('stripe_session_id', session.id)
  .single()

if (existingOrder) {
  // Order already processed, return success
  return NextResponse.json({ received: true, orderId: existingOrder.id })
}

// Create new order...
```

---

## Testing

### Test Cards (Stripe Test Mode)

- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **3D Secure:** `4000 0025 0000 3155`
- **Any future expiry date, any CVC**

### Webhook Testing

Use Stripe CLI for local webhook testing:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

This provides a webhook signing secret for local development.

---

## Common Patterns

### Multiple Products in Session

```typescript
const session = await stripe.checkout.sessions.create({
  mode: 'payment',
  line_items: [
    { price: priceId1, quantity: 1 },
    { price: priceId2, quantity: 2 },
  ],
  // ...
})
```

### Custom Metadata

```typescript
metadata: {
  user_id: user.id,
  product_ids: JSON.stringify([productId1, productId2]),
  source: 'shop_page',
  campaign: 'launch_week',
}
```

### Customer Creation (Optional)

```typescript
// Create or retrieve Stripe customer
let customerId: string

const { data: profile } = await supabase
  .from('profiles')
  .select('stripe_customer_id')
  .eq('id', user.id)
  .single()

if (profile?.stripe_customer_id) {
  customerId = profile.stripe_customer_id
} else {
  const customer = await stripe.customers.create({
    email: user.email,
    metadata: { user_id: user.id },
  })
  customerId = customer.id

  // Store customer ID in profile
  await supabase
    .from('profiles')
    .update({ stripe_customer_id: customerId })
    .eq('id', user.id)
}

// Use in checkout session
const session = await stripe.checkout.sessions.create({
  customer: customerId,
  // ...
})
```

---

## Integration with Supabase

### Database Schema Reference

**Products table:**
- `stripe_price_id` - Stripe Price ID (e.g., `price_...`)
- `stripe_product_id` - Stripe Product ID (optional)
- `type` - `'physical'` or `'digital'`

**Orders table:**
- `stripe_session_id` - Unique Checkout Session ID
- `stripe_payment_intent_id` - Payment Intent ID
- `status` - `'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'`
- `items` - JSONB array of line items
- `total_cents` - Total in cents (integer)

### RLS Policies

Orders use RLS - users can only view their own orders. Webhook handler must use admin client to create orders.

---

## References

- [Stripe Checkout Docs](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe Next.js Integration](https://stripe.com/docs/checkout/quickstart?lang=node)
- RunExpression ADR-006: Stripe Hosted Checkout decision


## Related ADRs

- [ADR-006: Use Stripe Hosted Checkout](../../docs/adr/006-stripe-hosted-checkout.md) - We will use **Stripe Hosted Checkout** for all payments. Users will be redirected to Stripe's hosted payment page, complete purchase there, then return to our site. ### Key Implementation Details:

**Flow:**
1.
