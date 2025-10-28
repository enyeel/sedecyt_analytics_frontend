# SEDECyT Analytics - Frontend Dashboard

![Status: In Development](https://img.shields.io/badge/status-in%20development-yellow)
![Platform: Firebase](https://img.shields.io/badge/Platform-Firebase-orange)
![Database: Supabase](https://img.shields.io/badge/Database-Supabase%20(Postgres)-green)

This is the serverless frontend dashboard for **SEDECyT Analytics**. This application consumes the high-speed API built by the `sedecyt_analytics_backend` to provide a modern, responsive, and real-time data visualization experience for the Secretariat of Economic Development, Science, and Technology (SEDECyT) of Aguascalientes.

* **View the Backtend:** [sedecyt_analytics_backend](https://github.com/enyeel/sedecyt_analytics_backend)
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
3.  **Drill Down:** Select a specific dashboard (e.g., "Industrial Summary") to see detailed charts and graphs.
4.  **Analyze:** Interact with dynamic charts (Bar, Pie, LIne) rendered instantly with **Chart.js**

This decouples the complex data-cleaning logic (Backend) from the user-facing presentation (Frontend), allowing for faster development and a much better user experience.

***

## Tech Stack

* **Framework:** **Next.js 14+** (App Router)
* **Language:** **Javascript (React)**
* **Authentication:** **Supabase Auth** (Handless secure login and session management)
* **Hosting:** **Firebase Hosting**
* **CI/CD:** **Github Actions** (Automated build & deploy on `git push`)
* **Data Visualization:** **Chart.js** (via `react-chartjs-2`)
* **Styling:** **CSS Modules** & Global CSS Variables

***

## Project Status: 🚧 In Development

This project is actively being developed as part of a university internship.

* **Core Architecture:** The Next.js 14 App Router structure is in place.
* **Authentication:** The backend is successfully containerized with Docker and deployable to Google Cloud Run.
* **Component Architecture:** The "Master-Detail" component logic (`Login` -> `Home Grid` -> `Detail View`) is complete.
* **CI/CD:** The GitHub Actions workflow for automated deployment to Firebase Hosting is **complete**.
* **Data:** Currently using mock/static data (`MOCK_DASHBOARDS` en `page.js`).

Immediate next steps involve replacing the mock data with live API calls to the backend and refining the UI/UX.

***

## 📂 Project Structure 

```bash
.
├── .github/
│   └── workflows/
│       └── firebase-hosting-merge.yml  (CI/CD Pipeline)
├── app/
│   ├── components/
│   │   ├── ChartCard.js          (The chart "unpacker")
│   │   ├── DashboardDetail.js    (2 column view: Sidebar + Charts)
│   │   ├── DashboardHome.js      (Youtube style "Home" view)
│   │   └── LoginForm.js          (Login Form)
│   ├── lib/
│   │   └── supabaseClient.js     (Supabase Client)
│   ├── globals.css             (Official color palette and base styles)
│   ├── layout.js               (App Framework)
│   └── page.js                 (The “brain” - Goalkeeper/View Director)
├── public/
│   └── logo-sedec.png
├── .gitignore
├── firebase.json               (Firebase Hosting Config)
├── next.config.mjs             (Next.js Config for `output: 'export'`)
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
cd sedecyt_analytics_fronend
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
* `FIREBASE_SERVICE_ACCOUNT_SEDECYT_ANALYTICS`

2.  **Push to Main:** Any `git push` or merge to the `main` branch will automatically trigger the workflow defined in `.github/workflows/firebase-hosting-merge.yml`.
3.  **Live:** The workflow will install dependencies, build the static site (`npm run build`), and deploy the `out/` folder to Firebase Hosting.

***

## 👥 Collaborators

* **[Ángel](https://github.com/enyeel)** — Data processing, backend architecture & overall project design  
* **[Emilio](https://github.com/AngelGTZ28)** — API & infrastructure development (Google Cloud, Supabase integration)  
* **[Yara](https://github.com/Yara09-L)** — Frontend development & UI integration  

> _This project is part of the university internship program at SEDECYT Aguascalientes._

---

## 🔮 Future Improvements & Planned Features

* Replace all `MOCK_DASHBOARDS` data with `fetch` calls to the live [backend API](https://github.com/enyeel/sedecyt-analytics-frontend).
* Full styling of all components (cards, sidebars, charts) based on the official color palette.
* Implement functionality for "Dark Mode" and "Search" buttons in the header.
* Build polished "Loading" spinners and "Error" messages for API calls.
* Explore "drill-down" features for individual charts (e.g., clicking a bar to see the raw data). 
  
