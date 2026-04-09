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
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```
*Notice: `isPending` is a critical state flag. If `true`, the user has been invited but has not yet completed their secure setup.*

### 2. Load Entity (Multi-Stop Unified Routing)
```json
{
  "_id": "ObjectId('64b1f9...')",
  "loadNumber": "string",
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
  "status": "string (PENDING | ASSIGNED | IN_TRANSIT | DELIVERED | COMPLETED | CANCELLED)",
  "assignedDriverId": "ObjectId | null",
  "truckNumber": "string | null",
  "trailerNumber": "string | null",
  "truckType": "string | null",
  "trailerType": "string | null",
  "podUrl": "string | null (Cloudinary link)",
  "createdBy": "ObjectId",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### 3. Notification Entity (System Alerts)
```json
{
  "_id": "ObjectId('75c...)",
  "message": "string",
  "type": "string (INFO | WARNING | DANGER | SUCCESS)",
  "targetRole": "string (Admin | Dispatcher | Driver)",
  "userId": "ObjectId | null (Optional direct targeting)",
  "link": "string (Dashboard deep link)",
  "isRead": "boolean",
  "createdAt": "timestamp"
}
```

### 4. Audit Log Entity (Security Monitoring)
```json
{
  "_id": "ObjectId('86d...)",
  "userId": "ObjectId (Acting user)",
  "action": "string (USER_INVITED | LOAD_CREATED | USER_ACTIVATED)",
  "entityType": "string (User | Load | Auth)",
  "entityId": "ObjectId | null",
  "details": "JSON Object (Metadata / Diff snapshot)",
  "ipAddress": "string",
  "createdAt": "timestamp"
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
*Notice: Dispatched to `/api/driver-requests`. This triggers an Admin notification to invite the candidate.*

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
*Notice: The frontend sends this to `/api/auth/register` to transition a user from `isPending: true` to `isPending: false`.*

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
*Notice: Dispatched via Next.js Server Actions (`submitDemoRequest` & `submitPricingRequest`) from the unauthenticated landing page. Exists transiently in memory, dispatched directly to Nodemailer.*

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
*Notice: The frontend dashboard aggregates raw `AuditLog` fields and resolves `userId` references into readable Actor names before displaying in the table.*

---

## Step 4: Map the Flow (Onboarding Pipeline)

**1. Dispatcher Request:**
Dispatcher submits a candidate via `/api/driver-requests`.
⬇ *(Admin receives system notification)*

**2. Admin Invitation:**
Admin invites account via `/api/auth/register` (RBAC mode).
⬇ *(Nodemailer sends invitation email with signed link)*

**3. Driver Registration:**
Driver clicks link, lands on `/register?email=...`, and completes setup.
⬇ *(Audit log records USER_ACTIVATED)*

**4. Ecosystem Ready:**
Admins and Dispatchers receive "Registration Complete" Notifications.
The Driver is now available for Assignment in the Fleet dashboard.
