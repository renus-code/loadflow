# LoadFlow Data Contract Specification (JSON-First Modeling)

This document maps the structure and transformation of the data throughout the system, ensuring consistency between the MongoDB Database Entities, the Backend DTOs, and the Frontend View Models. This prevents frontend/backend mismatches and clarifies data structures prior to implementation.

---

## Step 1: Entity Models (Database Thinking)

These represent the structures exactly as stored in our database (e.g., MongoDB / PostgreSQL). These may contain internal-only fields.

### 1. User Entity
```json
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "passwordHash": "string",
  "role": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```
*Notice: `passwordHash` and `updatedAt` are strictly private components maintained by the database.*

### 2. Load Entity
```json
{
  "id": "uuid",
  "pickupLocation": "string",
  "deliveryLocation": "string",
  "weight": "string",
  "status": "string",
  "assignedDriverId": "uuid | null",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```
*Notice: `assignedDriverId` acts as our relational mapping to the User Entity.*

---

## Step 2: Backend DTO Models (Data Transfer Objects)

These structures define exactly what the frontend sends and effectively what the backend API returns via HTTP routes.

### Create LoadRequest DTO (What the Frontend Sends)
```json
{
  "pickupLocation": "Vancouver, BC",
  "deliveryLocation": "Calgary, AB",
  "weight": "38000 lbs"
}
```
*Notice: No `id`, `assignedDriverId`, or `timestamps` are transmitted here. The backend safely generates/manages these on insertion.*

### LoadResponse DTO (What the Backend Returns)
```json
{
  "id": "load_101",
  "pickupLocation": "Vancouver, BC",
  "deliveryLocation": "Calgary, AB",
  "weight": "38000 lbs",
  "status": "In Transit",
  "createdAt": "2026-03-01T11:00:00Z"
}
```
*Notice: `updatedAt` and any internal driver tracking hashes are obfuscated from this public public-facing DTO route response.*

### Standard Error DTO
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Pickup and Delivery locations are required",
    "details": []
  }
}
```

---

## Step 3: Frontend View Models

This defines how the application specifically structures and renders the raw API backend payload into the beautiful UI Components. 

### Dashboard LoadCard ViewModel
```json
{
  "id": "load_101",
  "route": "Vancouver, BC → Calgary, AB",
  "weight": "38000 lbs",
  "statusLabel": "In Transit",
  "statusColorClass": "bg-blue-50 text-blue-600",
  "formattedDate": "March 1, 2026",
  "currentDriver": "Jane Doe"
}
```
*Notice: The frontend transforms `pickupLocation` and `deliveryLocation` into a combined `route` interface string. It also parses `createdAt` into a localized `formattedDate` and extracts CSS mappings (`statusColorClass`) before passing to React Components.*

---

## Step 4: Map the Flow (Architecture Pipeline)

Here is a full breakdown of the data transition as a load is retrieved by the client application:

**1. DB Load Entity:**
```json
{
  "id": "load_101",
  "pickupLocation": "Toronto, ON",
  "deliveryLocation": "Montreal, QC",
  "weight": "45000 lbs",
  "status": "In Transit",
  "assignedDriverId": "user_2_abc",
  "createdAt": "2026-03-01T10:30:00Z",
  "updatedAt": "2026-03-01T11:45:00Z",
  "__v": 0
}
```
⬇ *(Backend API strips DB metadata, hidden relationships, and internal tracking stamps)*

**2. Backend LoadResponse DTO:**
```json
{
  "id": "load_101",
  "pickupLocation": "Toronto, ON",
  "deliveryLocation": "Montreal, QC",
  "weight": "45000 lbs",
  "status": "In Transit",
  "createdAt": "2026-03-01T10:30:00Z"
}
```
⬇ *(Frontend merges relational metadata on fetch and maps CSS classes / Date locales)*

**3. Frontend Dashboard LoadCard ViewModel:**
```json
{
  "id": "load_101",
  "route": "Toronto, ON → Montreal, QC",
  "weight": "45000 lbs",
  "status": "In Transit",
  "formattedDate": "March 1, 2026",
  "statusColorClass": "bg-blue-50"
}
```
