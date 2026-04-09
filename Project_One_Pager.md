# Project 1-Pager: LoadFlow

## 🚚 Project Title
**LoadFlow** — Intelligent Logistics & Dispatch Orchestration

## 👥 Group Name
**CargoConnect**

## 👥 Team Members
*   **Jeffrey Lamptey** (N01675664)
*   **Thabotharan Balachandran** (N01674899)
*   **Renuupendra Sulthan** (N01662821)
*   **Deepthi Bhavai Avala** (N01710856)

---

## 🎯 Problem Statement
Logistics and trucking operations are often plagued by fragmented communication, manual "onboarding" processes, and a lack of transparency between dispatchers and drivers. Current systems are either too complex for simple fleets or lack the necessary security and auditing required for enterprise scalability.

**LoadFlow solves this by:**
1.  **Eliminating Manual Onboarding**: Automating the driver recruitment-to-activation pipeline via secure email workflows.
2.  **Unifying the Command Chain**: Providing a central glassmorphic dashboard where Dispatchers manage loads and Drivers update transit statuses in real-time.
3.  **Ensuring Compliance**: Automating Proof of Delivery (POD) uploads and maintaining a forensic audit trail of all system actions.

## 👥 Target Users
*   **Logistics Administrators**: Secure the system, manage user roles, and monitor cross-platform audit logs.
*   **Dispatchers**: Create multi-stop loads, assign fleet resources (trucks/trailers/drivers), and track operational velocity.
*   **Truck Drivers**: Mobile-first users who update load statuses, manage profiles, and submit PODs from the road.

---

## ✨ Key Features
*   **Automated Driver Onboarding**: Dispatchers request candidates; Admins invite via RBAC; Drivers activate via secure signed links.
*   **Real-Time Status Engine**: Live lifecycle tracking from `PENDING` to `DELIVERED`, with automatic timestamping and driver assignment.
*   **Proof of Delivery (POD) Automation**: Integrated Cloudinary storage for high-fidelity document capture and secure retrieval.
*   **Security-First Architecture**: Zero-Trust JWT authentication (HttpOnly cookies), session revocation, and 2FA capability.
*   **Forensic Audit Logs**: Every action (invitation, load update, password reset) is logged with Actor, IP, and Context metadata.

---

## 🏗 High-Level Building Blocks
*   **Frontend**: Next.js 13+ App Router, React, Bootstrap 5, Custom Premium Glassmorphism CSS.
*   **Backend**: Next.js API Route Handlers (Serverless/Edge compatible logic).
*   **Database**: MongoDB Atlas (NoSQL) with Mongoose ODM for logical schema mapping.
*   **Authentication**: Custom JWT Middleware with HttpOnly secure cookie persistence.
*   **External APIs**: Cloudinary (Media storage), Nodemailer/Gmail (SMTP Transactional Alerts).
*   **Documentation**: OAS 3.0 (Swagger UI) + Postman API Contract Specification.
