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

---

## 2. Cargo & Fleet Management API

### 2.1 Fetch Audit Logs
- **Method & Path:** `GET /api/audit`
- **Auth Required:** Yes
- **RBAC Filter:** Restricted to `Admin`.
- **Query Params:** `page`, `limit`.
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

---

## 3. Notifications API

### 3.1 Fetch Notifications
- **Method & Path:** `GET /api/notifications`
- **Auth Required:** Yes
- **Purpose:** Returns unread alerts based on user role or direct ID.

### 3.2 Mark as Read
- **Method & Path:** `PATCH /api/notifications/:id`
- **Auth Required:** Yes
- **Request:** `{ "isRead": true }`

---

## 4. Standardized Error Handling

The Next.js backend utilizes standard HTTP codes to natively trigger Edge firewall blocks or UI alerts.

- **400 Bad Request:** Missing JSON fields or validation error (e.g., Invalid License format).
- **401 Unauthorized:** Missing, tampered, or expired `token` cookie.
- **403 Forbidden:** Valid user, but lacks RBAC Clearance or "Invite-Only" restriction bypass attempt.
- **500 Internal Server Error:** Unhandled Mongoose exception.
