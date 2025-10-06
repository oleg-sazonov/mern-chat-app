# MERN Chat App

A real-time chat application built with MongoDB, Express, React, and Node.js. The backend serves the built React app and exposes authenticated REST APIs and Socket.IO events.

## Prerequisites

-   Node.js ≥ 18
-   npm ≥ 9
-   Accessible MongoDB instance (local or cloud)
-   Configured `.env` file in the project root

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

> For production deployments, set `NODE_ENV=production`.

## Project Structure

```
mern-chat-app/
├── backend/        # Express API, Socket.IO, MongoDB models
├── frontend/       # React (Vite) SPA
├── .env            # Environment variables (not committed)
├── package.json    # Root scripts for install/build/start
└── ...
```

## Install Dependencies (root + frontend)

```bash
cd mern-chat-app
npm install
```

The root `npm install` also installs the frontend dependencies via the `mern-chat-app` workspace reference.

## Running Locally (Development)

1. **Backend + Socket.IO**

    ```bash
    npm run server
    ```

    Runs `nodemon backend/server.js`, exposing APIs on `http://localhost:5000`.

2. **Frontend (Vite dev server)**

    ```bash
    npm run frontend
    ```

    Launches Vite on `http://localhost:5173` with HMR. APIs proxy to `http://localhost:5000`.

To stop, press `Ctrl+C` in each terminal.

## Building the Production Bundle

```bash
npm run build
```

This script performs:

1. `npm install` (safety check on deployment platforms)
2. `npm install --prefix frontend`
3. `npm run build --prefix frontend` (creates `frontend/dist`)
4. Leaves backend ready to serve static assets from `frontend/dist`

### Verifying the Production Build Locally

```bash
npm start          # Runs node backend/server.js
# Visit http://localhost:5000 – the compiled React app and APIs are served together
```

If you want a dedicated frontend preview only:

```bash
npm run frontend:preview
```

## Useful Scripts

| Script                     | Description                                           |
| -------------------------- | ----------------------------------------------------- |
| `npm run server`           | Dev backend with nodemon                              |
| `npm run frontend`         | Dev frontend (Vite)                                   |
| `npm run build`            | Install deps, build frontend                          |
| `npm run start`            | Start production server (serves API + built frontend) |
| `npm run frontend:build`   | Build frontend only                                   |
| `npm run frontend:preview` | Preview Vite build locally                            |

## Logging & Health

-   Health check endpoint: `GET /health`
-   Console logs indicate server mode and MongoDB connection events.

## License

ISC
