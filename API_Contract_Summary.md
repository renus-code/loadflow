# LoadFlow API Contract Summary

This document serves as the formal API contract between the Next.js Client and the Next.js Serverless Edge. It defines the available endpoints, standard data payloads, status codes, and Zero-Trust Edge Security expectations.

> **Note:** The `/contact` page is a static frontend-only route. It does not call any backend API. Contact form submissions are handled via the client's own email provider (e.g., mailto: link or a future third-party integration like Resend or Nodemailer).

---

## 1. Zero-Trust Authentication Endpoints

### 1.1 Register User
- **Method & Path:** `POST /api/auth/register`
- **Auth Required:** No
- **Request JSON:**
  ```json
  {
    "name": "Jane Driver",
    "email": "jane@loadflow.com",
    "password": "SecurePassword123!",
    "role": "Driver" // Admins can assign arbitrary roles.
  }
  ```
- **Success Response (201 Created):**
  ```json
  {
    "message": "User registered successfully"
  }
  ```

### 1.2 Login User
- **Method & Path:** `POST /api/auth/login`
- **Auth Required:** No
- **Request JSON:**
  ```json
  {
    "email": "jane@loadflow.com",
    "password": "SecurePassword123!"
  }
  ```
- **Success Response (200 OK):**
  *(Issues `HttpOnly` Secure Cookie holding the JWT `token`)*
  ```json
  {
    "message": "Logged in successfully",
    "user": {
      "id": "64b1f8...",
      "name": "Jane Driver",
      "email": "jane@loadflow.com",
      "role": "Driver"
    }
  }
  ```

### 1.3 Session Rehydration (Me)
- **Method & Path:** `GET /api/auth/me`
- **Auth Required:** Yes (Edge valid `token` Cookie)
- **Purpose:** Used continuously by the Zustand state engine to restore active sessions.
- **Success Response (200 OK):**
  ```json
  {
    "user": {
      "id": "64b1f8...",
      "name": "Jane Driver",
      "email": "jane@loadflow.com",
      "role": "Driver"
    }
  }
  ```

---

## 2. Cargo Routing API (Protected)

### 2.1 Fetch Assigned Loads
- **Method & Path:** `GET /api/loads`
- **Auth Required:** Yes (Edge validated)
- **RBAC Logic:**
  - **Drivers:** Only see active assigned cargo.
  - **Dispatchers:** See all active fleet cargo.
  - **Admins:** See transparent cargo history, including CANCELLED.
- **Success Response (200 OK):**
  ```json
  [
    {
      "id": "load_101",
      "loadNumber": "LD-2409",
      "status": "IN_TRANSIT",
      "pickups": [ ... ],
      "deliveries": [ ... ],
      "quantity": 12,
      "weight": 24000
    }
  ]
  ```

### 2.2 Create Multi-Stop Load
- **Method & Path:** `POST /api/loads`
- **Auth Required:** Yes
- **RBAC Filter:** Restricted to `Dispatcher` or `Admin`.
- **Request JSON:**
  ```json
  {
    "loadNumber": "LD-2410",
    "quantity": 10,
    "quantityUnit": "Pallets",
    "weight": 14000,
    "weightUnit": "lbs",
    "pickups": [
      {
        "locationName": "Toronto Hub",
        "date": "2026-04-01T08:00:00Z"
      }
    ],
    "deliveries": [
      {
        "locationName": "Montreal Drop",
        "date": "2026-04-02T14:00:00Z"
      }
    ]
  }
  ```
- **Success Response (201 Created):** Returns generated Load object.

---

## 3. User Administration API (Protected)

### 3.1 Fetch Fleet Personnel
- **Method & Path:** `GET /api/users`
- **Auth Required:** Yes
- **RBAC Filter:** Restricted to `Admin` and `Dispatcher`.
- **Success Response (200 OK):**
  ```json
  [
    {
      "id": "64b1f8...",
      "name": "Jane Driver",
      "email": "jane@loadflow.com",
      "role": "Driver",
      "loadsCompleted": 12
    }
  ]
  ```

---

## 4. Standardized Error Handling

The Next.js backend utilizes standard HTTP codes to natively trigger Edge firewall blocks or UI alerts.

- **400 Bad Request:** Missing JSON fields (e.g., missing multi-stop data).
- **401 Unauthorized:** Missing, tampered, or expired `token` cookie. The Edge Middleware will immediately bounce the user.
- **403 Forbidden:** Valid user, but lacks RBAC Clearance (e.g., a Driver attempting to POST a new load).
- **404 Not Found:** Record does not exist in MongoDB.
- **500 Internal Server Error:** Unhandled Mongoose exception.
