# ARK Command Center Tribe API

Private six-member account and sync service for the ARK Command Center Windows app.

## Configuration

- `DATABASE_URL`: Railway Postgres private connection string.
- `JWT_SECRET`: long random secret (at least 32 characters) used for 12-hour access tokens.
- `INVITE_CODE`: private tribe registration code (at least 12 characters).
- `MAX_MEMBERS`: 6 by default. Registration is transactionally capped.
- `PORT`: injected by Railway (defaults to 3000 for local testing).
- `RESET_ACCOUNT_EPOCH`: normally unset. Only when deliberately set to a unique lowercase marker, archives existing member profile data (without password hashes) and deletes every member and their remembered sessions exactly once. Shared tribe records survive. Clear this flag after verifying the reset.

The public API uses HTTPS on Railway; PostgreSQL remains private. Do not place any of the first three variables in GitHub or the desktop app.

## Routes

- `GET /api/v1/health`
- `POST /api/v1/auth/register` `{email,displayName,password,inviteCode,rememberMe}`
- `POST /api/v1/auth/login` `{email,password,rememberMe}`
- `POST /api/v1/auth/refresh` `{refreshToken}` (rotates a remembered session and returns new access and refresh tokens)
- `POST /api/v1/auth/logout` `{refreshToken}` (revokes the remembered session)
- `GET /api/v1/auth/me` (Bearer token)
- `GET|PUT /api/v1/state` (private per-member JSON snapshot, optimistic `version`)
- `GET|PUT /api/v1/tribe/servers` (shared server list, optimistic `version`)
- `GET /api/v1/events` (authenticated Server-Sent Events stream; one database-backed broadcast for all API instances)
- `GET|POST /api/v1/tribe/timers`, `DELETE /api/v1/tribe/timers/:id` (shared countdowns with server-calculated end times)
- `GET|POST|PUT|DELETE /api/v1/tribe/crafting`, `DELETE /api/v1/tribe/crafting/:name` (shared queue with atomic increments)
- `GET|POST /api/v1/tribe/servers/live`, `DELETE /api/v1/tribe/servers/live/:id` (shared per-server records)

Passwords use salted scrypt. Browser access is restricted to Tauri local origins and the dev server. Concurrent updates are rejected with HTTP 409; clients must not silently overwrite each other. Access tokens expire after 12 hours and remain in session storage. When the user checks Remember this PC, an opaque, 30-day rotating refresh credential is stored on the device; the database stores only its SHA-256 hash. Passwords are never saved on the device. Sessions can be individually revoked on sign-out.

The live endpoints use row-level SQL writes to prevent users from overwriting each other's changes. PostgreSQL `LISTEN/NOTIFY` broadcasts changes to authenticated SSE clients, and the desktop periodically refreshes as a fallback. The original shared server JSON snapshot is imported once on the first v0.8 deployment.
