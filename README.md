# CargoConnect - LoadFlow
> A dispatch and fleet operations platform for trucking teams, built with Next.js, MongoDB, JWT cookie auth, and role-based access control.

---

## 1. Team Information
**Team Name:** CargoConnect

**Team Members & Student IDs:**
- Jeffrey Lamptey (N01675664)
- Thabotharan Balachandran (N01674899)
- Renuupendra Sulthan (N01662821)
- Deepthi Bhavai Avala (N01710856)

---

## 2. Tech Stack
- **Framework:** Next.js App Router
- **UI:** React, Bootstrap 5, custom CSS
- **State:** Zustand + React Context
- **Backend:** Next.js Route Handlers
- **Database:** MongoDB via Mongoose
- **Auth:** JWT in HttpOnly cookie
- **Storage:** Cloudinary for Proof of Delivery uploads
- **API Docs:** OpenAPI (`openapi.yaml`) + Swagger UI + Postman collection

---

## 3. Product Overview
LoadFlow centralizes trucking operations that are often split across texts, spreadsheets, and manual follow-ups.

### Core Roles
- **Admin:** Manages users, approvals, fleet assets, audit visibility, and system-level actions
- **Dispatcher:** Creates loads, assigns drivers and equipment, manages active operations
- **Driver:** Updates pickup/delivery progress, uploads PODs, manages personal profile

### Main Functional Areas
- Invitation-based registration
- Login/logout with protected dashboard routes
- Multi-stop load creation and editing
- Driver assignment with truck and trailer selection
- Stop-level status updates
- Proof of Delivery upload and verification
- User administration
- Fleet management for trucks and trailers
- Notifications and driver request workflow
- Audit logs and optional 2FA endpoints

---

## 4. Frontend Routes
- **`/`**: Landing page
- **`/login`**: Login page
- **`/register`**: Invitation-based account activation
- **`/forgot-password`**: Password reset request
- **`/reset-password`**: Password reset after admin approval
- **`/contact`**: Contact page
- **`/api-docs`**: Swagger UI
- **`/dashboard`**: Main operations dashboard
- **`/dashboard/profile`**: User profile page
- **`/dashboard/users`**: Admin-only user management

---

## 5. Implemented API Surface

### Auth
- `GET /api/auth/check-email`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `POST /api/auth/profile/check-password`
- `POST /api/auth/profile/update`
- `POST /api/auth/2fa/generate`
- `POST /api/auth/2fa/verify`

### Users
- `GET /api/users`
- `GET /api/users/{id}`
- `PUT /api/users/{id}`
- `DELETE /api/users/{id}`
- `POST /api/users/{id}/approve-reset`
- `POST /api/users/{id}/unlock`
- `POST /api/users/{id}/revoke`

### Notifications and Requests
- `GET /api/notifications`
- `PATCH /api/notifications`
- `PATCH /api/notifications/{id}`
- `DELETE /api/notifications/{id}`
- `POST /api/driver-requests`
- `GET /api/audit`

### Loads
- `GET /api/loads`
- `POST /api/loads`
- `GET /api/loads/{id}`
- `PUT /api/loads/{id}`
- `DELETE /api/loads/{id}`
- `PUT /api/loads/{id}/assign`
- `PATCH /api/loads/{id}/status`

### PODs
- `POST /api/pods`
- `GET /api/pods/{id}`
- `DELETE /api/pods/{id}`

### Fleet
- `GET /api/trucks`
- `POST /api/trucks`
- `PUT /api/trucks/{id}`
- `DELETE /api/trucks/{id}`
- `GET /api/trailers`
- `POST /api/trailers`
- `PUT /api/trailers/{id}`
- `DELETE /api/trailers/{id}`

### Docs
- `GET /api/swagger`

---

## 6. Project Structure
```text
app/
  api/
  dashboard/
  login/
  register/
  forgot-password/
  reset-password/
components/
context/
lib/
models/
public/
openapi.yaml
LoadFlow_API_Contract.postman_collection.json
```

---

## 7. Local Development

### Install
```bash
npm install
```

### Required Environment Variables
Create a local `.env` file with at least:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Run
```bash
npm run dev
```

### Build
```bash
npm run build
```

---

## 8. API Documentation

### Swagger
- OpenAPI source: `openapi.yaml`
- Runtime Swagger JSON: `GET /api/swagger`
- Swagger UI page: `http://localhost:3000/api-docs`

### Postman
- Collection file: `LoadFlow_API_Contract.postman_collection.json`
- Default variable:
  - `baseUrl = http://localhost:3000`

### Auth Testing Note
Protected endpoints use an HttpOnly cookie named `token`.
To test them:
1. Log in first against the same host as `baseUrl`
2. Reuse the same cookie session in Swagger or Postman

---

## 9. Deployment Notes

### Important
Local `.env` values are **not** automatically available in production deployments.

If deploying to Vercel or another host, add the environment variables in the platform settings:
- `MONGODB_URI`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

If `MONGODB_URI` is missing in the deployment environment, the build can fail while collecting route data for API routes such as `/api/audit`.

---

## 10. Current Data Models

### User
- Name, email, password hash
- Role: `Admin | Dispatcher | Driver`
- Pending/invitation state
- Lock/reset flags
- Profile fields such as phone, address, city, province, postal code, DOB, license

### Load
- Load number
- Pickups and deliveries
- Quantity and weight
- Assigned driver
- Assigned truck and trailer
- Status lifecycle
- POD URL

### Truck
- Truck number
- VIN
- Plate
- Year, make, model
- Truck type

### Trailer
- Trailer number
- VIN
- Plate
- Year, make, model
- Trailer type

### Supporting Records
- Proof of Delivery
- Notifications
- Audit logs

---

## 11. Notes
- Route protection is enforced in `proxy.ts`
- MongoDB connection logic is centralized in `lib/mongodb.ts`
- API coverage in Swagger and Postman has been aligned with the currently implemented `app/api` routes
