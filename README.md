# 🚀 Portfolio OS — Full-Stack Developer Operating System

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-3178C6?logo=typescript&logoColor=white)](tsconfig.json)
[![Astro](https://img.shields.io/badge/Astro-4.15+-BC52EE?logo=astro&logoColor=white)](https://astro.build)
[![React](https://img.shields.io/badge/React-18.3+-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-38B2AC?logo=tailwind-css&logoColor=white)](tailwind.config.mjs)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas_Ready-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Portfolio OS** is a production-grade, full-stack Personal Portfolio Operating System and Headless Content Management System (CMS). Built with **Astro 4**, **React 18**, **TypeScript**, **Tailwind CSS**, and **MongoDB Atlas**, it is designed to showcase engineering projects, track continuous learning, visualize academic trajectories, and manage published content through a secured administrative dashboard.

---

## 🌟 Key Highlights & Features

### 🖥️ Public Portfolio Interface
- **Dynamic Hero Section**: Real-time availability badges, live stats ticker (projects, blogs, commits, CGPA), and social links.
- **WIP / Under-Development Indicator**: Sleek, mobile-responsive diagonal callout communicating active development and preview draft status.
- **Engineering Showcase (Projects)**: Filterable case studies, technology chips, architecture metrics, and live GitHub/demo links (`/projects`).
- **Technical Knowledge Base (Blog)**: Technical writing engine with reading-time calculations, tags, and category filtering (`/blog`).
- **Continuous Learning & Tech Radar**: Visual proficiency trackers, learning progress curves, and recommended resources (`/learning`).
- **Engineering Journey Timeline**: Chronological milestone tracker documenting career, academic, and development stages (`/journey`).
- **Academic Performance Curve**: Custom high-resolution vector SGPA/CGPA trajectory line chart and semester course breakdowns (`/academics`).
- **Freelance & Client Work**: Case studies and client deliverable highlights (`/freelancing`).
- **Open Source Activity**: Live GitHub stats synchronization (commits, repositories, pull requests) via GitHub REST API.
- **Global Search (`Ctrl+K` / `Cmd+K`)**: Instant modal search with debounced suggestions querying across all collections.
- **Direct Contact System**: Contact form connected to MongoDB database with validation and spam protection (`/contact`).

---

### 🛡️ Administrative CMS Dashboard (`/dashboard`)
- **Secure Authentication (`/login`)**:
  - Zero hardcoded credentials in source code.
  - PBKDF2 password verification with salt hashing.
  - HTTP-only, SameSite secure session cookies with automatic expiration.
  - Role-Based Access Control (RBAC).
- **Comprehensive CMS Controls**:
  - **Projects Management**: Create, edit, duplicate, archive, and publish project case studies.
  - **Blog Publisher**: Full article editor with live status toggling (Draft / Published).
  - **Learning & Skills Tracker**: Manage technologies, proficiency percentages, and roadmap goals.
  - **Journey Milestones**: Update career milestones, education badges, and stage dates.
  - **Academics & Grades**: Manage term SGPA/CGPA records and subject coursework.
  - **Site Settings**: Centralized configuration for profile details, social handles, and SEO metadata.

---

### ⚡ Architecture & Performance
- **Astro Island Architecture**: Critical UI rendered statically with selective deferred hydration (`client:visible` / `client:load`).
- **Layered Clean Architecture**:
  - `src/server/db/` — Mongoose ODM schemas, connection pooling, and health monitors.
  - `src/server/repositories/` — Decoupled data access layer with type-safe operations.
  - `src/server/services/` — Business logic and cache orchestration.
  - `src/server/controllers/` — Request handling and response formatting.
  - `src/server/middleware/` — Security, rate limiting, and session verification.
- **In-Memory TTL Cache**: Sub-millisecond response times for frequent read queries with automatic cache invalidation on mutations.
- **SEO & Discoverability**:
  - Dynamic XML sitemap (`/sitemap.xml`)
  - RSS 2.0 Feed (`/rss.xml`)
  - Semantic Schema.org JSON-LD structured metadata
  - Automated OpenGraph and Twitter card tags

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | [Astro 4](https://astro.build) (SSR & Hybrid Rendering) |
| **UI Components** | [React 18](https://react.dev), [Tailwind CSS](https://tailwindcss.com), [Framer Motion](https://www.framer.com/motion/) |
| **Icons & Typography** | [Lucide React](https://lucide.dev), [@fontsource/inter](https://fontsource.org) |
| **Backend & APIs** | Astro API Routes (`/api/v1/*`), Node.js adapter |
| **Database & ODM** | [MongoDB Atlas](https://www.mongodb.com/atlas), [Mongoose 9](https://mongoosejs.com) |
| **Schema Validation** | [Zod 3](https://zod.dev) |
| **Authentication** | Node.js native `crypto` (PBKDF2), HTTP-only cookies |
| **Storage (Optional)** | [Cloudinary](https://cloudinary.com) CDN integration |

---

## 📁 Project Directory Structure

```text
Ankit Portfolio OS/
├── docs/                      # Architectural specs & documentation
├── public/                    # Static assets, fonts, icons, resume
├── src/
│   ├── components/            # Reusable React & Astro components
│   │   ├── blog/              # Blog reading & article components
│   │   ├── cards/             # Glassmorphism cards & project cards
│   │   ├── common/            # Modals, Command Menu, Error Boundaries
│   │   ├── contact/           # Contact form & social links
│   │   ├── dashboard/         # CMS administrative control components
│   │   ├── home/              # Hero, Featured, Learning, Academic sections
│   │   ├── navigation/        # Header navbar, mobile drawer, footer
│   │   └── ui/                # Buttons, Badges, Tooltips, Chips
│   ├── data/                  # Static data models & fallback datasets
│   ├── layouts/               # BaseLayout, PublicLayout, DashboardLayout
│   ├── lib/                   # API clients, HTTP fetchers, helpers
│   ├── pages/                 # File-based routing (SSR & Static pages)
│   │   ├── api/v1/            # REST API endpoints (Auth, Projects, Blogs, etc.)
│   │   ├── blog/              # Public blog listing and reading pages
│   │   ├── dashboard/         # Admin CMS dashboard views
│   │   ├── projects/          # Case study pages
│   │   └── index.astro        # Homepage
│   ├── server/                # Clean Architecture backend layer
│   │   ├── auth/              # PBKDF2 hashing, session management, RBAC
│   │   ├── config/            # Strict Zod environment parser (env.ts)
│   │   ├── controllers/       # API controllers
│   │   ├── db/                # Mongoose connection & data models
│   │   ├── middleware/        # Auth, CORS, Rate limiting, Request logging
│   │   └── services/          # Business logic services
│   └── styles/                # Global CSS design tokens and theme variables
├── .env.example               # Safe environment configuration template
├── .gitignore                 # Airtight secret and artifact exclusions
├── astro.config.mjs           # Astro build and adapter configurations
├── package.json               # Dependencies and build scripts
├── tailwind.config.mjs        # Tailwind design tokens & dark theme
└── tsconfig.json              # Strict TypeScript configuration
```

---

## ⚡ Getting Started

### 1. Prerequisites
- **Node.js** (v18.18+ or v20+)
- **npm** or **pnpm**
- **MongoDB Atlas** cluster URI (or local MongoDB instance)

### 2. Clone the Repository
```bash
git clone https://github.com/ankitxdev-me/MyPortfolio-OS.git
cd MyPortfolio-OS
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy the template configuration file:
```bash
cp .env.example .env
```

Open `.env` and fill in your values:
```env
# Database Connection (Required)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?appName=PortfolioOS
MONGODB_DB_NAME=portfolio_os

# Application Configuration
NODE_ENV=development
PORT=4321

# Authentication Security (Generate a secure 32+ char key)
JWT_SECRET=your-random-jwt-secret-key-32-characters-minimum
AUTH_SECRET=your-random-jwt-secret-key-32-characters-minimum
AUTH_EXPIRES_IN=7d

# CMS Administrator Credentials (For logging into /login)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-secure-admin-password
ADMIN_NAME="Ankit Gupta"

# Public Contact Details
CONTACT_EMAIL=contact@example.com
AUTHOR_EMAIL=contact@example.com

# GitHub Integration (Optional - boosts rate limits for stats)
GITHUB_TOKEN=
```

> [!IMPORTANT]
> The `.env` file is strictly ignored by Git and must never be committed. All sensitive credentials are loaded dynamically at runtime.

### 5. Run the Local Development Server
```bash
npm run dev
```

Visit **`http://localhost:4321`** in your browser.

---

## 📋 Available NPM Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Astro development server with Hot Module Replacement |
| `npm run check` | Runs Astro diagnostic type-checker across all `.astro`, `.ts`, and `.tsx` files |
| `npm run build` | Compiles production bundle with type validation |
| `npm run preview` | Runs the compiled production build locally for verification |

---

## 🔐 Security Architecture

- **Zero-Secret Source Code**: All database URIs, passwords, and tokens are strictly kept out of version control.
- **PBKDF2 Password Hashing**: Administrator credentials use salted PBKDF2 hashing with 100,000 iterations.
- **HTTP-Only Cookies**: Session tokens are isolated from client-side scripts, mitigating XSS extraction.
- **Strict Validation**: All incoming requests and environment variables are strictly verified using Zod schemas.
- **Defensive Database Handling**: Mongoose connection pools automatically reconnect with health probe endpoints at `/api/v1/health/db`.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
