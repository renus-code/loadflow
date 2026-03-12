# CargoConnect - LoadFlow
> A lightweight dispatch system for small trucking companies to manage loads and delivery updates in real time.

---

## 1. Team Information
**Team Name:** CargoConnect

**Team Members & Student IDs:**
- Jeffrey Lamptey (N01675664)
- Thabotharan Balachandran (N01674899)
- Renuupendra Sulthan (N01662821)
- Deepthi Bhavai Avala (N01710856)

**Roles:**
- **Frontend:** Next.js + Bootstrap
- **Backend:** Next.js API Routes
- **Database Design:** MongoDB
- **Authentication & Security:** JWT
- **DevOps:** Deployment
- **Documentation:** Testing

---

## 2. Product Overview

### Problem Statement
**What problem are you solving?**
Small trucking companies still manage load assignments through phone calls, text messages, and spreadsheets. Drivers lack instant access to load details and dispatch teams cannot track delivery progress in real time.

**Who experiences this problem?**
Dispatchers and truck drivers in small and medium-sized freight companies.

**Why does it matter?**
Manual communication causes delays, errors, missing Proof of Delivery documents, and no centralized load history.

### Target Users
- **Primary User:** Admin, Dispatcher
- **Secondary User:** Driver

---

## 3. MVP Features (Must-Have)
1. User authentication (Dispatcher & Driver roles)
2. Full CRUD operations for Loads
3. Dispatcher assigns loads to drivers
4. Driver dashboard to view assigned loads
5. Load status updates (Assigned → Picked Up → Delivered)
6. Upload Proof of Delivery (image upload)
7. Role-based protected routes

---

## 4. Stretch Features (Optional)
1. Real-time updates using polling/WebSockets
2. Delivery analytics dashboard
3. Email or push notifications

---

## 5. System Architecture

### Frontend
**Pages:**
- Login / Register
- Dispatcher Dashboard
- Driver Dashboard
- Create/Edit Load Page
- Load Details Page

**Layout Structure:**
- Bootstrap Navbar
- Sidebar navigation
- Dashboard cards + tables

**Key Components:**
- Load Table
- Load Form
- Status Buttons
- Image Upload Component
- Protected Route wrapper

### Backend – Planned API Endpoints
**Auth:**
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

**Users CRUD:**
- `GET /api/users`
- `GET /api/users/:id`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

**Loads CRUD:**
- `GET /api/loads`
- `GET /api/loads/:id`
- `POST /api/loads`
- `PUT /api/loads/:id`
- `DELETE /api/loads/:id`

**Assignment & Status:**
- `PUT /api/loads/:id/assign`
- `PUT /api/loads/:id/status`

**POD CRUD:**
- `POST /api/pods`
- `GET /api/pods/:id`
- `DELETE /api/pods/:id`

*(Postman API Documentation will be provided)*

### Authentication Plan
- **JWT storage method:** HttpOnly Cookies
- **Protected routes:** Dashboard, Loads pages, POD upload
- **Role-based access:** YES

---

## 6. Database Design

**Entity 1: User**
- `id`, `name`, `email`, `passwordHash`, `role`, `createdAt`

**Entity 2: Load**
- `id`, `pickupLocation`, `deliveryLocation`, `trailerNumber`, `appointmentTime`, `weight`, `quantity`, `status`, `assignedDriverId`, `createdAt`

**Entity 3: ProofOfDelivery**
- `id`, `loadId`, `imageUrl`, `uploadedAt`

**Relationships:**
- One Dispatcher → Many Loads
- One Driver → Many Loads
- One Load → One POD

**DB Stack:** PostgreSQL with Prisma (or MongoDB Atlas)

---

## 7. UI / UX Planning
- **Figma Link:** To be created
- **Wireframes included:** YES
- **UI Library Used:** Bootstrap 5

---

## 8. Deployment Plan
- **Hosting platform:** Vercel (Next.js)
- **Database:** Neon PostgreSQL / MongoDB Atlas
- **Environment variables needed:**
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `CLOUD_STORAGE_KEY`
- **Production URL:** To be added

---

## 9. Jira Planning

**Epic List:**
1. Authentication & User Roles
2. Load Management (CRUD)
3. Driver Workflow & POD Upload

**Initial Sprint Tasks:**
- Setup Next.js project
- Configure Bootstrap
- Setup database & Prisma
- Implement authentication
- Create basic UI layout

---

## 10. Milestone Plan (9 Weeks)
- **Week 1:** Finalize idea & planning
- **Week 2:** DB schema & project setup
- **Week 3:** Authentication implementation
- **Week 4:** Load CRUD backend
- **Week 5:** Frontend integration
- **Week 6:** Driver workflow & status updates
- **Week 7:** POD upload feature
- **Week 8:** Testing & deployment
- **Week 9:** Documentation & demo video

---

## 11. Risks & Mitigation
**Potential Risks:**
- File upload complexity
- Authentication bugs
- Time management

**Mitigation Plan:**
- Use cloud storage for images
- Implement auth early
- Weekly sprint reviews

---

## 12. Definition of Done
Project is complete when:
- Auth fully working
- CRUD working
- Protected routes enforced
- Deployment live
- Documentation complete
- Demo video recorded
