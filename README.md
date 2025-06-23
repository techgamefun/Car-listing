# Car Listing API Documentation

## Base URL

```
https://car-listing-7o8w.onrender.com
```

## Authentication

This API uses JWT (JSON Web Token) for authentication. Include the access token in the Authorization header for protected endpoints:

```
Authorization: Bearer <accessToken>
```

---

## Endpoints

### 1. User Registration

**Endpoint:** `POST /api/auth/register`

**Description:** Register a new user account

**Request Body:**

```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string"
}
```

**Example Request:**

```json
{
  "firstName": "MD",
  "lastName": "Samir",
  "email": "Newfake@mail.com",
  "password": "New123123"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "user": {
    "id": "string",
    "email": "string",
    "fullName": "string"
  },
  "accessToken": "string"
}
```

**Example Response:**

```json
{
  "message": "Login successful",
  "user": {
    "id": "68592752586ef88be6947d34",
    "email": "newfake@mail.com",
    "fullName": "MD Samir"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NTkyNzUyNTg2ZWY4OGJlNjk0N2QzNCIsImlhdCI6MTc1MDY3MzIzNCwiZXhwIjoxNzUwNjc0MTM0fQ.XXEaF4qnOj8e1lfZfkfGqCQr_OripJ222foxYZpApUI"
}
```

---

### 2. User Login

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate user and receive access token

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Example Request:**

```json
{
  "email": "Newfake@mail.com",
  "password": "New123123"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "user": {
    "id": "string",
    "email": "string",
    "fullName": "string"
  },
  "accessToken": "string"
}
```

**Example Response:**

```json
{
  "message": "Login successful",
  "user": {
    "id": "68592752586ef88be6947d34",
    "email": "newfake@mail.com",
    "fullName": "MD Samir"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NTkyNzUyNTg2ZWY4OGJlNjk0N2QzNCIsImlhdCI6MTc1MDY3NjU2MiwiZXhwIjoxNzUwNjc3NDYyfQ.wlDJJ3db8omf5Mp79U8OJCXLyJGaLNmPvrOKuIzCzu0"
}
```

---

### 3. Create Car

**Endpoint:** `POST /api/car/createcar`

**Description:** Create a new car listing

**Authentication:** Required

**Request Body:**

```json
{
  "brand": "string",
  "model": "string",
  "price": "number"
}
```

**Example Request:**

```json
{
  "brand": "toyota2",
  "model": "supra2",
  "price": 1000000
}
```

**Response:**

```json
{
  "brand": "string",
  "model": "string",
  "price": "number",
  "status": "boolean",
  "_id": "string",
  "createdAt": "string (ISO date)",
  "updatedAt": "string (ISO date)",
  "__v": "number"
}
```

**Example Response:**

```json
{
  "brand": "toyota2",
  "model": "supra2",
  "price": 1000000,
  "status": true,
  "_id": "6859348dc0bab6ef7d44f7fd",
  "createdAt": "2025-06-23T11:03:41.863Z",
  "updatedAt": "2025-06-23T11:03:41.863Z",
  "__v": 0
}
```

---

### 4. Get All Cars

**Endpoint:** `GET /api/car/allcars`

**Description:** Retrieve all car listings with pagination

**Authentication:** May be required (check with your implementation)

**Query Parameters:**

- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 10)

**Response:**

```json
{
  "success": "boolean",
  "page": "number",
  "limit": "number",
  "totalPages": "number",
  "totalCars": "number",
  "cars": [
    {
      "_id": "string",
      "brand": "string",
      "model": "string",
      "price": "number",
      "status": "boolean",
      "createdAt": "string (ISO date)",
      "updatedAt": "string (ISO date)",
      "__v": "number"
    }
  ]
}
```

**Example Response:**

```json
{
  "success": true,
  "page": 1,
  "limit": 10,
  "totalPages": 1,
  "totalCars": 2,
  "cars": [
    {
      "_id": "6859348dc0bab6ef7d44f7fd",
      "brand": "toyota2",
      "model": "supra2",
      "price": 1000000,
      "status": true,
      "createdAt": "2025-06-23T11:03:41.863Z",
      "updatedAt": "2025-06-23T11:03:41.863Z",
      "__v": 0
    },
    {
      "_id": "68592d3391e75a539f1d3fe9",
      "brand": "toyota",
      "model": "supra",
      "price": 1000000,
      "status": true,
      "createdAt": "2025-06-23T10:32:19.417Z",
      "updatedAt": "2025-06-23T10:32:19.417Z",
      "__v": 0
    }
  ]
}
```

---

## Error Responses

The API returns appropriate HTTP status codes and error messages:

**400 Bad Request:**

```json
{
  "error": "Bad Request",
  "message": "Invalid request data"
}
```

**401 Unauthorized:**

```json
{
  "error": "Unauthorized",
  "message": "Access token is required"
}
```

**404 Not Found:**

```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

**500 Internal Server Error:**

```json
{
  "error": "Internal Server Error",
  "message": "Something went wrong"
}
```

---

## Data Types

### User Object

```json
{
  "id": "string",
  "email": "string",
  "fullName": "string"
}
```

### Car Object

```json
{
  "_id": "string",
  "brand": "string",
  "model": "string",
  "price": "number",
  "status": "boolean",
  "createdAt": "string (ISO date)",
  "updatedAt": "string (ISO date)",
  "__v": "number"
}
```

---

## Usage Examples

### cURL Examples

**Register User:**

```bash
curl -X POST https://car-listing-7o8w.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "MD",
    "lastName": "Samir",
    "email": "Newfake@mail.com",
    "password": "New123123"
  }'
```

**Login:**

```bash
curl -X POST https://car-listing-7o8w.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "Newfake@mail.com",
    "password": "New123123"
  }'
```

**Create Car:**

```bash
curl -X POST https://car-listing-7o8w.onrender.com/api/car/createcar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "brand": "toyota2",
    "model": "supra2",
    "price": 1000000
  }'
```

**Get All Cars:**

```bash
curl -X GET https://car-listing-7o8w.onrender.com/api/car/allcars/get \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Notes

- All POST requests require `Content-Type: application/json` header
- Access tokens have expiration times (check the `exp` field in the JWT payload)
- The `status` field in car objects appears to default to `true`
- Email addresses are converted to lowercase in responses
- Car prices are stored as numbers (likely in cents or smallest currency unit)
