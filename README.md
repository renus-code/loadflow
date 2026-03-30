# CargoConnect - LoadFlow
> A high-performance, Zero-Trust dispatch system for modern trucking companies to manage loads and delivery updates in real-time.

---

## 1. Team Information
**Team Name:** CargoConnect

**Team Members & Student IDs:**
- Jeffrey Lamptey (N01675664)
- Thabotharan Balachandran (N01674899)
- Renuupendra Sulthan (N01662821)
- Deepthi Bhavai Avala (N01710856)

**Architecture Stack:**
- **Frontend & Edge Routing:** Next.js 14+ (App Router) + React 19
- **State Management:** Zustand (Atomic Selectors) + React Context
- **Styling UI:** Bootstrap 5 + Vanilla CSS
- **Backend API:** Next.js Serverless Route Handlers
- **Database Engine:** MongoDB via Mongoose
- **Zero-Trust Security:** Next.js Edge Proxy (`jose` JWT Verification)

---

## 2. Product Overview

### Problem Statement
Small trucking companies traditionally manage load assignments through prone-to-error text messages, missing proof of delivery documents, and disconnected spreadsheets. LoadFlow centralizes this operation into a single, aggressively optimized dashboard.

### Core Users
- **Admin**: Full system control, role demotion/promotion, and permanent record deletion.
- **Dispatcher**: Responsible for creating cargo routes, assigning drivers, and tracking live statuses.
- **Driver**: Mobile-first interaction to accept loads, update transit statuses, and upload Proof of Delivery (POD) images.

---

## 3. Implemented Features

### Advanced Security Firewall
- **Zero-Trust Edge Middleware:** Every request to protected routes (`/dashboard`) is intercepted at the CDN Edge. The proxy natively decipher's the HttpOnly JWT cookie using `jose`. If invalid, the request is bounced instantaneously back to the login screen before the React Server Components even boot up.
- **Strict Role-Based Access Control (RBAC):** Users physically cannot access paths they aren't authorized for (e.g., Drivers are blocked from `/dashboard/users`).
- **HTTP Security Headers:** Implemented X-Frame-Options (Anti-Clickjacking), HSTS (Strict HTTPS), and Anti-MIME sniffing.
- **Automated Idle Timeout:** Dispatches and Admins are logged out automatically via Zustand state-tracking if the physical terminal is left idle.

### Operational Dashboard
- **Zustand State Engine:** We migrated the entire application from standard Context (which caused massive render spikes) to a highly performant Zustand atomic-selector model. Global search and active user state updates instantly across the DOM without re-rendering unaffected components.
- **Multi-Stop Cargo Assignments:** Dispatchers can create loads with dynamic arrays of multiple Pickups and Deliveries.
- **SVG Circular Analytics:** The admin dashboard utilizes mathematically perfect SVG circular progress arcs (`strokeDashoffset`) to display real-time active fleet completion metrics.
- **Image Upload Integration:** Drivers upload POD images securely to Cloudinary, ensuring the database remains lightweight while handling massive image traffic.

---

## 4. System Architecture

### Frontend Navigation Matrix
- **`/`**: Landing & Login portal.
- **`/contact`**: Contact page with support form, email, phone, and office info.
- **`/dashboard`**: Unified Dispatch Control Table & personal statistics.
- **`/dashboard/profile`**: Driver credential management.
- **`/dashboard/users`**: (Admin restricted) Staff onboarding and privilege escalation.

### Core API Structure
**Authentication (Edge Secured):**
- `POST /api/auth/login` (Mints HttpOnly JWT)
- `GET /api/auth/me` (Zustand Rehydration)
- `POST /api/auth/logout`

**Cargo Routing:**
- `GET /api/loads` (Returns payload subset based on RBAC role)
- `POST /api/loads` (Dispatcher/Admin load creation)

**User Administration:**
- `GET /api/users`
- `PUT /api/auth/profile/update` (Password/Credential changes)

---

## 5. Database Schema (MongoDB)

**User Model**
- Credentials (`email`, `passwordHash`)
- RBAC Tier (`role`: Admin | Dispatcher | Driver)
- Audit (`createdAt`, `lastLogin`)

**Load Model**
- `loadNumber` (Unique ID)
- `pickups` (Array of Locations & Dates)
- `deliveries` (Array of Locations & Dates)
- `quantity`, `weight`, `status`
- `assignedDriverId` (References User Model)

---

## 6. Deployment Logistics
- **Hosting layer:** Vercel Environment
- **Database:** MongoDB Atlas (Global Cluster)
- **Asset Storage:** Cloudinary
- **Environment Context:**
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `CLOUDINARY_URL`
