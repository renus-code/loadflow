# LoadFlow Data Contract Specification (JSON-First Modeling)

This document maps the structure and transformation of the data throughout the system, ensuring consistency between the MongoDB Database Entities, the Backend DTOs, and the Frontend View Models. This prevents frontend/backend mismatches and clarifies data structures.

> **Email Integration:** The system uses **Nodemailer (Gmail)** for all transactional communications, including driver invitations and registration confirmations.

---

## Step 1: Entity Models (MongoDB Schema)

These represent the structures exactly as stored in our NoSQL database. They contain internal-only fields and relational ObjectIds.

### 1. User Entity (Logistics Personnel)

```json
{
  "_id": "ObjectId('64b1f8...')",
  "name": "string",
  "email": "string",
  "passwordHash": "string | null",
  "role": "string (Admin | Dispatcher | Driver)",
  "isPending": "boolean (true for invited, false for activated)",
  "phone": "string | null",
  "licenseNumber": "string | null (Ontario/Quebec format)",
  "dob": "date | null",
  "city": "string | null",
  "province": "string | null",
  "postalCode": "string | null",
  "address": "string | null",
  "requestedBy": "ObjectId (Dispatcher ID for recruitment flow)",
  "tokenVersion": "number (Session revocation index)",
  "isTwoFactorEnabled": "boolean",
  "loginAttempts": "number",
  "isLocked": "boolean",
  "resetPasswordRequested": "boolean",
  "resetPasswordApproved": "boolean",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

_Notice: `isPending` is a critical state flag. If `true`, the user has been invited but has not yet completed their secure setup._

### 2. Load Entity (Multi-Stop Unified Routing)

```json
{
  "_id": "ObjectId('64b1f9...')",
  "loadNumber": "string",
  "commodity": "string",
  "pickups": [
    {
      "address": "string",
      "city": "string",
      "state": "string",
      "date": "timestamp",
      "appointmentNumber": "string",
      "status": "string (PENDING | PICKED_UP)"
    }
  ],
  "deliveries": [
    {
      "address": "string",
      "city": "string",
      "state": "string",
      "date": "timestamp",
      "appointmentNumber": "string",
      "status": "string (PENDING | DELIVERED)"
    }
  ],
  "quantity": "number",
  "weight": "number",
  "totalDistance": "number (Used for Driver Mileage tracking)",
  "estimatedDuration": "number (Used for Driver Total Hours calculation)",
  "status": "string (PENDING | ASSIGNED | PICKED_UP | IN_TRANSIT | DELIVERED | COMPLETED | CANCELLED)",
  "assignedDriverId": "ObjectId | null",
  "truckNumber": "string | null",
  "trailerNumber": "string | null",
  "truckType": "string | null (Sleeper Cab | Day Cab)",
  "trailerType": "string | null (Dry Van | Reefer | Tri Axle | Flatbed)",
  "podUrl": "string | null (Cloudinary link)",
  "createdBy": "ObjectId",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

_Notice: Performance metrics (Miles/Duration) are tracked per load to enable real-time dashboard analytics._

### 3. Notification Entity (System Alerts)

```json
{
  "_id": "ObjectId('75c...)",
  "message": "string",
  "type": "string (INFO | WARNING | DANGER | SUCCESS)",
  "category": "string (Derived from message: LOADS | USERS | ALL)",
  "targetRole": "string (Admin | Dispatcher | Driver)",
  "userId": "ObjectId | null (Optional direct targeting)",
  "link": "string (Dashboard deep link)",
  "isRead": "boolean",
  "createdAt": "timestamp"
}
```

_Notice: Optimized for performance using Optimistic UI in the frontend and 5s backend polling._
_Notice: Categories are classified on-the-fly via regex patterns: 'LOADS' matches load updates, 'USERS' matches registrations/driver requests._

### 4. Audit Log Entity (Security Monitoring)

```json
{
  "_id": "ObjectId('86d...)",
  "userId": "ObjectId (Acting user)",
  "action": "string (USER_INVITED | LOAD_CREATED | USER_ACTIVATED | PASSWORD_RESET | ACCOUNT_LOCKED)",
  "entityType": "string (User | Load | Auth | System)",
  "entityId": "ObjectId | null",
  "details": "JSON Object (Metadata / Diff snapshot)",
  "ipAddress": "string",
  "createdAt": "timestamp"
}
```

### 5. Asset Entities (Trucks & Trailers)

```json
{
  "Truck": {
    "_id": "ObjectId",
    "truckNo": "string",
    "vin": "string",
    "plate": "string",
    "truckType": "string (Sleeper Cab | Day Cab)",
    "status": "string (Active | Maintenance | Decommissioned)",
    "createdBy": "ObjectId",
    "createdAt": "timestamp"
  },
  "Trailer": {
    "_id": "ObjectId",
    "trailerNo": "string",
    "vin": "string",
    "plate": "string",
    "trailerType": "string (Dry Van | Reefer | Tri Axle | Flatbed)",
    "status": "string (Active | Maintenance | Decommissioned)",
    "createdBy": "ObjectId",
    "createdAt": "timestamp"
  }
}
```

---

## Step 2: Backend DTO Models (Data Transfer Objects)

These structures define what the frontend sends and exactly what the Next.js API returns via HTTP routes.

### Driver Recruitment Request DTO (Dispatcher)

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@gmail.com"
}
```

_Notice: Dispatched to `/api/driver-requests`. This triggers an Admin notification to invite the candidate._

### Driver Activation DTO (Onboarding Completion)

```json
{
  "password": "NewStrongPassword!",
  "phone": "416-555-0199",
  "licenseNumber": "A1234-56789-01234",
  "dob": "1990-01-01",
  "city": "Toronto",
  "province": "ON",
  "postalCode": "M5V 2H1",
  "address": "123 Fleet St"
}
```

_Notice: The frontend sends this to `/api/auth/register` to transition a user from `isPending: true` to `isPending: false`._

### Profile Mutation DTO

```json
{
  "name": "Jane Doe",
  "phone": "416-555-0199",
  "licenseNumber": "A1234-56789-01234",
  "city": "Toronto",
  "province": "ON",
  "postalCode": "M5V 2H1",
  "address": "123 Fleet St",
  "currentPassword": "OldPassword123!",
  "newPassword": "NewStrongPassword456!"
}
```

_Notice: Securely updates personal info and rotates password via `/api/auth/profile/update`._

### MFA Verification DTO

```json
{
  "token": "123456"
}
```

_Notice: Validates TOTP code against base32 secret via `/api/auth/2fa/verify`._

### Public Request DTOs (Demo & Pricing Estimate)

```json
{
  "fullName": "string",
  "companyName": "string",
  "email": "string",
  "phone": "string",
  "assetTier": "string (e.g., '1 - 5', '500 - 4,999')"
}
```

_Notice: Dispatched via Next.js Server Actions (`submitDemoRequest` & `submitPricingRequest`) from the unauthenticated landing page. Exists transiently in memory, dispatched directly to Nodemailer._

---

## Step 3: Frontend View Models

### Audit Log Row ViewModel

```json
{
  "id": "86d...",
  "actor": "Admin (admin@loadflow.ca)",
  "actionLabel": "INVITED USER",
  "target": "jane.driver@gmail.com",
  "context": "IP: 192.168.1.1 | Role: Driver",
  "timestamp": "2 mins ago"
}
```

_Notice: The frontend dashboard aggregates raw `AuditLog` fields and resolves `userId` references into readable Actor names before displaying in the table._

---

## Step 4: Map the Flow (Onboarding Pipeline)

**1. Dispatcher Request:**
Dispatcher submits a candidate via `/api/driver-requests`.
⬇ _(Admin receives system notification)_

**2. Admin Invitation:**
Admin invites account via `/api/auth/register` (RBAC mode).
⬇ _(Nodemailer sends invitation email with signed link)_

**3. Driver Registration:**
Driver clicks link, lands on `/register?email=...`, and completes setup.
⬇ _(Audit log records USER_ACTIVATED)_

**4. Ecosystem Ready:**
Admins and Dispatchers receive "Registration Complete" Notifications.
The Driver is now available for Assignment in the Fleet dashboard.
