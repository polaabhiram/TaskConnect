# TaskConnect — completed MERN rebuild

A teaching-oriented MERN implementation of TaskConnect: workers find jobs, professional bodies post jobs and manage applications, profiles can be updated, dashboards expose role-specific actions, and monthly reports use Gemini when configured (with a deterministic fallback when no key is supplied).

## Stack
- Frontend: React + Vite + React Router
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Auth: bcryptjs + JWT
- AI: optional Gemini REST API

## Run locally
### 1. MongoDB
Make sure MongoDB is running locally on `127.0.0.1:27017`.

### 2. Backend
```bash
cd backend
cp .env.example .env
# edit JWT_SECRET; optionally add GEMINI_API_KEY
npm install
npm run dev
```
API: `http://localhost:5001`

### 3. Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
Frontend: Vite will print its local URL, normally `http://localhost:5173`.

## Main API routes
- `POST /api/auth/register/worker`
- `POST /api/auth/register/professional-body`
- `POST /api/auth/login/worker`
- `POST /api/auth/login/professional-body`
- `GET /api/auth/me`
- `GET /api/jobs`
- `GET /api/jobs/:id`
- `POST /api/jobs` — professional body
- `PUT /api/jobs/:id` — owner only
- `DELETE /api/jobs/:id` — owner only
- `POST /api/applications` — worker
- `GET /api/applications/mine` — worker
- `GET /api/applications/received` — professional body
- `PATCH /api/applications/:id/status` — owner only
- `GET /api/users/profile`
- `PATCH /api/users/profile`
- `GET /api/reports/monthly` — professional body

## End-to-end flow
Professional body registers → logs in → creates job → worker registers → logs in → browses job → applies → professional body sees application → accepts/rejects → worker sees status.

## Security notes
- Never commit `.env`.
- Never log passwords or JWTs.
- Use a strong production `JWT_SECRET`.
- Restrict CORS in production.
- The current architecture intentionally keeps Worker and ProfessionalBody as separate collections to match the design developed in the rebuild.
# TaskConnect
