# ADR-006: Use Stripe Hosted Checkout

**Date:** 2025-12-14
**Status:** Accepted
**Deciders:** Product Owner, Engineering Team
**Tags:** payments, e-commerce, security, user-experience

## Context

RunExpression V1 includes a shop for physical and digital products:
- Physical: Runner greeting cards, t-shirts
- Digital: Training plan PDFs, handbook PDFs

**Payment Requirements:**
- Accept credit card payments securely
- Handle tax calculation (if applicable)
- Support one-time purchases (no subscriptions in V1)
- Deliver digital products automatically
- Provide order confirmation emails
- Minimize PCI compliance burden

**Team Constraints:**
- Small team, no payment specialist
- Must ship V1 quickly (6-8 weeks)
- Minimize security/compliance overhead
- Prefer managed solutions over custom code

## Decision

We will use **Stripe Hosted Checkout** for all payments. Users will be redirected to Stripe's hosted payment page, complete purchase there, then return to our site.

### Key Implementation Details:

**Flow:**
1. User clicks "Buy Now" on product page
2. Next.js API route creates Stripe Checkout Session
3. User redirected to `checkout.stripe.com`
4. User enters payment info on Stripe's page
5. Stripe processes payment
6. User redirected back to `/shop/success?session_id=xxx`
7. Webhook handler unlocks digital products (if applicable)

**Code Example:**
```typescript
// Create checkout session
const session = await stripe.checkout.sessions.create({
  line_items: [{ price: product.stripe_price_id, quantity: 1 }],
  mode: 'payment',
  success_url: `${origin}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${origin}/shop/cancel`,
});

// Redirect to Stripe
redirect(session.url);
```

## Consequences

### Positive

- **Zero PCI compliance burden:** Stripe handles all payment data (we never touch card numbers)
- **Secure by default:** Stripe's payment form is battle-tested and compliant
- **Fast implementation:** ~1 day to integrate vs. weeks for custom form
- **Mobile-optimized:** Stripe's checkout works perfectly on mobile
- **Tax handling:** Stripe can calculate tax if needed (Stripe Tax)
- **Email receipts:** Stripe sends email receipts automatically
- **Localization:** Stripe supports multiple currencies and languages
- **Fraud protection:** Stripe Radar included (machine learning fraud detection)
- **Updates handled:** Stripe maintains and updates payment form (3DS, Apple Pay, etc.)

### Negative

- **User leaves site:** Brief redirect to Stripe domain (minor UX interruption)
- **Limited customization:** Can't fully customize checkout appearance (only basic branding)
- **No upsells during checkout:** Can't show "add related product" during payment flow
- **Session-based:** Can't save "cart" between sessions (each purchase is one-off)
- **Stripe fees:** 2.9% + 30¢ per transaction (industry standard, but not free)

### Neutral

- **Stripe dependency:** Locked into Stripe (but we want this anyway)
- **Requires HTTPS:** Must use secure connection (already required)

## Alternatives Considered

### Alternative 1: Stripe Custom Checkout (Embedded Form)

**Description:** Embed Stripe Elements (payment form components) directly in our Next.js app.

**Pros:**
- **Users stay on our site:** No redirect to Stripe domain
- **Full customization:** Control every aspect of checkout UI
- **Upsells:** Can show related products during checkout
- **Branding:** Perfect brand consistency

**Cons:**
- **Complexity:** Must handle form validation, error states, loading states
- **Security responsibility:** More PCI compliance requirements (SAQ A-EP vs SAQ A)
- **Maintenance:** Must update when Stripe adds new payment methods
- **Implementation time:** 3-5 days vs 1 day for hosted checkout
- **Mobile UX:** Must test and optimize for all devices ourselves

**Why rejected:** Hosted Checkout provides 90% of the benefits with 10% of the implementation time and zero security burden. For V1 shop (4 products), custom form is overkill.

---

### Alternative 2: PayPal Only

**Description:** Use PayPal for payments, skip credit cards.

**Pros:**
- **Trusted:** Many users have PayPal accounts
- **Simple:** PayPal button integration is easy
- **No PCI:** PayPal handles all payment data

**Cons:**
- **Lower conversion:** Not everyone has/trusts PayPal (~30% of users abandon)
- **Higher fees:** 3.49% + fixed fee (vs Stripe's 2.9%)
- **Poor developer experience:** PayPal's API is clunky
- **Limited to PayPal:** Users without accounts can't purchase

**Why rejected:** Stripe Checkout supports credit cards, Apple Pay, Google Pay, AND can add PayPal if needed. Stripe is more flexible.

---

### Alternative 3: Shopify Buy Button

**Description:** Create products in Shopify, embed "Buy" buttons in our site.

**Pros:**
- **Full e-commerce:** Inventory, shipping, tax all handled
- **Easy setup:** No code needed for product management
- **Print-on-Demand integrations:** Shopify has Printful, Printify plugins

**Cons:**
- **Cost:** Shopify Lite is $9/mo + transaction fees
- **Limited control:** Shopify owns customer data
- **Heavy:** Shopify JS is large (~200KB), slows page load
- **Ugly:** Shopify cart/checkout doesn't match our brand
- **Overkill:** We have 4 products, not 400

**Why rejected:** Shopify is built for large inventories. For 4 products, Stripe + Supabase is simpler and cheaper.

---

### Alternative 4: Lemon Squeezy (Digital Products Only)

**Description:** Use Lemon Squeezy for digital products (PDFs), Stripe for physical.

**Pros:**
- **Digital-focused:** PDF delivery, license keys, built-in
- **Merchant of Record:** They handle tax, invoicing
- **Affiliate program:** Built-in affiliate tracking

**Cons:**
- **Two systems:** Lemon Squeezy for digital + Stripe for physical (confusing)
- **Higher fees:** 5% + payment processing vs Stripe's 2.9%
- **Startup risk:** Lemon Squeezy is newer, less proven than Stripe
- **Limited physical support:** Not designed for greeting cards, t-shirts

**Why rejected:** Stripe can handle both digital and physical products. Adding Lemon Squeezy creates complexity without enough benefit.

## References

- [Stripe Checkout Documentation](https://stripe.com/docs/payments/checkout)
- [Stripe Next.js Integration](https://stripe.com/docs/checkout/quickstart?lang=node)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- RunExpression Docs: `DOCS/02-PRODUCT-REQUIREMENTS.md` (F5: Shop Framework)

## Notes

- **Webhook verification:** Always verify webhook signatures to prevent fraud
- **Test mode:** Use Stripe test mode during development (test cards don't charge)
- **Digital delivery:** Use `checkout.session.completed` webhook to email PDFs
- **Physical fulfillment:** Initially manual; V1.1 can add Printful integration
- **Analytics:** Track `purchase_complete` event after successful payment

**When to revisit this decision:**
- If we need complex checkout flows (multi-step, upsells) → switch to Custom Checkout
- If Stripe fees become problematic (high volume, low margins) → evaluate alternatives
- If we need subscription billing → use Stripe Billing (still hosted checkout)
- If international tax becomes complex → enable Stripe Tax

---

**Related ADRs:**
- [ADR-002: Supabase Backend](./002-supabase-backend.md) - Stores products, orders
