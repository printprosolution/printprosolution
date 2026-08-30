# PrintPro Solutions Lahore — Website + Admin Dashboard

Production-ready Next.js 14 (App Router) business website for a photocopier
rental company in Lahore, Pakistan, with a full self-service admin dashboard.

## Tech Stack

- **Next.js 14** (App Router, Server Actions)
- **Tailwind CSS** + hand-built shadcn/ui-style components (Button, Input, Card, etc.)
- **Prisma + SQLite** (swap to Postgres in one line for serverless hosts — see below)
- **NextAuth v4** (Credentials provider, JWT session, 30-day login persistence)
- **Local file uploads** to `/public/uploads`

---

## 1. Prerequisites

- Node.js 18.18 or newer
- npm (comes with Node)
- Git

## 2. Setup — Step by Step

```bash
# 1. Install dependencies
npm install

# 2. Create your real .env file from the example
cp .env.example .env
```

Open `.env` and fill in:

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="<generate with: openssl rand -base64 32>"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_USERNAME="asadmughal8626"
ADMIN_PASSWORD_HASH="<see step 3>"
```

```bash
# 3. Generate a bcrypt hash for your real admin password
#    (never store the plain password anywhere in the project)
npm run hash-password -- "00119900*$#@"
```

Copy the printed `ADMIN_PASSWORD_HASH="..."` line into your `.env` file.

```bash
# 4. Create the SQLite database and tables
npm run db:migrate

# 5. Seed initial products, testimonials and site content
npm run db:seed

# 6. Run the development server
npm run dev
```

Visit **http://localhost:3000** for the public site.

## 3. Accessing the Admin Dashboard

Two ways in:

1. Go directly to **http://localhost:3000/admin**
2. Or, from any public page, type `#admin` at the end of the URL, e.g.
   `http://localhost:3000/#admin` — a small script detects the hash and
   redirects you to the real `/admin` login page.

> **Why not a literal `printpro.com#admin` server route?** Browsers never
> send anything after `#` to the server — it's a browser-only fragment.
> No website (including GCS or Xerox) can make the server itself react to
> a hash. What we built is the standard real-world equivalent: a tiny
> client-side script watches for `#admin` and redirects you to the actual
> `/admin` page, which is fully protected server-side by NextAuth +
> middleware. The security boundary is the login + session, not the URL.

Log in with the username/password you configured in `.env`. Thanks to the
30-day JWT session, you won't be asked to log in again on the same browser
until it naturally expires or you click **Logout**.

## 4. What You Can Edit From the Dashboard

| Section | What it controls |
|---|---|
| **Products** | Add/edit/delete products — name, price, category, description, image upload |
| **Website Content** | Company name, homepage hero text/image, about text/image, services intro, SEO title/description/keywords |
| **Contact Info** | Contact name, phone, email, address — shown in footer + /contact page |
| **Messages** | Every /contact form submission, with date/name/email/message, mark-as-read and delete |
| **Testimonials** | Add/delete client testimonials with rating and optional photo |

Every change uses a Server Action + `revalidatePath`, so the public site
updates immediately — no rebuild or redeploy needed.

## 5. Project Structure

```
printpro-solutions/
├── prisma/
│   ├── schema.prisma        # Product, Testimonial, ContactMessage, SiteContent
│   └── seed.ts               # initial demo data
├── public/uploads/           # uploaded product/testimonial images land here
├── scripts/
│   └── hash-password.ts      # generates bcrypt hash for admin password
├── middleware.ts              # protects /admin/dashboard/*
└── src/
    ├── app/
    │   ├── layout.tsx                     # root shell + #admin watcher
    │   ├── (site)/                        # public site, wrapped in Navbar/Footer
    │   │   ├── layout.tsx
    │   │   ├── page.tsx                   # homepage
    │   │   ├── services/page.tsx
    │   │   ├── products/page.tsx
    │   │   ├── about/page.tsx
    │   │   └── contact/page.tsx
    │   ├── admin/
    │   │   ├── page.tsx                   # login gate (redirects if session exists)
    │   │   └── dashboard/
    │   │       ├── layout.tsx             # sidebar + auth guard
    │   │       ├── page.tsx               # overview
    │   │       ├── products/page.tsx
    │   │       ├── content/page.tsx
    │   │       ├── contact-info/page.tsx
    │   │       ├── messages/page.tsx
    │   │       └── testimonials/page.tsx
    │   ├── api/
    │   │   ├── auth/[...nextauth]/route.ts
    │   │   └── upload/route.ts            # saves images to /public/uploads
    │   ├── sitemap.ts
    │   └── robots.ts
    ├── components/
    │   ├── navbar.tsx, footer.tsx, admin-hash-redirect.tsx, contact-form.tsx
    │   ├── product-card.tsx
    │   ├── ui/                            # Button, Input, Textarea, Card, Label, Badge
    │   └── admin/                         # sidebar, login-form, image-uploader, forms, tables
    ├── actions/                            # Server Actions (products, content, testimonials, messages)
    ├── lib/                                 # prisma.ts, auth.ts, utils.ts
    └── types/next-auth.d.ts
```

## 6. Pushing to GitHub

```bash
git init
git add .
git commit -m "Initial commit: PrintPro Solutions Lahore website"
git branch -M main
git remote add origin <your-empty-github-repo-url>
git push -u origin main
```

`.env`, `prisma/dev.db` and `/public/uploads/*` are already excluded via
`.gitignore` — your real password and uploaded images never get committed.

## 7. Deploying to Vercel

SQLite works locally, but **Vercel's filesystem is read-only in
production and resets on every deploy** — so both your database file and
`/public/uploads` will NOT persist there. For a real Vercel deployment:

1. **Database:** create a free Postgres database (e.g. Neon or Vercel
   Postgres), then in `prisma/schema.prisma` change:
   ```prisma
   datasource db {
     provider = "postgresql"   // was "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
   Set `DATABASE_URL` in Vercel's Environment Variables to the Postgres
   connection string, then run `npx prisma migrate deploy`.

2. **Image uploads:** swap the `/api/upload` route to upload to a
   persistent store instead of the local disk — e.g. Vercel Blob,
   Cloudinary, or an S3 bucket. (The current `/public/uploads` approach
   is correct and fully production-ready for a normal VPS/Hostinger/
   DigitalOcean deployment where the filesystem does persist.)

3. Add all `.env` variables (`DATABASE_URL`, `NEXTAUTH_SECRET`,
   `NEXTAUTH_URL` — set to your real domain, `ADMIN_USERNAME`,
   `ADMIN_PASSWORD_HASH`) in the Vercel project's Environment Variables.

4. Push to GitHub, then import the repo in Vercel — it will auto-detect
   Next.js and deploy.

**Simplest alternative:** deploy on a normal Linux VPS (Hostinger,
DigitalOcean, Contabo) with `npm run build && npm run start` behind
Nginx — SQLite and `/public/uploads` work exactly as-is with zero
changes, since the filesystem persists there.

## 8. Updating SEO Once Your Business Name Is Finalized

Go to **Admin → Website Content → SEO Settings** and update:
- **SEO Title** — appears as the Google search result headline
- **SEO Description** — appears as the Google search result snippet
- **SEO Keywords** — add your finalized company name plus terms like
  *"Ricoh 3510 on rent"*, *"Xerox photocopier rental for banks"*,
  *"printer rental for universities Lahore"*

These fields are already wired into every page's metadata and the
sitemap, so changes take effect immediately — no code changes needed.
