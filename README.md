# 📄 Resume Manager

**Resume Manager** is a modern, self-hosted web application built with **Next.js (App Router)**, **Prisma**, **PostgreSQL**, and **Cloudflare R2** (S3-compatible storage) that allows you to manage and share your resumes securely, professionally, and dynamically.

---

## ✨ Key Features

- 🔐 **Secure User Authentication**: Full user registration and credentials-based login system powered by **NextAuth.js**.
- 📤 **Resume Storage (Cloudflare R2)**: Seamlessly upload and manage multiple resume documents. Files are stored securely on Cloudflare R2 Object Storage via the AWS S3 SDK.
- 🔗 **Dynamic Share Links**:
  - Generate custom links for any uploaded resume.
  - Toggle visibility status between **Public** (accessible to anyone with the link) and **Private** (accessible only to you).
- 🔄 **Hot-swappable Resumes**: Update the resume file associated with a shared link at any time without changing the URL. If a file is deleted, the link falls back gracefully to a "broken/unlinked" state, permitting easy re-linking.
- 📑 **In-Browser PDF Viewer**: Premium, responsive PDF renderer using `react-pdf` for instant previewing of shared resumes, alongside custom download functionality.
- 🎨 **Modern Dark Aesthetics**: Crafted with a premium dark-themed layout, smooth micro-interactions, and glassmorphic navigation components.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Actions)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/) with [Prisma](https://www.prisma.io/)
- **Object Storage**: [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/) / S3-compatible storage via `@aws-sdk/client-s3`
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) (Credentials Provider)
- **PDF Rendering**: `react-pdf` & `pdfjs-dist`

---

## 📂 Project Structure

```
├── actions/             # Next.js Server Actions (Auth, Files, Links management)
├── app/                 # Next.js App Router Pages and API Endpoints
│   ├── (protected)/     # Dashboard and protected routes
│   ├── api/             # Auth hooks and sharing download endpoints
│   ├── share/           # Shared resume dynamic views
│   └── page.tsx         # Welcome/Landing page
├── components/          # Reusable React components (PDF Viewer, layouts, modals)
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
Copy `.env.example` to `.env` (or create a new `.env` file) and fill in your database and storage details.

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
