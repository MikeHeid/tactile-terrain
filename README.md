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
| Email | Resend API |
| Fonts | Space Grotesk (headings), Inter (body) via `next/font` |
| Auth | iron-session (cookie-based) |
| File Storage | Local filesystem (dev), Vercel Blob (production) |

---

## Features

### Public Website

#### Homepage
- Full-viewport hero with interactive WebGL 3D terrain background
- Editable tagline and intro text (managed via admin)
- Featured projects strip pulled from the database
- "Who We Work With" section with category icons
- CTA banner linking to custom orders
- Page transition animations on navigation

#### WebGL Terrain (Hero)
- Procedurally generated low-poly terrain mesh using simplex noise
- Flat-shaded with elevation-based color gradient (deep navy to steel blue peaks)
- Slow auto-rotation on Y axis
- Mouse-driven parallax tilt effect
- **Mouse-driven spotlight sun** that orbits the terrain, casting real-time shadows
- **Vertex pulse animation** — 80 random points gently displace with sine waves
- **Color sweep** — branding colors (blue, gold, teal) sweep bottom-to-top every 5 seconds
- 2048x2048 shadow map for sharp shadow definition
- Hemisphere + ambient + cool fill lighting for depth
- Graceful fallback to static gradient when WebGL unavailable
- Dynamic import with `ssr: false` for performance

#### Gallery (`/gallery`)
- Uniform grid layout with fixed 4:3 aspect ratio cards
- Always-visible title, category badge, location, year, and scale metadata
- Photo count badge on multi-image projects
- Category filter pills (All, Conservation, Government, Installation, Personal)
- Click-to-open lightbox with image carousel
- Image load animation (blur-to-sharp fade-in)
- Lightbox image transition animation on prev/next
- Keyboard navigation (Escape, Arrow keys)
- Placeholder cards with icon for projects without images
- 12 portfolio projects seeded from tactileterrain.ca

#### About (`/about`)
- Company story section (editable via admin)
- Team grid with photos, names, roles, and companies (7 members seeded)
- 4-step process timeline: Design, Model, Finish, Install

#### Technology (`/technology`)
- **Fully database-driven** — all sections editable via admin panel
- Alternating image/text layout for visual rhythm
- Luminous Cartographs featured as "Signature Technology" at top
- Real photos from Tactile Terrain for Luminous Cartographs, hand painting, and LED overlays
- Pexels stock images for CNC milling, 3D printing, and GIS processing
- Subtle color-grade overlay on all images for unified aesthetic
- Sections: Luminous Cartographs, GIS Data Processing, CNC Milling, 3D Printing, Hand Finishing & Painting, Interactive Digital Overlays

#### Custom Orders (`/custom-orders`)
- Use case cards: Government/Parks, Hotels, Data Visualization, Art Commissions
- Custom process explanation with pricing factors
- Detailed inquiry form: Name, Email, Organization, Project Type, Scale, Timeline, Budget Range, Description, File Upload
- Budget ranges: Under $25K, $25K-$50K, $50K-$100K, $100K+, Not sure yet
- File attachment support (PDF, images, docs up to 10MB)
- Form submissions saved to database and emailed via Resend

#### Contact (`/contact`)
- Contact form: Name, Email, Subject, Message
- Studio info sidebar with editable region, location, and store link
- Form submissions saved to database and emailed via Resend
- Map embed placeholder

#### Navigation & Layout
- Fixed dark navbar (`#0F1A2A`) on all pages
- Tactile Terrain logo + "Tactile Terrain™" brand text
- Frosted-glass backdrop blur on scroll
- Mobile hamburger menu with full-screen overlay
- "Get in Touch" CTA button in nav
- Dark footer matching navbar with navigation, studio info, and editable tagline
- Consistent `max-w-7xl` + `px-6 md:px-12` padding alignment across nav and content
- Page transition animations (fade + slide up) via `template.tsx`
- Scroll-triggered section animations via IntersectionObserver

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
- Edit existing members (name, role, company, photo)
- Add new members with image upload
- Delete with confirmation

#### Site Content Editor
- Key-value editor for all site-wide text
- **Single-line inputs** for short values (URLs, emails, names)
- **Textareas** for long content (stories, descriptions)
- **Password masking** with show/hide toggle for sensitive fields
- Per-entry save buttons with success confirmation

**Editable fields include:**
| Key | Controls |
|-----|----------|
| Studio Region | Footer + Contact page |
| Studio Location | Footer + Contact page |
| Etsy Store URL | Footer + Contact page link destination |
| Etsy Link Text | Footer + Contact page link label |
| Footer Tagline | Footer description text |
| About Story | About page company story |
| Resend API Key | Email notification sending |
| Notification Email | Where form submissions are emailed |
| Email From Address | Sender address for notifications |
| Admin Primary Password | Login password |
| Admin Extra Passwords | Additional login passwords (one per line) |

---

### Email Notifications (Resend)

- Contact form submissions emailed with styled HTML template
- Custom inquiry submissions emailed with all fields + file attachment
- Attachments fetched as Buffer and sent inline via Resend API
- Configurable API key, from address, and recipient — all via admin panel
- Graceful skip when not configured (logged to console)

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
| `SiteContent` | Key-value store for all editable site text and settings |
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

# Admin login password
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
│   ├── (public)/           # Public pages
│   │   ├── page.tsx        # Homepage
│   │   ├── gallery/        # Gallery page
│   │   ├── about/          # About page
│   │   ├── technology/     # Technology page
│   │   ├── custom-orders/  # Custom orders + inquiry form
│   │   ├── contact/        # Contact page
│   │   ├── layout.tsx      # Public layout (navbar + footer)
│   │   └── template.tsx    # Page transition animation
│   ├── (admin)/            # Admin panel
│   │   └── admin/
│   │       ├── page.tsx        # Dashboard
│   │       ├── login/          # Login page
│   │       ├── gallery/        # Gallery CRUD
│   │       ├── homepage/       # Homepage editor
│   │       ├── technology/     # Technology editor
│   │       ├── inquiries/      # Inbox
│   │       ├── team/           # Team manager
│   │       └── content/        # Site content editor
│   ├── api/                # API routes
│   │   ├── admin/          # Protected admin APIs
│   │   ├── contact/        # Contact form submission
│   │   └── inquiries/      # Custom order submission
│   └── layout.tsx          # Root layout
├── components/
│   ├── layout/             # Navbar, Footer
│   ├── ui/                 # Button, Section, FormField, Lightbox, AnimatedSection
│   ├── three/              # WebGL terrain (TerrainMesh, TerrainScene, SunLight)
│   ├── home/               # Homepage sections
│   ├── gallery/            # Gallery grid
│   ├── about/              # Team grid, Process timeline
│   ├── contact/            # Contact form
│   ├── custom-orders/      # Inquiry form
│   └── admin/              # Admin shell, Gallery form, Image uploader, etc.
├── lib/
│   ├── prisma.ts           # Prisma client singleton
│   ├── session.ts          # iron-session config
│   ├── validations.ts      # Zod schemas
│   ├── utils.ts            # cn() helper
│   ├── email.ts            # Resend email + attachment utilities
│   └── studio-info.ts      # Studio info fetcher
└── middleware.ts            # Admin route protection
```

---

## Seeded Content

- **12 portfolio projects** scraped from tactileterrain.ca (8 with full descriptions + images, 4 with placeholder text)
- **7 team members** with roles and company affiliations
- **6 technology sections** with descriptions and images
- **Homepage content** (tagline + intro)
- **Studio info** (region, location, Etsy store)
- **Email settings** (Resend API key, from address, notification email)

---

## License

Private project for Tactile Terrain.
