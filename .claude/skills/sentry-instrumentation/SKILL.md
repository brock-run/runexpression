---
name: sentry-instrumentation
description: Configure Sentry for Next.js and standardize error capture, tracing spans, and logging. Use when adding Sentry instrumentation, handling exceptions, or adding performance spans in client/server code.
---

# Sentry Instrumentation (Next.js)

## Initialization locations

- Client: `instrumentation-client.(ts|js)`
- Server: `sentry.server.config.ts`
- Edge: `sentry.edge.config.ts`
- Do not initialize Sentry elsewhere.

## Imports

Use `import * as Sentry from "@sentry/nextjs"` everywhere.

## Exception capture

Use `Sentry.captureException(error)` in `catch` blocks or expected failure paths.

```ts
try {
  await doWork()
} catch (error) {
  Sentry.captureException(error)
  throw error
}
```

## Tracing spans

Create spans for meaningful actions (UI clicks, API calls, expensive functions).
Use descriptive `op` and `name`, attach attributes for context.

```ts
Sentry.startSpan(
  { op: "ui.click", name: "Join Waitlist Click" },
  (span) => {
    span.setAttribute("source", "homepage")
    handleJoinWaitlist()
  }
)
```

```ts
return Sentry.startSpan(
  { op: "http.client", name: `GET /api/users/${userId}` },
  async () => {
    const response = await fetch(`/api/users/${userId}`)
    return response.json()
  }
)
```

## Logs

Enable logs in init (`enableLogs: true`) and use the Sentry logger.

```ts
const { logger } = Sentry
logger.debug(logger.fmt`Cache miss for user: ${userId}`)
```

Optional console logging integration:

```ts
Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] })
```
