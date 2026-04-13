# Tactile Terrain

Premium website for **Tactile Terrain** — a studio that designs and fabricates precision 3D topographic maps and immersive geographic installations for national parks, governments, hotels, conservation groups, and art institutions.

**Live:** [tactileterrain.maximinimal.ca](https://tactileterrain.maximinimal.ca)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | SQLite via Prisma 6 (PostgreSQL-ready) |
| 3D / WebGL | React Three Fiber + Three.js |
| Email | Resend API (with attachment support) |
| Fonts | Space Grotesk (headings), Inter (body) via `next/font` |
| Auth | iron-session (cookie-based, multi-password) |
| File Storage | Local filesystem (dev), Vercel Blob (production) |
| Image Optimization | Next.js Image with AVIF/WebP, shimmer loading |

---

## Features

### Public Website

#### Homepage
- Full-viewport hero with interactive WebGL 3D terrain background
- Editable tagline and intro text (managed via admin)
- Featured projects strip pulled from the database
- "Who We Work With" section with centered category icons
- CTA banner linking to custom orders
- Page transition animations on all navigation (fade + slide up via `template.tsx`)

#### WebGL Terrain (Hero)
- Procedurally generated low-poly terrain mesh using simplex noise
- Flat-shaded with elevation-based color gradient (deep navy to steel blue peaks)
- Slow auto-rotation on Y axis
- Mouse-driven parallax tilt effect
- **Mouse-driven spotlight sun** — spot light orbits the terrain following cursor, casting real-time shadows with 2048x2048 shadow map
- **Vertex pulse animation** — 80 random points gently displace with sine waves for organic breathing motion
- **Color sweep** — branding colors (blue, gold, teal) sweep bottom-to-top every 5 seconds using pre-computed LUT (zero allocations per frame)
- Hemisphere + ambient + cool fill lighting for depth
- Graceful fallback to static gradient when WebGL unavailable
- Dynamic import with `ssr: false` for performance

#### Gallery (`/gallery`)
- Uniform grid layout with fixed 4:3 aspect ratio cards
- Always-visible title, category badge, location, year, and scale metadata
- Photo count badge on multi-image projects
- Category filter pills (All, Conservation, Government, Installation, Personal)
- Click-to-open lightbox with image carousel
- **Shimmer skeleton loading** — animated gradient placeholder while images load
- **Blur-to-sharp fade-in** on image load completion
- Lightbox image transition animation on prev/next (blur fade via `key` remount)
- Keyboard navigation (Escape, Arrow keys)
- Placeholder cards with icon for projects without images
- 12 portfolio projects seeded from tactileterrain.ca

#### About (`/about`)
- Page title with italic quote
- **"Our Story" with integrated photo collage** — text on left, workshop photos on right in masonry layout (first image wide 2:1, rest 4:3 grid)
- Photos managed via dedicated admin page (not raw JSON)
- Shimmer loading on all photos
- 4-step process timeline: Design, Model, Finish, Install
- Team grid with photos, names, roles, and companies (7 members seeded)

#### Technology (`/technology`)
- **Fully database-driven** — all sections editable via admin panel
- Alternating image/text two-column layout for visual rhythm
- Luminous Cartographs featured as "Signature Technology" at top with real photo
- Real photos from Tactile Terrain for Luminous Cartographs, hand painting, and LED overlays
- Pexels stock images for CNC milling, 3D printing, and GIS processing
- Subtle color-grade overlay on all images for unified aesthetic
- **"Our Work" CTA** at bottom linking to gallery
- Sections: Luminous Cartographs, GIS Data Processing, CNC Milling, 3D Printing, Hand Finishing & Painting, Interactive Digital Overlays

#### Custom Orders (`/custom-orders`)
- Use case cards: Government/Parks, Hotels, Data Visualization, Art Commissions
- Custom process explanation with pricing factors
- Detailed inquiry form: Name, Email, Organization, Project Type, Scale, Timeline, Budget Range, Description, File Upload
- Budget ranges: Under $25K, $25K-$50K, $50K-$100K, $100K+, Not sure yet
- File attachment support (PDF, images, docs up to 10MB)
- Form submissions saved to database and emailed via Resend (with file attached)

#### Contact (`/contact`)
- Contact form: Name, Email, Subject, Message
- Studio info sidebar with editable region, location, and store link (all from DB)
- Form submissions saved to database and emailed via Resend
- Map embed placeholder

#### Navigation & Layout
- **Always-dark navbar** (`#0F1A2A`) on all pages — consistent brand presence
- Tactile Terrain logo with **one-time 3D spin animation** on page load (rotateY with bounce)
- **"Tactile Terrain™"** brand text slides in alongside logo on load
- Frosted-glass backdrop blur on scroll
- Mobile hamburger menu with full-screen dark overlay
- "Get in Touch" CTA button in nav
- **Always-dark footer** matching navbar with navigation, studio info, and editable tagline
- **"Web design by Maximinimal"** credit in footer linking to www.maximinimal.ca
- Consistent `max-w-7xl` + `px-6 md:px-12` padding alignment across navbar and all page content
- Scroll-triggered section animations via IntersectionObserver (visible by default, animate as enhancement)

#### Image Loading UX
- **Shimmer skeleton** — animated gradient placeholder (light gray sweep) while images load
- **Blur-to-sharp transition** — images start blurred and slightly scaled, fade to crisp on load
- Applied across gallery, featured projects, about page, and lightbox
- **Next.js Image optimization** — AVIF/WebP format auto-conversion, responsive device sizes (640-1200px), smaller thumbnail sizes

---

### Admin Panel (`/admin`)

**Access:** `/admin/login` — password-protected with iron-session cookies.

#### Dashboard
- Overview cards: Gallery Items count, Contact Messages (with unread count), Custom Inquiries (with unread count), Team Members

#### Gallery Manager
- List all projects with thumbnails, category, featured star
- Create new gallery items with title, slug, description, category, scale, year, location
- Edit existing items inline
- Multi-image upload via drag-and-drop
- Featured toggle for homepage display
- Sort order control
- Delete with confirmation

#### Homepage Editor
- Edit hero tagline
- Edit intro text
- Select featured projects via checkbox list

#### About Page Editor
- **Visual image grid manager** for workshop photos
- Upload new photos via drag-and-drop
- Edit alt text per photo
- Remove individual photos
- Save all changes at once
- JSON storage hidden from Site Content text editor (managed via dedicated UI)

#### Technology Editor
- Full CRUD for technology page sections
- Edit title, description, detail text, badge label
- Upload/replace section images
- Sort order control
- Create new sections
- Delete sections

#### Inquiries Inbox
- Tabbed view: Contact Messages | Custom Order Inquiries
- Unread count badges
- Click to expand full details
- Read/unread status tracking
- Direct "Reply to email" links
- File attachment links for custom inquiries

#### Team Manager
- View all team members with photos
- **Edit existing members** (name, role, company, photo) — inline edit form
- Add new members with image upload
- Delete with confirmation

#### Site Content Editor
- Key-value editor for all site-wide text and settings
- **Single-line inputs** for short values (URLs, emails, names, passwords)
- **Textareas** for long content (stories, descriptions)
- **Password masking** with show/hide toggle for sensitive fields
- Per-entry save buttons with success confirmation
- JSON-based entries (like about_hero_images) hidden — managed via dedicated admin pages

**Editable fields include:**

| Key | Controls |
|-----|----------|
| Studio Region | Footer + Contact page |
| Studio Location | Footer + Contact page |
| Etsy Store URL | Footer + Contact page link destination |
| Etsy Link Text | Footer + Contact page link label |
| Footer Tagline | Footer description text |
| About Story | About page company story |
| Resend API Key | Email notification sending (masked) |
| Notification Email | Where form submissions are emailed |
| Email From Address | Sender address for notifications |
| Admin Primary Password | Login password (masked) |
| Admin Extra Passwords | Additional login passwords (one per line) |

#### Admin Authentication
- **Multi-password support** — primary password + additional passwords (one per line)
- Passwords stored in database, editable from admin panel
- Fallback to `ADMIN_PASSWORD` env var if DB has no passwords
- iron-session cookie with 24h TTL
- Middleware protects all `/admin/*` and `/api/admin/*` routes

---

### Email Notifications (Resend)

- Contact form submissions emailed with styled HTML template (blue accent header)
- Custom inquiry submissions emailed with all fields + **file attachment**
- Attachments fetched as Buffer and sent inline via Resend API (same pattern as fleetaxis)
- Configurable API key, from address, and recipient — all via admin panel
- Graceful skip when not configured (logged to console)
- Currently configured: `noreply@maximinimal.ca` → `existere@gmail.com`

---

### Database Schema (Prisma)

| Model | Purpose |
|-------|---------|
| `GalleryItem` | Portfolio projects (title, slug, description, category, scale, year, location, sortOrder, featured) |
| `GalleryImage` | Multi-image support per gallery item (url, alt, sortOrder) |
| `ContactSubmission` | Contact form entries (name, email, subject, message, read status) |
| `CustomOrderInquiry` | Custom order form entries (all fields + file URL, read status) |
| `HomepageContent` | Singleton — hero tagline and intro text |
| `TeamMember` | Team members (name, role, company, imageUrl, sortOrder) |
| `SiteContent` | Key-value store for all editable site text, settings, and JSON data |
| `TechnologySection` | Technology page sections (title, description, detail, image, badge, sortOrder) |

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm

### Setup

```bash
# Clone the repository
git clone <repo-url>
cd tactile-terrain

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Generate Prisma client and create database
npx prisma generate
npx prisma db push

# Seed database with portfolio content
npx prisma db seed

# Start development server
npm run dev -- -p 5650
```

### Environment Variables

```env
# SQLite (local development)
DATABASE_URL="file:./dev.db"

# Admin login password (fallback if not set in DB)
ADMIN_PASSWORD="your-password-here"

# Session encryption key (must be 32+ characters)
SESSION_SECRET="your-secret-key-at-least-32-characters-long"

# Site URL
NEXT_PUBLIC_SITE_URL="http://localhost:5650"

# Optional: Vercel Blob (production image uploads)
BLOB_READ_WRITE_TOKEN=""
```

### Production Build

```bash
npm run build
npm start -- -p 5650 -H 0.0.0.0
```

### Production with PostgreSQL

Update `.env`:
```env
DATABASE_URL="postgresql://user:password@host:5432/dbname?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/dbname"
```

Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

Then run:
```bash
npx prisma migrate deploy
npx prisma db seed
```

---

## Project Structure

```
src/
├── app/
│   ├── (public)/               # Public pages
│   │   ├── page.tsx            # Homepage
│   │   ├── gallery/            # Gallery page
│   │   ├── about/              # About page
│   │   ├── technology/         # Technology page (DB-driven)
│   │   ├── custom-orders/      # Custom orders + inquiry form
│   │   ├── contact/            # Contact page
│   │   ├── layout.tsx          # Public layout (navbar + footer)
│   │   └── template.tsx        # Page transition animation
│   ├── (admin)/                # Admin panel
│   │   └── admin/
│   │       ├── page.tsx        # Dashboard
│   │       ├── login/          # Login page
│   │       ├── gallery/        # Gallery CRUD
│   │       ├── homepage/       # Homepage editor
│   │       ├── about/          # About page photo manager
│   │       ├── technology/     # Technology section editor
│   │       ├── inquiries/      # Inbox
│   │       ├── team/           # Team manager (add/edit/delete)
│   │       └── content/        # Site content editor
│   ├── api/                    # API routes
│   │   ├── admin/              # Protected admin APIs (gallery, upload, homepage, technology, team, content, inquiries, login, logout)
│   │   ├── contact/            # Contact form → DB + email
│   │   └── inquiries/          # Custom order → DB + email + attachment
│   └── layout.tsx              # Root layout
├── components/
│   ├── layout/                 # Navbar (dark, animated logo), Footer (dark, Maximinimal credit)
│   ├── ui/                     # Button, Section, FormField, Lightbox, AnimatedSection, LoadingImage
│   ├── three/                  # TerrainMesh (pulse + color sweep), TerrainScene, SunLight (mouse-driven spotlight)
│   ├── home/                   # Hero, IntroSection, FeaturedProjects, ClientsSection, CtaBanner
│   ├── gallery/                # GalleryGrid (shimmer loading, lightbox)
│   ├── about/                  # TeamGrid, ProcessTimeline
│   ├── contact/                # ContactForm
│   ├── custom-orders/          # InquiryForm (file upload, budget ranges)
│   └── admin/                  # AdminShell, GalleryForm, ImageUploader, TechnologyManager, TeamManager, AboutImagesManager, HomepageEditor, InquiriesInbox, ContentEditor
├── lib/
│   ├── prisma.ts               # Prisma client singleton
│   ├── session.ts              # iron-session config (separate SESSION_SECRET)
│   ├── validations.ts          # Zod schemas (contact, custom order, gallery item, homepage)
│   ├── utils.ts                # cn() helper (clsx + tailwind-merge)
│   ├── email.ts                # Resend email with HTML templates + attachment support
│   └── studio-info.ts          # Studio info fetcher (region, location, etsy, tagline)
└── middleware.ts                # Admin route protection
```

---

## Seeded Content

- **12 portfolio projects** scraped from tactileterrain.ca (8 with full descriptions + images, 4 with enriched placeholder text + discovered images)
- **7 team members** with roles and company affiliations
- **6 technology sections** with descriptions and images
- **4 workshop photos** for the About page
- **Homepage content** (tagline + intro)
- **Studio info** (region, location, Etsy store URL + label)
- **Email settings** (Resend API key, from address, notification email)
- **Admin password** (stored in DB, changeable from admin)

---

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#F5F6F8` | Page body |
| Foreground | `#1A1D24` | Body text |
| Accent | `#2D7A9C` | Links, buttons, badges |
| Gold | `#B8942F` | CTA highlights |
| Surface | `#FFFFFF` | Cards |
| Surface Light | `#EDF0F4` | Alternating section backgrounds |
| Muted | `#6B7589` | Secondary text |
| Border | `#D4D9E2` | Dividers, card borders |
| Nav/Footer | `#0F1A2A` | Always-dark chrome |
| Hero | Gradient `#0A1628` → `#0F1A2A` → `#162A3E` | Hero background |

**Typography:** Space Grotesk (headings, -0.02em tracking) + Inter (body)

---

## License

Private project for Tactile Terrain.
Web design by [Maximinimal](https://www.maximinimal.ca).
