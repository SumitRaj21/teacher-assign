# Teacher Session Booking API

A RESTful backend application built with **Node.js, Express.js, TypeScript, MongoDB, and Mongoose**.

This application allows users to register, view available teacher sessions, book sessions, complete booked sessions, and view their upcoming and completed sessions.

The project includes Joi request validation, centralized error handling, MongoDB aggregation pipelines, and a demo teacher seeding script.

---

## 1. Features

- Create and register users.
- Create teacher sessions.
- Retrieve available sessions for a particular date.
- Book an available session.
- Complete a booked session.
- View upcoming and completed sessions for a user.
- Validate request parameters, query parameters, and request bodies using Joi.
- Handle errors through centralized error-handling middleware.
- Prevent multiple users from booking the same available session using an atomic MongoDB update.
- Use MongoDB aggregation with `$lookup`, `$unwind`, `$project`, and `$facet`.

---

## 2. Technologies Used

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| TypeScript | Static typing |
| MongoDB | NoSQL database |
| Mongoose | MongoDB object modeling |
| Joi | Request validation |
| dotenv | Environment variable management |
| CORS | Cross-origin resource sharing |
| tsx | TypeScript development runner |

---

## 3. Project Structure

```text
teacher-session-assignment/
│
├── src/
│   ├── config/
│   │   └── db.config.ts
│   │
│   ├── controllers/
│   │   ├── userController.ts
│   │   └── sessionController.ts
│   │
│   ├── middleware/
│   │   ├── errorHandler.ts
│   │   └── validate.middleware.ts
│   │
│   ├── models/
│   │   ├── userModel.ts
│   │   ├── teacherModel.ts
│   │   └── sessionModel.ts
│   │
│   ├── routes/
│   │   ├── userRoutes.ts
│   │   └── sessionRoutes.ts
│   │
│   ├── services/
│   │   ├── userService.ts
│   │   └── sessionService.ts
│   │
│   ├── utils/
│   │   ├── AppError.ts
│   │   └── asyncHandler.ts
│   │
│   ├── validations/
│   │   ├── userValidations.ts
│   │   └── sessionValidations.ts
│   │
│   ├── app.ts
│   ├── server.ts
│   └── seedTeacher.ts
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

---

## 4. Prerequisites

Before running this project, install the following:

1. **Node.js** – Version 20 or later recommended.
2. **npm** – Installed with Node.js.
3. **MongoDB** – Local MongoDB installation or MongoDB Atlas.
4. **Postman** – For API testing.

Check your installations:

```bash
node -v
npm -v
```

---

## 5. Installation and Setup

### Step 1: Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Navigate into the project:

```bash
cd teacher-session-assignment
```

### Step 2: Install dependencies

```bash
npm install
```

This installs all required dependencies from `package.json`.

### Step 3: Configure environment variables

Create a `.env` file in the project root.

Copy the contents of `.env.example`:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/teacher_sessions
```

For MongoDB Atlas, replace the local MongoDB URI with your Atlas connection string.

**Important:** Never upload your `.env` file to GitHub.

### Step 4: Start MongoDB

If you are using local MongoDB, make sure the MongoDB service is running.

The application will connect to:

```text
mongodb://127.0.0.1:27017/teacher_sessions
```

### Step 5: Seed the demo teacher

The application requires an existing teacher before creating a session.

Run:

```bash
npm run seed:teacher
```

This command creates or updates the demo teacher:

| Field | Value |
|---|---|
| Full Name | Demo Teacher |
| Email | teacher.demo@example.com |
| Specialization | Mathematics |
| Experience | 5 years |

After successful execution, you should see:

```text
Demo teacher ID: YOUR_TEACHER_OBJECT_ID
```

**Copy this ID.** You will need it when creating a session.

The seed operation uses `upsert`, so running it multiple times updates the same demo teacher instead of creating duplicates.

---

## 6. Running the Application

### Development mode

```bash
npm run dev
```

This starts the TypeScript application using `tsx watch`.

The server runs at:

```text
http://localhost:3000
```

### Production build

Compile TypeScript:

```bash
npm run build
```

Start the compiled application:

```bash
npm start
```

### Available npm scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Compile TypeScript |
| `npm start` | Run compiled application |
| `npm run seed:teacher` | Create/update demo teacher |
| `npm test` | Run configured Node.js tests |

---

## 7. API Documentation

### Base URL

```text
http://localhost:3000
```

### API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Check API health |
| POST | `/users` | Register a user |
| POST | `/sessions` | Create a session |
| GET | `/sessions/available` | Get available sessions |
| POST | `/sessions/:id/book` | Book a session |
| PATCH | `/sessions/:id/complete` | Complete a session |
| GET | `/users/:id/sessions` | Get user sessions |

All request bodies should use JSON where applicable.

---

## 8. API Testing with Postman or cURL

Follow these steps in order to test the complete application.

### API 1: Health Check

**Method:** GET

**URL:**

```text
http://localhost:3000/health
```

cURL:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "success": true,
  "message": "API is running"
}
```

### API 2: Create User

**Method:** POST

**URL:**

```text
http://localhost:3000/users
```

**Request Body:**

```json
{
  "fullName": "Rahul Sharma",
  "email": "rahul@example.com",
  "phone": "9876543210"
}
```

cURL:

```bash
curl -X POST http://localhost:3000/users \
-H "Content-Type: application/json" \
-d '{
  "fullName": "Rahul Sharma",
  "email": "rahul@example.com",
  "phone": "9876543210"
}'
```

Expected response structure:

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "_id": "USER_OBJECT_ID",
    "fullName": "Rahul Sharma",
    "email": "rahul@example.com",
    "phone": "9876543210"
  }
}
```

Copy the user's `_id`. You will need it for booking a session.

**Validation rules:**

- Full name must contain 3–50 characters.
- Email must be valid.
- Phone number must contain exactly 10 digits.

### API 3: Create Teacher Session

**Method:** POST

**URL:**

```text
http://localhost:3000/sessions
```

**Request Body:**

Replace `YOUR_TEACHER_OBJECT_ID` with the ID returned by the seed command.

```json
{
  "teacherId": "YOUR_TEACHER_OBJECT_ID",
  "startTime": "2026-12-15T10:00:00.000Z",
  "endTime": "2026-12-15T11:00:00.000Z"
}
```

cURL:

```bash
curl -X POST http://localhost:3000/sessions \
-H "Content-Type: application/json" \
-d '{
  "teacherId": "YOUR_TEACHER_OBJECT_ID",
  "startTime": "2026-12-15T10:00:00.000Z",
  "endTime": "2026-12-15T11:00:00.000Z"
}'
```

Expected response structure:

```json
{
  "success": true,
  "message": "Session created successfully",
  "data": {
    "_id": "SESSION_OBJECT_ID",
    "teacherId": "YOUR_TEACHER_OBJECT_ID",
    "startTime": "2026-12-15T10:00:00.000Z",
    "endTime": "2026-12-15T11:00:00.000Z",
    "status": "AVAILABLE"
  }
}
```

Copy the session `_id`.

**Validation rules:**

- Teacher ID must be a valid MongoDB ObjectId.
- Start time must be a valid date.
- End time must be greater than start time.
- Teacher must exist in the database.

### API 4: Get Available Sessions

**Method:** GET

**URL:**

```text
http://localhost:3000/sessions/available?dateTimestamp=TIMESTAMP_IN_MILLISECONDS
```

The `dateTimestamp` query parameter must be a positive integer representing a date in milliseconds.

Generate a timestamp using Node.js:

```bash
node -e "console.log(Date.UTC(2026, 11, 15))"
```

Use the returned number in your request.

Example:

```text
http://localhost:3000/sessions/available?dateTimestamp=1797292800000
```

cURL:

```bash
curl "http://localhost:3000/sessions/available?dateTimestamp=1797292800000"
```

Expected response structure:

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "SESSION_OBJECT_ID",
      "teacherId": "TEACHER_OBJECT_ID",
      "startTime": "2026-12-15T10:00:00.000Z",
      "endTime": "2026-12-15T11:00:00.000Z",
      "status": "AVAILABLE",
      "teacher": {
        "fullName": "Demo Teacher",
        "specialization": "Mathematics",
        "experience": 5,
        "email": "teacher.demo@example.com"
      }
    }
  ]
}
```

The API returns available sessions for the UTC day represented by the timestamp.

### API 5: Book a Session

**Method:** POST

**URL:**

```text
http://localhost:3000/sessions/SESSION_OBJECT_ID/book
```

**Request Body:**

```json
{
  "userId": "USER_OBJECT_ID"
}
```

cURL:

```bash
curl -X POST http://localhost:3000/sessions/SESSION_OBJECT_ID/book \
-H "Content-Type: application/json" \
-d '{
  "userId": "USER_OBJECT_ID"
}'
```

Expected response structure:

```json
{
  "success": true,
  "message": "Session booked successfully",
  "data": {
    "_id": "SESSION_OBJECT_ID",
    "status": "BOOKED",
    "userId": "USER_OBJECT_ID"
  }
}
```

**Important business rules:**

- User must exist.
- Session must exist.
- Session must have `AVAILABLE` status.
- Only one user can successfully book an available session.

### API 6: Complete a Session

**Method:** PATCH

**URL:**

```text
http://localhost:3000/sessions/SESSION_OBJECT_ID/complete
```

No request body is required.

cURL:

```bash
curl -X PATCH http://localhost:3000/sessions/SESSION_OBJECT_ID/complete
```

Expected response structure:

```json
{
  "success": true,
  "message": "Session completed successfully",
  "data": {
    "_id": "SESSION_OBJECT_ID",
    "status": "COMPLETED",
    "completedAt": "2026-12-15T11:00:00.000Z"
  }
}
```

**Business rule:** Only sessions with `BOOKED` status can be completed.

### API 7: Get User Sessions

**Method:** GET

**URL:**

```text
http://localhost:3000/users/USER_OBJECT_ID/sessions
```

cURL:

```bash
curl http://localhost:3000/users/USER_OBJECT_ID/sessions
```

Expected response structure:

```json
{
  "success": true,
  "data": {
    "upcomingSessions": [],
    "completedSessions": []
  }
}
```

The API groups sessions into:

- `upcomingSessions`: Booked sessions whose start time is greater than or equal to the current time.
- `completedSessions`: Sessions with `COMPLETED` status, sorted by most recent completion first.

Teacher information is populated using MongoDB aggregation with `$lookup`.

---

## 9. Session Status Flow

A session follows this lifecycle:

```text
        CREATE SESSION
              |
              v
          AVAILABLE
              |
              | Book Session
              v
            BOOKED
              |
              | Complete Session
              v
          COMPLETED
```

Available session statuses:

| Status | Meaning |
|---|---|
| AVAILABLE | Session is open for booking |
| BOOKED | Session has been booked by a user |
| COMPLETED | Session has been completed |

---

## 10. Error Handling

The project uses centralized error-handling middleware.

Common HTTP status codes:

| Status Code | Meaning |
|---|---|
| 200 | Request successful |
| 201 | Resource created successfully |
| 400 | Invalid input or validation error |
| 404 | Resource not found |
| 409 | Duplicate record or session conflict |
| 500 | Internal server error |

Example error response:

```json
{
  "success": false,
  "message": "User not found"
}
```

The API handles:

- Invalid MongoDB ObjectIds.
- Joi validation errors.
- Duplicate key errors.
- Mongoose validation errors.
- Missing users, teachers, and sessions.
- Attempts to book unavailable sessions.
- Attempts to complete sessions that are not booked.

---

## 11. MongoDB Collections

The application uses three main collections:

### Users

Stores registered user information.

Fields:

- `fullName`
- `email`
- `phone`
- `createdAt`
- `updatedAt`

### Teachers

Stores teacher information.

Fields:

- `fullName`
- `email`
- `specialization`
- `experience`
- `createdAt`
- `updatedAt`

### Sessions

Stores teacher session and booking information.

Fields:

- `teacherId`
- `userId`
- `startTime`
- `endTime`
- `status`
- `completedAt`
- `createdAt`
- `updatedAt`

---

## 12. Database Indexes

The Session model defines the following indexes:

```typescript
sessionSchema.index({ status: 1, startTime: 1 });

sessionSchema.index({
  userId: 1,
  status: 1,
  startTime: 1
});
```

These indexes help optimize session availability and user-session queries.

The User and Teacher models also enforce unique email fields through their schema definitions.

---

## 13. Common Problems and Solutions

### Problem 1: MongoDB connection failed

Check:

- MongoDB service is running.
- `MONGODB_URI` is correct.
- MongoDB Atlas network access and credentials are configured if using Atlas.

### Problem 2: Teacher not found

Run:

```bash
npm run seed:teacher
```

Copy the generated teacher ID and use it when creating a session.

### Problem 3: Invalid ObjectId

Make sure you are using the actual MongoDB `_id` returned by the API or seed script.

### Problem 4: Session is not available for booking

A session can only be booked when its status is `AVAILABLE`.

### Problem 5: Port already in use

Change the `PORT` value in your `.env` file or stop the other application using that port.

### Problem 6: TypeScript compilation errors

Run:

```bash
npx tsc --noEmit
```

Check the reported file and line number before starting the production build.

---

## 14. Git Commands

Initialize Git:

```bash
git init
```

Add files:

```bash
git add .
```

Commit changes:

```bash
git commit -m "Build Teacher Session Booking API using TypeScript"
```

Push to GitHub:

```bash
git push origin main
```

---

## 15. Author

**Sumit Raj**

Backend Developer | Node.js | Express.js | TypeScript | MongoDB

---

## License

This project is available for learning, development, and evaluation purposes.