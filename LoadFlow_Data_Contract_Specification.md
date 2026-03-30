# LoadFlow Data Contract Specification (JSON-First Modeling)

This document maps the structure and transformation of the data throughout the system, ensuring consistency between the MongoDB Database Entities, the Backend DTOs, and the Frontend View Models. This prevents frontend/backend mismatches and clarifies data structures.

> **Static Routes (No API):** The `/contact` page is a static frontend-only route. It renders contact info (email: support@loadflow.ca, phone: +1 (437) 383-1996) and a local form. It does not exchange data with any backend API endpoint and therefore has no DTO or DB Entity representation.

---

## Step 1: Entity Models (MongoDB Schema)

These represent the structures exactly as stored in our NoSQL database. They contain internal-only fields and relational ObjectIds.

### 1. User Entity
```json
{
  "_id": "ObjectId('64b1f8...')",
  "name": "string",
  "email": "string",
  "passwordHash": "string",
  "role": "string (Admin | Dispatcher | Driver)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "__v": "number"
}
```
*Notice: `passwordHash` and Mongoose version keys (`__v`) are strictly private components maintained by the database.*

### 2. Load Entity (Multi-Stop Routing)
```json
{
  "_id": "ObjectId('64b1f9...')",
  "loadNumber": "string",
  "pickups": [
    {
      "locationName": "string",
      "date": "timestamp"
    }
  ],
  "deliveries": [
    {
      "locationName": "string",
      "date": "timestamp"
    }
  ],
  "quantity": "number",
  "quantityUnit": "string",
  "weight": "number",
  "weightUnit": "string",
  "status": "string (PENDING | IN_TRANSIT | DELIVERED | CANCELLED)",
  "assignedDriverId": "ObjectId | null",
  "createdBy": "ObjectId",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```
*Notice: Cargo paths are modeled as dynamic Arrays, allowing for unlimited multi-stop logistical routing.*

---

## Step 2: Backend DTO Models (Data Transfer Objects)

These structures define what the frontend sends and exactly what the Next.js API returns via HTTP routes.

### Create LoadRequest DTO (What the Frontend Sends)
```json
{
  "loadNumber": "LD-2410",
  "pickups": [
    { "locationName": "Toronto Hub", "date": "2026-04-01T08:00:00Z" }
  ],
  "deliveries": [
    { "locationName": "Montreal Drop", "date": "2026-04-02T14:00:00Z" }
  ],
  "quantity": 10,
  "quantityUnit": "Pallets",
  "weight": 14000,
  "weightUnit": "lbs"
}
```
*Notice: No `_id`, `createdBy`, or `timestamps` are transmitted here. The backend safely generates/manages these on insertion using the Edge JWT.*

### LoadResponse DTO (What the Backend Returns via Mongoose `.lean()`)
```json
{
  "id": "64b1f9...",
  "loadNumber": "LD-2410",
  "pickups": [ ... ],
  "deliveries": [ ... ],
  "quantity": 10,
  "quantityUnit": "Pallets",
  "weight": 14000,
  "weightUnit": "lbs",
  "status": "PENDING",
  "createdAt": "2026-03-01T11:00:00Z",
  "assignedDriverId": {
     "_id": "64b1f8...",
     "name": "Jane Driver",
     "email": "jane@loadflow.com"
  }
}
```
*Notice: Database relations (`assignedDriverId`) are automatically populated by Mongoose into readable objects before transmission to the frontend.*

---

## Step 3: Frontend View Models

This defines how the application structurally renders the raw API payload into the UI Components. 

### DispatchTable / LoadCard ViewModel
```json
{
  "id": "64b1f9...",
  "loadNumber": "LD-2410",
  "routeSummary": "Toronto Hub → Montreal Drop",
  "stopCount": "1 Pickup, 1 Drop",
  "cargoDetails": "10 Pallets (14000 lbs)",
  "statusLabel": "PENDING",
  "statusBadgeClass": "bg-warning text-dark",
  "formattedDate": "Apr 1, 2026",
  "assignedTo": "Jane Driver"
}
```
*Notice: The frontend intelligently maps the raw `pickups` and `deliveries` arrays into a human-readable `routeSummary`. It parses UTC dates into localized `formattedDate` strings, and extracts Bootstrap 5 utility mappings (`statusBadgeClass`) before passing data to React components.*

---

## Step 4: Map the Flow (Architecture Pipeline)

Here is a full breakdown of the data transition as a load is retrieved by the dashboard:

**1. DB Load Entity:**
```json
{
  "_id": "ObjectId('64b...'",
  "loadNumber": "LD-2410",
  "pickups": [{ "locationName": "Toronto" }],
  "deliveries": [{ "locationName": "Montreal" }],
  "weight": 45000,
  "status": "IN_TRANSIT",
  "assignedDriverId": "ObjectId('64b...'",
  "__v": 0
}
```
⬇ *(Backend API strips `__v`, populates relations, and structures Next.js JSON)*

**2. Backend LoadResponse DTO:**
```json
{
  "id": "64b...",
  "loadNumber": "LD-2410",
  "routeOrigin": "Toronto",
  "routeDest": "Montreal",
  "weight": 45000,
  "status": "IN_TRANSIT"
}
```
⬇ *(Zustand filters the payload and maps Bootstrap CSS / Date locales)*

**3. Frontend Dashboard Dispatch Table ViewModel:**
```json
{
  "id": "64b...",
  "displayTitle": "LD-2410: Toronto → Montreal",
  "cargoSummary": "45000 lbs",
  "badgeUI": "<span class='badge bg-primary rounded-pill'>In Transit</span>"
}
```
