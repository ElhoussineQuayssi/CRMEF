# Project: Physics Teacher Portfolio & Booking System

## 1. Project Overview
Build a high-end, modern portfolio website for a Physics teacher. The site serves three purposes: 
1. Professional showcase of expertise (Skills & Experience).
2. Resource hub (Educational PDFs and Videos).
3. Appointment booking system for private tutoring.

## 2. Technical Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS (Theme: Dark, Glassmorphism, Luxury Aesthetics)
- **Animations:** GSAP + Framer Motion (for micro-interactions)
- **Backend/Database:** Supabase (Auth, PostgreSQL, Storage)
- **Icons:** Lucide React
- **Date Management:** date-fns + React Day Picker

## 3. Database Schema (Supabase)
- **profiles:** id, full_name, bio, avatar_url.
- **resources:** id, title, type (pdf/video), level (Bac, 1ère Bac...), file_url, thumbnail_url, created_at.
- **bookings:** id, student_name, student_phone, subject_topic, date, time_slot, status (pending/confirmed/cancelled).
- **availability:** id, day_of_week, start_time, end_time (for the booking calendar).

## 4. Implementation Phases

### Phase 1: Setup & Design System
- [ ] Initialize Next.js 15 project with TypeScript and Tailwind.
- [ ] Configure a "Luxury Dark" theme: 
    - Backgrounds: Deep Navy/Black.
    - Accents: Vivid Sapphire (#0F52BA) or Cyan.
    - Glassmorphism: Semi-transparent cards with `backdrop-blur`.
- [ ] Setup Supabase client and environment variables.

### Phase 2: Landing Page & Showcase
- [ ] **Hero Section:** High-performance GSAP animation (e.g., floating atoms or light waves).
- [ ] **Skills Section:** Visual cards for Physics modules (Mechanics, Optics, etc.).
- [ ] **About Section:** Professional timeline with glassmorphism style.

### Phase 3: Resource Center (The Library)
- [ ] Implement a Grid Layout for resources.
- [ ] **PDF Support:** List view with download buttons; metadata (level, date).
- [ ] **Video Support:** Video gallery with YouTube embeds or custom players.
- [ ] **Filtering:** Category-based filtering (by Level or Topic).

### Phase 4: Booking & Management
- [ ] **Client Side:** Interactive calendar for selecting dates.
- [ ] **Booking Form:** Collect student info and topic with Zod validation.
- [ ] **Teacher Dashboard:** Protected route (`/admin`) to view and manage bookings.
- [ ] Integrate Supabase Auth for the Admin/Teacher login.

### Phase 5: Polish & UX
- [ ] Add page transitions using Framer Motion.
- [ ] Implement a "Sticky" Navbar with glassmorphism effect.
- [ ] Ensure full mobile responsiveness.
- [ ] Add a "Success" state for bookings (confetti or smooth animation).

## 5. Critical Instructions for the Agent
- Use **Next.js Server Actions** for form submissions (Bookings).
- Prioritize **SEO** for the resource pages (use generateMetadata).
- Keep animations smooth but lightweight; avoid layout shifts.
- Ensure all PDF/Video cards have a hover effect using GSAP.