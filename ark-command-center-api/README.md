# ARK Command Center Tribe API

Private six-member account and sync service for the ARK Command Center Windows app.

## Configuration

- `DATABASE_URL`: Railway Postgres private connection string.
- `JWT_SECRET`: long random secret (at least 32 characters) used for 12-hour access tokens.
- `INVITE_CODE`: private tribe registration code (at least 12 characters).
- `MAX_MEMBERS`: 6 by default. Registration is transactionally capped.
- `PORT`: injected by Railway (defaults to 3000 for local testing).

The public API uses HTTPS on Railway; PostgreSQL remains private. Do not place any of the first three variables in GitHub or the desktop app.

## Routes

- `GET /api/v1/health`
- `POST /api/v1/auth/register` `{email,displayName,password,inviteCode}`
- `POST /api/v1/auth/login` `{email,password}`
- `GET /api/v1/auth/me` (Bearer token)
- `GET|PUT /api/v1/state` (private per-member JSON snapshot, optimistic `version`)
- `GET|PUT /api/v1/tribe/servers` (shared server list, optimistic `version`)

Passwords use salted scrypt. Browser access is restricted to Tauri local origins and the dev server. Concurrent updates are rejected with HTTP 409; clients must not silently overwrite each other. Access tokens expire after 12 hours and are stored only in session storage by the desktop app.
