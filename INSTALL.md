# Installation Guide - SEDECyT Analytics Frontend

This document provides detailed installation instructions for setting up the SEDECyT Analytics frontend dashboard locally.

## Prerequisites

* [Node.js](https://nodejs.org/) (v20.0.0 or later)
* [npm](https://www.npmjs.com/)

## Step-by-Step Installation

### 1. Clone the Repository

```bash
git clone https://github.com/enyeel/sedecyt_analytics_frontend.git
cd sedecyt_analytics_frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory. **This file is git-ignored and should never be committed.**

```.env
# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL="https://[your-project-id].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[your-supabase-anon-key]"

# Backend API URL
NEXT_PUBLIC_API_URL="https://[your-backend-url].run.app"
```

### 4. Run the Development Server

```bash
npm run dev
```

The app will now be running and accessible at http://localhost:3000.

### 5. Build for Production

```bash
npm run build
```

This creates an optimized production build in the `out/` directory.

### 6. Start Production Server (Optional)

```bash
npm start
```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, Next.js will automatically try the next available port (3001, 3002, etc.).

You can also specify a custom port:

```bash
PORT=3001 npm run dev
```

### Environment Variables Not Loading

Ensure:
1. The file is named `.env.local` (not `.env`)
2. Variables are prefixed with `NEXT_PUBLIC_` for client-side access
3. You've restarted the dev server after adding new variables

### Supabase Connection Issues

Verify:
1. Your `NEXT_PUBLIC_SUPABASE_URL` is correct (no trailing slash)
2. Your `NEXT_PUBLIC_SUPABASE_ANON_KEY` is the anon/public key (not the service role key)
3. Your Supabase project has the correct authentication settings

### Backend API Connection Issues

Verify:
1. Your `NEXT_PUBLIC_API_URL` points to a running backend instance
2. The backend CORS settings allow requests from `http://localhost:3000`
3. The backend is accessible and the `/api/health` endpoint responds

## Development Tips

### Hot Reload

Next.js automatically reloads when you save files. Changes to:
- React components: Instant reload
- CSS files: Instant reload
- Configuration files: May require server restart

### Debugging

Use browser DevTools:
- **Console:** For JavaScript errors and logs
- **Network:** To inspect API requests and responses
- **Application:** To check Supabase session storage

### Linting

Run the linter:

```bash
npm run lint
```

