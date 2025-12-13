# Swarm Lock 🛡️

Real-time edge security platform.

## Stack
- Next.js (Vercel)
- Supabase (logs + stats)
- Cloudflare (DNS + edge)

## Deploy
1. Push to GitHub
2. Import into Vercel
3. Add env vars
4. Attach swarmlock.cloud

## Test
```bash
curl -X POST https://app.swarmlock.cloud/api/swarm-lock/event \
  -H "Content-Type: application/json" \
  -d '{
    "ip": "8.8.8.8",
    "path": "/.env",
    "method": "GET",
    "risk_score": 99,
    "decision": "block",
    "signals": { "honeypot": true }
  }'
