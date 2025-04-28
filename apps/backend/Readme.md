# Feedback System

A comprehensive feedback management system that allows users to submit, view, update, and delete feedback items. This system is built with Node.js, Express, TypeScript, and MongoDB, providing robust features for collecting and managing user feedback.

## Features

- 📝 Create, read, update, and delete feedback
- 🔍 Filter feedback by status, category, and rating
- 📊 Pagination support for listing feedback
- 👤 User-specific feedback management
- 🔒 Role-based access control (user/admin)
- 🔄 Status tracking for feedback items

## API Endpoints

### Feedback Management

| Method | Endpoint           | Description                   | Authentication Required |
|--------|-------------------|-------------------------------|------------------------|
| POST   | `/api/feedback`       | Submit new feedback           | Yes                    |
| GET    | `/api/feedback`       | Get all feedback with filters | No                     |
| GET    | `/api/feedback/:id`   | Get feedback by ID            | No                     |
| PATCH  | `/api/feedback/:id`   | Update feedback               | Yes                    |
| DELETE | `/api/feedback/:id`   | Delete feedback               | Yes                    |
| GET    | `/api/feedback/user/me` | Get logged-in user's feedback | Yes                  |

## Feedback Categories and Status

### Categories
- `suggestion`: Ideas for improving existing features
- `bug`: Reports of issues or problems
- `feature`: Requests for new functionality

### Status Levels
- `open`: Newly submitted feedback awaiting review
- `in-progress`: Feedback being actively worked on
- `resolved`: Feedback that has been addressed

## Request & Response Examples

### Submit Feedback

```
POST /api/feedback
Content-Type: application/json
Cookie: accessToken=<jwt_token>

{
  "rating": 4,
  "comment": "The dashboard UI could be more intuitive. Consider adding tooltips.",
  "type": "suggestion",
  "category": "suggestion"
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Feedback created successfully",
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "raisedBy": "60d21b4667d0d8992e610c86",
    "rating": 4,
    "comment": "The dashboard UI could be more intuitive. Consider adding tooltips.",
    "type": "suggestion",
    "category": "suggestion",
    "status": "open",
    "createdAt": "2023-06-22T10:00:00.000Z",
    "updatedAt": "2023-06-22T10:00:00.000Z"
  }
}
```

### Get All Feedback (with filters and pagination)

```
GET /feedback?status=open&category=bug&minRating=3&page=1&limit=10
```

**Response**:
```json
{
  "status": "success",
  "meta": {
    "totalResults": 28,
    "totalPages": 3,
    "currentPage": 1,
    "resultsPerPage": 10,
    "hasPreviousPage": false,
    "hasNextPage": true,
    "previousPage": null,
    "nextPage": 2
  },
  "results": 10,
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "raisedBy": {
        "_id": "60d21b4667d0d8992e610c86",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "rating": 4,
      "comment": "The dashboard UI could be more intuitive. Consider adding tooltips.",
      "type": "suggestion",
      "category": "suggestion",
      "status": "open",
      "createdAt": "2023-06-22T10:00:00.000Z",
      "updatedAt": "2023-06-22T10:00:00.000Z"
    },
    // ... more feedback items
  ]
}
```

### Update Feedback

```
PATCH /api/feedback/:ID
Content-Type: application/json
Cookie: accessToken=<jwt_token>

{
  "status": "in-progress",
  "comment": "The dashboard UI could be more intuitive. Consider adding tooltips and a help section."
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Feedback updated successfully",
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "raisedBy": {
      "_id": "60d21b4667d0d8992e610c86",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "rating": 4,
    "comment": "The dashboard UI could be more intuitive. Consider adding tooltips and a help section.",
    "type": "suggestion",
    "category": "suggestion",
    "status": "in-progress",
    "createdAt": "2023-06-22T10:00:00.000Z",
    "updatedAt": "2023-06-22T10:05:00.000Z"
  }
}
```

### Get User's Feedback

```
GET /api/feedback/user/me
Cookie: accessToken=<jwt_token>
```

**Response**:
```json
{
  "status": "success",
  "results": 3,
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "raisedBy": {
        "_id": "60d21b4667d0d8992e610c86",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "rating": 4,
      "comment": "The dashboard UI could be more intuitive. Consider adding tooltips.",
      "type": "suggestion",
      "category": "suggestion",
      "status": "in-progress",
      "createdAt": "2023-06-22T10:00:00.000Z",
      "updatedAt": "2023-06-22T10:05:00.000Z"
    },
    // ... more feedback items
  ]
}
```

## Access Control

- Any authenticated user can submit feedback
- Users can only update or delete their own feedback
- Viewing all feedback is available to everyone
- Users can view their own feedbacks

## Pagination and Filtering

The feedback listing endpoint supports:

- **Pagination**: Control results with `page` and `limit` parameters
- **Status filtering**: Filter by the current status
- **Category filtering**: Filter by feedback category
- **Rating filtering**: Filter by minimum rating

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400` - Bad Request (missing fields, validation errors)
- `401` - Unauthorized (missing authentication)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (feedback not found)
- `500` - Internal Server Error

# User Authentication

A secure and efficient user authentication system built with Node.js, Express, TypeScript, and MongoDB. This system provides user registration, login, logout, and profile update functionalities with JWT-based authentication.

## Features

-   🔐 Secure user registration and authentication
-   🔄 JWT token-based session management
-   🍪 HTTP-only cookie implementation for enhanced security
-   👤 User profile management
-   👮 Role-based access control (user/admin)
-   🔒 Password hashing with bcrypt
-   ✅ Input validation

## API Endpoints

### User Authentication

| Method | Endpoint         | Description         | Authentication Required |
| ------ | ---------------- | ------------------- | ----------------------- |
| POST   | `/api/user/register` | Register a new user | No                      |
| POST   | `/api/user/login`    | Login user          | No                      |
| POST   | `/api/user/logout`   | Logout user         | No                      |
| PATCH  | `/api/user/update`   | Update user profile | Yes                     |

## Authentication Flow

1. **Registration**: Users provide name, email, password, and role to create an account
2. **Login**: Users authenticate with email and password to receive JWT tokens
3. **Session Management**: Access token (15 min) and refresh token (20 min) stored in HTTP-only cookies
4. **Protected Routes**: Middleware validates tokens for access to protected resources
5. **Logout**: Clears authentication cookies

## Request & Response Examples

### Register User

```
POST /api/user/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "user"
}
```

**Response**:

```json
{
	"status": "success",
	"message": "User registered successfully",
	"data": {
		"userId": "60d21b4667d0d8992e610c85",
		"name": "John Doe",
		"email": "john@example.com",
		"role": "user",
		"createdAt": "2023-06-22T10:00:00.000Z",
		"updatedAt": "2023-06-22T10:00:00.000Z"
	}
}
```

### Login User

```
POST /api/user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response**:

```json
{
	"status": "success",
	"message": "Login successful",
	"data": {
		"userId": "60d21b4667d0d8992e610c85",
		"name": "John Doe",
		"email": "john@example.com",
		"role": "user",
		"createdAt": "2023-06-22T10:00:00.000Z",
		"updatedAt": "2023-06-22T10:00:00.000Z"
	}
}
```

### Update User

```
PATCH /api/user/update
Content-Type: application/json
Cookies: accessToken=<jwt_token>

{
  "name": "John Smith",
  "password": "newsecurepassword"
}
```

**Response**:

```json
{
	"status": "success",
	"message": "User updated successfully",
	"data": {
		"userId": "60d21b4667d0d8992e610c85",
		"name": "John Smith",
		"email": "john@example.com",
		"role": "user",
		"updatedAt": "2023-06-22T11:00:00.000Z"
	}
}
```

### Logout User

```
POST /api/user/logout
Cookies: accessToken=<jwt_token>; refreshToken=<refresh_token>
```

**Response**:

```json
{
	"status": "success",
	"message": "Logged out successfully"
}
```

## Security Features

-   **Password Hashing**: Uses bcrypt with a salt factor of 12
-   **HTTP-only Cookies**: Prevents client-side JavaScript from accessing tokens
-   **Token Expiration**: Short-lived access tokens (15 min) and refresh tokens (20 min)
-   **Secure Headers**: Cookie security options for production environment
-   **Input Validation**: Email validation and password length requirements

## Error Handling

The API returns appropriate HTTP status codes and error messages:

-   `400` - Bad Request (missing fields, validation errors)
-   `401` - Unauthorized (invalid credentials, expired token)
-   `403` - Forbidden (insufficient permissions)
-   `404` - Not Found (resource not found)
-   `409` - Conflict (email already registered)
-   `500` - Internal Server Error

## Environment Variables

The following environment variables must be set:

```
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/your-database
JWT_ACCESS_SECRET=your-access-token-secret
JWT_REFRESH_SECRET=your-refresh-token-secret
```

## Installation and Setup

1. Clone the repository
2. Install dependencies:
    ```
    pnpm install
    ```
3. Set up environment variables in a `.env` file
4. Run the development server:
    ```
    pnpm run dev
    ```

## Building for Production

```
pnpm run build
pnpm start
```

## Technologies Used

-   Node.js & Express.js
-   TypeScript
-   MongoDB & Mongoose
-   JSON Web Tokens (JWT)
-   bcrypt.js
-   Validator.js

## License

[MIT](LICENSE)
