# 📄 Resume Manager & AI Analyzer

**Resume Manager** is a self-hosted web application built with **Next.js (App Router)**, **Prisma**, **PostgreSQL**, and **Cloudflare R2** (S3-compatible storage) that allows you to manage, review, and share your resumes securely and professionally.

It features a built-in **AI Resume Analyzer** powered by OpenAI's `gpt-4o-mini` model, which provides technical recruiting feedback, ATS compatibility grading, skill assessments, and job description alignment reports.

---

## ✨ Key Features

### 1. 🔐 User Authentication & Dashboard
- Full registration and credential-based login powered by **NextAuth.js**.
- Independent panels layout: left navigation panel is static and allows independent scrolling of the right content panels (no content shifts on routes change).

### 2. 📤 Resume Storage & Uploads (PDF Only)
- Secure, high-speed document storage using **Cloudflare R2** (S3 compatible) object storage via the AWS S3 SDK.
- Strict client-side and server-side validation ensuring only `.pdf` format documents are uploaded or analyzed.

### 3. 🤖 AI Resume Analyzer
- **Auto PDF Text Extraction**: Extracts text directly from resumes on the server using the `pdf-parse` library.
- **Job Description Assessment**: Compares your resume against any pasted job requirements.
- **Interactive Metrics Dashboard**:
  - **Overall Score** (0-100 gauge).
  - **Metric Scores Breakdown**: ATS compatibility, experience quality, project quality, skills alignment, and readability & format.
  - **Recruiter Perspective**: Decision card outlining the reasoning on whether a recruiter would interview the candidate.
  - **Skills Evaluation**: Detects skills, outlines strongest competencies, and highlights missing core skills.
  - **ATS Structural Checker**: Identifies found standard sections, missing sections, and formatting issues.
  - **Job Match Analysis**: Keyword matching score, listing matched keywords vs. missing keywords.
  - **Strengths & Weaknesses**: Lists key highlights and areas for content improvement.
  - **Actionable Recommendations**: Clear, prioritized recommendations (High/Medium/Low) for upgrading the resume.
  - **Raw Text Inspector**: View parsed text outputs to check parsing fidelity.

### 4. 🔗 Share Link Generation & Analytics Tracking
- **Link Visibility**: Toggle sharing links between **Public** (accessible to anyone) and **Private** (accessible only to you).
- **Hot-swappable Resumes**: Update the underlying resume PDF connected to a share link at any time without changing the URL.
- **Interactive Statistics Drawer**:
  - Track **Total Views** and **Unique Visitors** (tracked via unique visitor UUID client cookies).
  - View full visitor histories: view counts, first visit date/time, and last visit date/time.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Actions)
- **AI / LLM Integration**: [OpenAI API](https://openai.com/) (`gpt-4o-mini` model)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/) with [Prisma](https://www.prisma.io/)
- **Object Storage**: [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/) via `@aws-sdk/client-s3`
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) (Credentials Provider)
- **PDF Rendering**: `react-pdf` & `pdfjs-dist`
- **Text Parser**: `pdf-parse`

---

## 📊 Database Schema

```mermaid
erDiagram
    User ||--o{ File : "uploads"
    User ||--o{ Link : "manages"
    File ||--o| Link : "maps to"
    File ||--o{ FileVisitor : "has"

    User {
        Int id PK
        String email UNIQUE
        String password
    }

    File {
        Int id PK
        String fileName
        String key
        Int userId FK
        Int totalViews
        Int uniqueVisitors
        DateTime createdAt
    }

    Link {
        Int id PK
        LinkType type
        Int fileId FK
        Int userId FK
        DateTime createdAt
    }

    FileVisitor {
        Int id PK
        Int fileId FK
        String visitorId
        Int views
        DateTime firstVisit
        DateTime lastVisit
    }
```

---

## 📂 Project Structure

```
├── actions/             # Next.js Server Actions (Auth, Files, Link managers, AI analysis)
├── app/                 # Next.js App Router Pages and API Endpoints
│   ├── (protected)/     # Dashboard and protected workspace routes
│   ├── api/             # Auth hooks and share API endpoints
│   ├── share/           # Shared resume dynamic views
│   └── page.tsx         # Welcome/Landing page
├── components/          # Reusable React components (PDF Viewer, layouts, modals, client dashboards)
├── config/              # Configuration files (Database client connection)
├── lib/                 # Utility libraries (Cloudflare R2/S3 client setup)
├── prisma/              # Prisma Database schemas and migrations
└── public/              # Static assets and icons
```

---

## ⚙️ Environment Variables

To run the application locally, you will need to create a `.env` file in the root directory. Below is the template showing all required environment variables:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_jwt_secret_key

# Database Connection (PostgreSQL)
DATABASE_URL="postgresql://username:password@localhost:5432/resume_manager?schema=public"

# Cloudflare R2 / S3-Compatible Object Storage Credentials
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_cloudflare_r2_access_key
R2_SECRET_ACCESS_KEY=your_cloudflare_r2_secret_key

# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here
```

---

## 🚀 Getting Started

Follow these steps to set up the project locally:

### 1. Clone & Install Dependencies
Ensure you have Node.js and `pnpm` installed on your machine.
```bash
git clone https://github.com/ArmaanSingh04/resume-manager.git
cd resume-manager
pnpm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` (or create a new `.env` file) and fill in your credentials.

### 3. Setup the Database
Run the Prisma migrations to create the database tables:
```bash
pnpm prisma migrate dev
```

### 4. Run the Development Server
Start the Next.js development server:
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 5. Build for Production
To build a production version of the application:
```bash
pnpm build
pnpm start
```
