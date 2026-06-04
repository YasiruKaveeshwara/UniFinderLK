# UniFinderLK Deployment README

This document is the deployment guide for the three independently deployed services in UniFinderLK:

- Frontend: Vercel
- Backend: Render
- Degree service: Hugging Face Spaces

The goal is to keep the frontend static and fast, the backend authenticated and database-backed, and the degree service isolated as its own Python model service.

## Deployment Overview

### Service map

- Frontend handles the user interface and browser-side routing.
- Backend handles authentication, profile storage, feedback, and API access.
- Degree service handles degree recommendation APIs and model inference.

### Recommended deployment order

1. Deploy the backend first.
2. Deploy the degree service second.
3. Deploy the frontend last, after both public service URLs are known.

### Local-to-production URL flow

- Frontend build-time env vars point to the public backend and degree-service URLs.
- Backend CORS must allow the Vercel frontend origin.
- Degree service CORS should allow the Vercel frontend origin and local dev origins.

### Important constraint

- The GitHub Actions workflows are configured to trigger from the `main` branch. If your active development work stays on `dev`, merge or cherry-pick the deployment changes into `main` before expecting the automation to run.

## 1) Frontend on Vercel

### Repository settings

- Root directory: `frontend`
- Framework preset: Create React App
- Build command: `npm run build`
- Output directory: `build`
- Install command: `npm ci`
- Node version: use a current LTS release, such as Node 20

### Required environment variables

Set these in the Vercel project settings:

- `REACT_APP_BACKEND_URL` = your Render backend URL, for example `https://your-backend.onrender.com`
- `REACT_APP_DEGREE_SERVICE_URL` = your Hugging Face Space URL, for example `https://your-space.hf.space`

### Vercel settings to verify

- Project framework detection should stay on React / Create React App.
- Production deployment should use the `main` branch or the branch you explicitly choose.
- Domain settings should match the origin listed in backend CORS.
- If you use a custom domain, update the backend and degree service CORS allowlists to include it.

### Notes

- [frontend/vercel.json](frontend/vercel.json) rewrites all client-side routes to `index.html` so React Router works on refresh.
- [frontend/Dockerfile](frontend/Dockerfile) also compiles the public URLs into the build when you use the container image directly.
- Keep the frontend build env values in sync with the live backend URLs after every backend or degree-service redeploy.
- The frontend API modules read `REACT_APP_BACKEND_URL` and `REACT_APP_DEGREE_SERVICE_URL` at build time, so a redeploy is required when those values change.

## 2) Backend on Render

### Service settings

- Service type: Web Service
- Root directory: `backend`
- Environment: Docker
- Health check path: `/api/health`
- Dockerfile path: `backend/Dockerfile`
- Exposed port: `5000` in the container image

### Render setup steps

1. Create a new Render Web Service.
2. Connect the repository and choose the `main` branch.
3. Set the root directory to `backend`.
4. Set the environment to Docker so Render uses the provided Dockerfile.
5. Add all required environment variables.
6. Verify the health check path is `/api/health`.
7. Deploy and confirm the `/api/health` endpoint returns `{ "status": "ok" }`.

### Required environment variables

Set these in Render:

- `NODE_ENV=production`
- `PORT=5000` or leave Render to inject its own port
- `MONGO_URI` = your MongoDB connection string
- `JWT_SECRET` = a strong random secret
- `JWT_EXPIRES_IN` = optional, default `7d`
- `COOKIE_EXPIRES_IN` = optional, default `7`
- `CORS_ORIGINS` = include your Vercel domain, for example `https://your-app.vercel.app`

### Backend provider notes

- The backend uses HTTP-only cookies, so production must keep `sameSite=None` and `secure=true`, which is already handled in the auth controller.
- Render must serve the app over HTTPS for cross-site cookies to work correctly in the browser.
- If you change the frontend domain, update `CORS_ORIGINS` immediately.
- If you rotate `JWT_SECRET`, all active sessions will be invalidated and users must sign in again.

### Notes

- The backend already sets cross-site cookies correctly for production.
- Keep `CORS_ORIGINS` aligned with the exact Vercel origin.
- [backend/Dockerfile](backend/Dockerfile) uses `npm ci --omit=dev` so the service image stays lean.
- [backend/.dockerignore](backend/.dockerignore) prevents local files, docs, and development artifacts from entering the image.

## 3) Degree service on Hugging Face Spaces

### Space settings

- Space type: Docker
- Repository contents: sync the `degree-service` folder into the Space repo root
- Health endpoint: `/health`
- Container port: `5001`

### Hugging Face setup steps

1. Create a new Hugging Face Space.
2. Select Docker as the Space SDK / template.
3. Copy the contents of `degree-service` into the Space repository root.
4. Ensure the `data/` folder is included because the recommendation pipeline depends on the CSV and model files.
5. Add the required secrets.
6. Confirm the Space URL returns `/health` with a 200 response.

### Required environment variables

Set these in the Space secrets/settings:

- `GOOGLE_GEMINI_API_KEY`
- `CORS_ORIGINS` = include your Vercel frontend domain and local dev URLs if needed
- `PORT` is injected by the platform; the Dockerfile respects it
- `EMBEDDING_MODEL` is optional if you want to override the default sentence transformer

### Notes

- The service is already containerized.
- Keep `data/` and `requirements.txt` in the Space repo root so the model and dataset load correctly.
- The service uses a FastAPI health check at `/health`.
- The Docker image sets Hugging Face cache directories inside the container so the first model download is cached during runtime.
- If the catalog or cutoff CSV changes, regenerate embeddings before redeploying if the model expects the cached vectors to match.

## 4) Automatic deployment pipeline

GitHub Actions workflows are included for all three services:

- `.github/workflows/deploy-frontend-vercel.yml`
- `.github/workflows/deploy-backend-render.yml`
- `.github/workflows/deploy-degree-service-huggingface.yml`

### Workflow behavior

- Frontend workflow installs dependencies, builds the React app with production URLs, then deploys to Vercel.
- Backend workflow triggers a Render deploy hook.
- Degree-service workflow clones the Hugging Face Space repo, syncs the `degree-service` folder, commits, and pushes changes.
- The Hugging Face sync intentionally excludes `data/embeddings.npy` because Spaces rejects that binary file in a normal git push.
- The degree service can still run without that file because it falls back to on-the-fly embedding generation.

### GitHub secrets required

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `REACT_APP_BACKEND_URL`
- `REACT_APP_DEGREE_SERVICE_URL`
- `RENDER_DEPLOY_HOOK_URL`
- `HF_TOKEN`
- `HF_SPACE_REPO`

### What each secret does

- `VERCEL_TOKEN` authenticates the GitHub Action with Vercel.
- `VERCEL_ORG_ID` identifies the correct Vercel team or account.
- `VERCEL_PROJECT_ID` identifies the Vercel frontend project.
- `REACT_APP_BACKEND_URL` is compiled into the frontend build.
- `REACT_APP_DEGREE_SERVICE_URL` is compiled into the frontend build.
- `RENDER_DEPLOY_HOOK_URL` triggers a Render redeploy.
- `HF_TOKEN` must have permission to push to the target Hugging Face Space repo.
- `HF_SPACE_REPO` should be set to the Space repository path in the form `username/space-name`.

### Workflow branch rules

- The workflows only watch pushes to `main`.
- If you want preview deployments from another branch, duplicate or modify the workflow rules.

### Recommended deployment order

1. Deploy the backend on Render first.
2. Deploy the degree service on Hugging Face Spaces.
3. Deploy the frontend on Vercel last, after the public service URLs are known.

## 5) Environment files

The repo includes example environment files to keep local development and production deployment explicit:

- [frontend/.env.example](frontend/.env.example)
- [backend/.env.example](backend/.env.example)
- [degree-service/.env.example](degree-service/.env.example)

### Local development guidance

- Frontend local development should point at local backend and degree-service URLs.
- Backend local development should point at your local MongoDB instance and local frontend origin.
- Degree service local development should use your local frontend origin for CORS.

### Production guidance

- Do not commit real secrets into `.env` files.
- Keep environment values documented in the provider dashboards.
- When a public URL changes, update the corresponding CORS or frontend build variables before redeploying dependent services.

## 6) Build and runtime checks

### Frontend

- Build command: `npm run build`
- Static SPA routing is handled by `vercel.json` and the Nginx config used by the Docker image.

### Backend

- Start command: `node server.js`
- Health endpoint: `/api/health`
- Database connection is required at startup; Render must have a valid `MONGO_URI`.

### Degree service

- Start command: `uvicorn main:app --host 0.0.0.0 --port ${PORT:-5001}`
- Health endpoint: `/health`
- The service depends on the dataset files in `degree-service/data/`.

## 7) Troubleshooting

### Frontend returns 404 on refresh

- Confirm `frontend/vercel.json` is deployed.
- Confirm the Vercel project points to the correct root directory.

### Login works locally but not in production

- Confirm backend CORS includes the exact Vercel origin.
- Confirm the frontend is loaded over HTTPS.
- Confirm cookies are not being blocked by the browser.

### Backend fails to start on Render

- Check `MONGO_URI`.
- Check `JWT_SECRET`.
- Check the Render logs for database connection errors.

### Degree service fails to load recommendations

- Check `GOOGLE_GEMINI_API_KEY`.
- Confirm `data/` exists in the deployed Space.
- Confirm `requirements.txt` matches the running environment.
- Check that the Space has enough startup time for model loading.

### Frontend cannot reach the APIs

- Verify `REACT_APP_BACKEND_URL` and `REACT_APP_DEGREE_SERVICE_URL` point to public HTTPS URLs.
- Rebuild and redeploy the frontend after changing those values.

## 8) Suggested maintenance workflow

1. Update code in the service folder you changed.
2. Update the matching `.env.example` file if new environment variables are needed.
3. Merge the deployment changes into `main`.
4. Let the GitHub Actions workflow redeploy the affected service.
5. Verify the health endpoint and one representative user flow.

## 9) File references

- Frontend Docker image: [frontend/Dockerfile](frontend/Dockerfile)
- Frontend SPA routing: [frontend/vercel.json](frontend/vercel.json)
- Backend Docker image: [backend/Dockerfile](backend/Dockerfile)
- Degree service Docker image: [degree-service/Dockerfile](degree-service/Dockerfile)
- Frontend workflow: [.github/workflows/deploy-frontend-vercel.yml](.github/workflows/deploy-frontend-vercel.yml)
- Backend workflow: [.github/workflows/deploy-backend-render.yml](.github/workflows/deploy-backend-render.yml)
- Degree service workflow: [.github/workflows/deploy-degree-service-huggingface.yml](.github/workflows/deploy-degree-service-huggingface.yml)
