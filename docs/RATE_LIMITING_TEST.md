# Rate Limiting Test

Cloudflare deployments use the `WAN_IP_RATE_LIMITER` binding configured in
`wrangler.json`. It allows 10 checks per 10-second window for each client key in
the Cloudflare location handling the request. Cloudflare's counters are
eventually consistent, so this protects the upstream providers but is not an
accounting mechanism.

Plain Next.js development and non-Cloudflare deployments use a best-effort
in-memory fallback of two requests per two seconds. That fallback is local to a
single process or serverless instance.

## Browser test

Run the following in the browser console on a deployed instance:

```javascript
const requests = Array.from({ length: 12 }, () =>
  fetch('/api/ip?provider=cloudflare').then(async response => ({
    status: response.status,
    body: await response.json(),
  }))
);

console.table(await Promise.all(requests));
```

Requests over the configured limit should return HTTP `429` with a
`Retry-After` header. Provider-originated `429` responses, including ipapi.co's
free-tier throttling, are also passed through with retry information.

## Cache check

```bash
curl -i 'https://your-domain.example/api/ip?provider=cloudflare'
```

The response should include `Cache-Control: private, no-store` plus CDN-specific
`no-store` headers.
