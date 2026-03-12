# Web Log API Contract Summary

This document serves as the formal API contract between the frontend and backend for the Web Log Tracker API. It defines the available endpoints, standard data shapes, statuses, and expected errors based on the tutorial specifications.

---

## 1. Authentication Endpoints

### 1.1 Register User
- **Method & Path:** `POST /api/auth/register`
- **Auth Required:** No
- **Request JSON:**
  ```json
  {
    "email": "demo@humber.ca",
    "password": "Password123!"
  }
  ```
- **Success Response (201 Created):**
  ```json
  {
    "message": "User registered"
  }
  ```
- **Error Response (409 Conflict):**
  ```json
  {
    "error": {
      "code": "EMAIL_EXISTS",
      "message": "Email already registered",
      "details": []
    }
  }
  ```

### 1.2 Login User
- **Method & Path:** `POST /api/auth/login`
- **Auth Required:** No
- **Request JSON:**
  ```json
  {
    "email": "demo@humber.ca",
    "password": "Password123!"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "token": "jwt_token_here",
    "user": {
      "id": "user_1",
      "email": "demo@humber.ca"
    }
  }
  ```
- **Error Response (401 Unauthorized):**
  ```json
  {
    "error": {
      "code": "INVALID_CREDENTIALS",
      "message": "Email or password is incorrect",
      "details": []
    }
  }
  ```

---

## 2. Logs Endpoints (Protected)

### 2.1 Get All Logs
- **Method & Path:** `GET /api/logs`
- **Auth Required:** Yes (Bearer Token)
- **Request JSON:** *(none)*
- **Success Response (200 OK):**
  ```json
  [
    {
      "id": "log_101",
      "title": "Login issue",
      "message": "User cannot log in with correct password.",
      "createdAt": "2026-03-01T10:30:00Z"
    }
  ]
  ```

### 2.2 Create a New Log
- **Method & Path:** `POST /api/logs`
- **Auth Required:** Yes (Bearer Token)
- **Request JSON:**
  ```json
  {
    "title": "Bug report",
    "message": "Navbar breaks on mobile."
  }
  ```
- **Success Response (201 Created):**
  ```json
  {
    "id": "log_102",
    "title": "Bug report",
    "message": "Navbar breaks on mobile.",
    "createdAt": "2026-03-01T11:00:00Z"
  }
  ```
- **Error Response (400 Bad Request):**
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "title and message are required",
      "details": []
    }
  }
  ```

### 2.3 Delete a Log
- **Method & Path:** `DELETE /api/logs/:id`
- **Auth Required:** Yes (Bearer Token)
- **Request JSON:** *(none)*
- **Success Response (204 No Content):** *(Empty Body)*
- **Error Response (404 Not Found):**
  ```json
  {
    "error": {
      "code": "NOT_FOUND",
      "message": "Log not found",
      "details": []
    }
  }
  ```
