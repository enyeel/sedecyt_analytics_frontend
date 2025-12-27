# SEDECyT Analytics - Frontend Dashboard

![Status: Production](https://img.shields.io/badge/status-production-green)
![Platform: Firebase](https://img.shields.io/badge/Platform-Firebase-orange)
![Database: Supabase](https://img.shields.io/badge/Database-Supabase%20(Postgres)-green)

This is the serverless frontend dashboard for **SEDECyT Analytics**. This application consumes the high-speed API built by the `sedecyt_analytics_backend` to provide a modern, responsive, and real-time data visualization experience for the Secretariat of Economic Development, Science, and Technology (SEDECyT) of Aguascalientes.

* **View the Backend:** [sedecyt_analytics_backend](https://github.com/enyeel/sedecyt_analytics_backend)
* **View the Frontend:** `sedecyt_analytics_frontend` (This repo)
***

## The Problem: Why This Project Exists

Currently, SEDECyT's process for generating key economic reports is manual, slow, and error-prone:
1.  **Manual Data Entry:** Data is consolidated by hand from various sources (Google Forms, spreadsheets, etc.) into a central Excel file.
2.  **Static Reports:** This data is then manually transferred to PowerPoint presentations for analysis.
3.  **Inefficiency:** This workflow consumes dozens of hours, increases the risk of human error, and makes real-time data analysis impossible.

## The Solution: A Dynamic Visualization Platform

This frontend solves the problem by consuming the clean, reliable "master truth table" provided by the automated backend API.

Instead of static PowerPoints, this platform allows SEDECyT staff to:
1.  **Log In Securely:** Using an internal account authenticated by **Supabase Auth**.
2.  **View Real-Time Data:** Browse high-level dashboards in a responsive grid.
3.  **Drill Down:** Select a specific dashboard (e.g., "Análisis de Empresas") to see detailed charts and graphs.
4.  **Analyze:** Interact with dynamic charts (Bar, Pie, Line) rendered instantly with **Chart.js**.
5.  **Explore Raw Data:** Access a comprehensive table view to inspect the underlying data validated by the ETL pipeline.

This decouples the complex data-cleaning logic (Backend) from the user-facing presentation (Frontend), allowing for faster development and a much better user experience.

***

## Tech Stack

* **Framework:** **Next.js 16+** (App Router)
* **Language:** **JavaScript (React 19)**
* **Authentication:** **Supabase Auth** (Handles secure login and session management)
* **Data Fetching:** **SWR** (for efficient data caching and revalidation)
* **Hosting:** **Firebase Hosting**
* **CI/CD:** **GitHub Actions** (Automated build & deploy on `git push`)
* **Data Visualization:** **Chart.js** (via `react-chartjs-2`)
* **PDF Export:** **jsPDF** (for chart export functionality)
* **Styling:** **CSS Modules** & Global CSS Variables with dark mode support

***

## Project Status: ✅ Production Ready

This project is **fully deployed and operational** as part of a university internship program.

* **Core Architecture:** The Next.js 16 App Router structure is complete and production-ready.
* **Authentication:** Full Supabase Auth integration with token-based API authentication.
* **Component Architecture:** Complete "Master-Detail" component logic (`Login` -> `Home Grid` -> `Detail View` -> `Data Tables`).
* **CI/CD:** The GitHub Actions workflow for automated deployment to Firebase Hosting is **fully operational**.
* **Data Integration:** **Fully integrated** with the live backend API. All dashboards fetch real-time data from Supabase via the backend API.
* **Features:**
  * ✅ Interactive dashboard grid with real-time data
  * ✅ Detailed dashboard views with multiple chart types
  * ✅ Comprehensive data table explorer (companies, contacts, responses)
  * ✅ Chart export to PDF functionality
  * ✅ Responsive design with dark mode
  * ✅ Loading states and error boundaries
  * ✅ Sidebar navigation for quick dashboard switching

***

## 📂 Project Structure 

```bash
.
├── .github/
│   └── workflows/
│       ├── firebase-hosting-merge.yml      # CI/CD Pipeline (main branch)
│       ├── firebase-hosting-pull-request.yml # Preview deployments
│       └── keep_alive.yml                   # Service keep-alive workflow
├── app/
│   ├── components/
│   │   ├── AppHeader.js                    # Top navigation bar
│   │   ├── ChartCard.js                    # Chart renderer with export
│   │   ├── DashboardDetail.js              # Detailed dashboard view
│   │   ├── DashboardHome.js                # Dashboard grid (home view)
│   │   ├── DataDrawer.js                   # Bottom drawer for data tables
│   │   ├── DataTable.js                    # Interactive data table component
│   │   ├── ErrorBoundary.js                # Error handling component
│   │   ├── LoginForm.js                    # Authentication form
│   │   ├── Sidebar.js                     # Navigation sidebar
│   │   └── SkeletonLoader.js              # Loading state component
│   ├── update-password/
│   │   └── page.js                        # Password update page
│   ├── lib/
│   │   └── supabaseClient.js              # Supabase client configuration
│   ├── globals.css                        # Global styles & color palette
│   ├── layout.js                          # Root layout
│   └── page.js                           # Main page (view orchestrator)
├── public/
│   └── [logos and icons]                  # Static assets
├── .gitignore
├── firebase.json                          # Firebase Hosting config
├── next.config.mjs                        # Next.js config (static export)
├── package.json
└── README.md
```

***

## Getting Started (Local Development)

Instructions to get the project running locally.

### Prerequisites

* [Node.js](https://nodejs.org/) (v20.0.0 or later)
* [npm](https://www.npmjs.com/)

***

### 1. Clone the Repository

```bash
git clone https://github.com/enyeel/sedecyt_analytics_frontend.git
cd sedecyt_analytics_frontend
```

***

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

This project uses environment variables. Create a `.env.local` file in the root directory. **This file is git-ignored and should never be committed.**

```.env
# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL="https://[your-project-id].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[your-supabase-anon-key]"

# Backend API URL
NEXT_PUBLIC_API_URL="https://[your-backend-url].run.app"
```

***

### 4. Run the Development Server

```bash
npm run dev
```

The app will now be running and accessible at http://localhost:3000.

***

## 🚀 Deployment

Deployment is **fully automated** via GitHub Actions.

1.  **Configure Secrets:** The repository admin must set the following GitHub Repository Secrets:
    * `NEXT_PUBLIC_SUPABASE_URL`
    * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    * `NEXT_PUBLIC_API_URL`
    * `FIREBASE_SERVICE_ACCOUNT_SEDECYT_ANALYTICS`

2.  **Push to Main:** Any `git push` or merge to the `main` branch will automatically trigger the workflow defined in `.github/workflows/firebase-hosting-merge.yml`.

3.  **Live:** The workflow will:
    * Install dependencies (with npm cache optimization)
    * Build the static site (`npm run build`)
    * Deploy the `out/` folder to Firebase Hosting
    * The site will be live immediately after successful deployment

***

## Features

### Dashboard Views

* **Home Grid:** Browse all available dashboards in a responsive card layout
* **Detail View:** Deep dive into a specific dashboard with multiple interactive charts
* **Sidebar Navigation:** Quick access to switch between dashboards without returning to home

### Data Exploration

* **Data Table Drawer:** Access comprehensive table views of all data
* **Three Data Views:**
  * **Companies:** Complete company information with formatted columns
  * **Contacts:** Contact details with cleaned phone numbers and emails
  * **Responses:** Full historical response data with certification tracking
* **Interactive Tables:** Sortable columns, search functionality, and modal views for long text fields

### Chart Features

* **Multiple Chart Types:** Bar charts, Pie charts, and Line charts
* **Export to PDF:** Download any chart as a PDF document
* **Responsive Design:** Charts adapt to different screen sizes
* **Dark Mode Support:** Optimized color palette for dark theme

### User Experience

* **Authentication:** Secure login with Supabase Auth
* **Session Management:** Automatic token refresh and session handling
* **Loading States:** Skeleton loaders for smooth user experience
* **Error Handling:** Comprehensive error boundaries and user-friendly error messages
* **Performance:** SWR caching for instant data loading and reduced API calls

***

## API Integration

The frontend communicates with the backend API using authenticated requests:

* **Authentication:** All API requests include `Authorization: Bearer <token>` header
* **Data Fetching:** Uses SWR for intelligent caching and revalidation
* **Endpoints Used:**
  * `GET /api/dashboards` - List of all dashboards
  * `GET /api/dashboards/<slug>` - Complete dashboard with charts
  * `GET /api/data/companies-view` - Companies table data
  * `GET /api/data/contacts-view` - Contacts table data
  * `GET /api/data/responses-view` - Responses table data

***

## 👥 Collaborators

* **[Ángel](https://github.com/enyeel)** — Data processing, backend architecture & overall project design  
* **[Emilio](https://github.com/AngelGTZ28)** — API & infrastructure development (Google Cloud, Supabase integration)  
* **[Yara](https://github.com/Yara09-L)** — Frontend development & UI integration  

> _This project is part of the university internship program at SEDECYT Aguascalientes._

---

## 🔮 Future Improvements & Planned Features

* Optimize chart colors for automatic dark mode detection (HSL color adjustments)
* Add advanced filtering and search capabilities to data tables
* Implement data export functionality (CSV/Excel) from table views
* Add dashboard customization options (user preferences)
* Enhance chart interactivity (drill-down features, data point tooltips)
* Add real-time data updates via WebSockets or polling
* Implement comprehensive analytics tracking
* Add accessibility improvements (ARIA labels, keyboard navigation)
