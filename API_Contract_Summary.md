# LoadFlow API Contract Summary

This document serves as the formal API contract between the Next.js Client and the Next.js Serverless Edge. It defines the available endpoints, standard data payloads, status codes, and Zero-Trust Edge Security expectations.

> **Note:** The `/contact` page is a static frontend-only route. It does not call any backend API. Contact form submissions are handled via the client's own email provider (e.g., mailto: link or a future third-party integration like Resend or Nodemailer).

---

## 1. Zero-Trust Authentication Endpoints

### 1.1 Register & Activate User
- **Method & Path:** `POST /api/auth/register`
- **Auth Required:** Optional (RBAC Mode vs. Activation Mode)
- **RBAC Mode (Admin/Dispatcher):** Used to "Invite" a user by creating a `isPending: true` record.
- **Activation Mode (Public):** Used by a driver with a valid invited email to set their password and profile details.
- **Success Response (201 or 200 OK):**
  ```json
  {
    "message": "Account activated successfully"
  }
  ```

### 1.2 Login User
- **Method & Path:** `POST /api/auth/login`
- **Auth Required:** No
- **Request JSON:**
  ```json
  {
    "email": "jane@gmail.com",
    "password": "SecurePassword123!"
  }
  ```
- **Success Response (200 OK):**
  *(Issues `HttpOnly` Secure Cookie holding the JWT `token`)*

### 1.3 Multi-Factor Authentication (2FA)
- **Method & Path:** `POST /api/auth/2fa/generate` (Creates base32 secret and QR Code URI)
- **Method & Path:** `POST /api/auth/2fa/verify` (Validates TOTP token and sets `isTwoFactorEnabled`)
- **Auth Required:** Yes
- **Note:** Forced dynamically on login if `isTwoFactorEnabled` is true on the user.

### 1.4 Password Reset Pipeline
- **Method & Path:** `POST /api/auth/forgot-password` (Public, flags `resetPasswordRequested`)
- **Method & Path:** `POST /api/users/:id/approve-reset` (Admin-only, sets `resetPasswordApproved`)
- **Method & Path:** `POST /api/auth/reset-password` (Public, consumes approval flag and rotates credential)

### 1.5 Account Lockout & Revocation
- **Method & Path:** `POST /api/users/:id/unlock` (Admin-only, resets `isLocked` flag after 3 bad login attempts)
- **Method & Path:** `POST /api/users/:id/revoke` (Admin-only, bumps `tokenVersion` to invalidate all active JWTs)

### 1.6 Profile Mutation Engine
- **Method & Path:** `POST /api/auth/profile/check-password` (Pre-flight validation)
- **Method & Path:** `POST /api/auth/profile/update` (Modifies demographics, address, and credentials)
- **Auth Required:** Yes


---

## 2. Cargo & Fleet Management API

### 2.1 Fetch Audit Logs
- **Method & Path:** `GET /api/audit`
- **Auth Required:** Yes
- **RBAC Filter:** Restricted to `Admin`.
- **Query Params:** `page`, `limit` (Default 25 for UI).
- **Success Response (200 OK):**
  ```json
  {
    "logs": [
      {
        "id": "...",
        "action": "USER_ACTIVATED",
        "entityType": "User",
        "ipAddress": "1.2.3.4",
        "userId": { "name": "System Admin" }
      }
    ],
    "total": 450
  }
  ```

### 2.2 Submit Driver Request
- **Method & Path:** `POST /api/driver-requests`
- **Auth Required:** Yes
- **RBAC Filter:** Restricted to `Dispatcher`.
- **Purpose:** Allows dispatchers to flag new candidates for Admin invitation.

### 2.3 Loads Management
- **Method & Path:** `GET /api/loads`
- **Purpose:** Fetch all loads (filtered by role: Drivers see assigned, Dispatchers/Admins see all).
- **Dashboard Logic:** Drivers' performance cards (Miles, Service Hours) are calculated from `totalDistance` and `estimatedDuration` fields of all non-cancelled loads.
- **Method & Path:** `POST /api/loads`
- **Auth Required:** Yes (Dispatcher/Admin)
- **Request JSON:** Includes `loadNumber`, `commodity`, `pickups`, `deliveries`, `quantity`, `weight`.
- **Method & Path:** `PUT /api/loads/:id/assign`
- **Purpose:** Assign a driver and equipment (Truck/Trailer) to a load.
- **Method & Path:** `PATCH /api/loads/:id/status`
- **Purpose:** Update the overarching status of a load or individual stop statuses.

### 2.4 Asset Management (Trucks & Trailers)
- **Method & Path:** `GET /api/trucks` & `GET /api/trucks/:id`
- **Method & Path:** `GET /api/trailers` & `GET /api/trailers/:id`
- **Purpose:** Retrieve fleet asset details including VINs, plates, and classifications.
- **Method & Path:** `POST /api/trucks` & `POST /api/trailers`
- **Auth Required:** Yes (Admin/Dispatcher)
- **Method & Path:** `PUT /api/trucks/:id` & `PUT /api/trailers/:id`
- **Purpose:** Modify asset configurations.
- **Method & Path:** `DELETE /api/trucks/:id` & `DELETE /api/trailers/:id`
- **Purpose:** Decommission fleet hardware.

### 2.5 Proof of Delivery (PODs)
- **Method & Path:** `GET /api/pods/:id`
- **Auth Required:** Yes
- **Purpose:** Fetch the cryptographically secure Cloudinary URL representing a specific load's Proof of Delivery documentation.

---

## 3. Notifications API

### 3.1 Fetch Notifications
- **Method & Path:** `GET /api/notifications`
- **Query Params:** `category` (ALL, LOADS, USERS), `page`, `limit`, `all` (boolean).
- **Performance:** Implements **Ultra-fast 5s Polling** and **Optimistic UI Updates**. When a notification is marked as read, the unread count decrements instantly (0ms delay) while syncing in the background.

### 3.2 Mark All as Read
- **Method & Path:** `PATCH /api/notifications`
- **Auth Required:** Yes
- **Purpose:** Marks all unread notifications for the current user/role as read.

### 3.3 Manage Single Notification
- **Method & Path:** `PATCH /api/notifications/:id`
- **Method & Path:** `DELETE /api/notifications/:id`
- **Auth Required:** Yes
- **Purpose:** Update status (read/unread) or remove a specific notification. Uses optimistic UI for instant removal from dropdowns.

---

## 4. Standardized Error Handling

The Next.js backend utilizes standard HTTP codes to natively trigger Edge firewall blocks or UI alerts.

- **400 Bad Request:** Missing JSON fields or validation error (e.g., Invalid License format).
- **401 Unauthorized:** Missing, tampered, or expired `token` cookie.
- **403 Forbidden:** Valid user, but lacks RBAC Clearance or "Invite-Only" restriction bypass attempt.
- **500 Internal Server Error:** Unhandled Mongoose exception.

---

## 5. Public Gateway (Server Actions)

These endpoints are implemented as Next.js Server Actions on the Landing Page rather than standard REST APIs, directly dispatching Nodemailer actions without database persistence constraints.

### 5.1 Request Demonstration
- **Logical Path:** `submitDemoRequest` (Server Action)
- **Purpose:** Triggers a formatted alert to the administrative team.

### 5.2 Pricing Estimate
- **Logical Path:** `submitPricingRequest` (Server Action)
- **Purpose:** Triggers a distinct alert directing the admin to provide an enterprise quote.
