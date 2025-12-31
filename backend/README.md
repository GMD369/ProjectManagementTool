# Project Management System - Backend

## Environment Setup

Create a `.env` file in the backend directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key_here
```

## Installation

```bash
npm install
```

## Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Auth APIs
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user (Protected)

### User APIs
- `GET /api/users/profile` - Get user profile (Protected)
- `PUT /api/users/profile` - Update user profile (Protected)

### Project APIs
- `POST /api/projects` - Create a new project (Protected)
- `GET /api/projects` - Get all projects (Protected)
- `GET /api/projects/:id` - Get project by ID (Protected)
- `PUT /api/projects/:id` - Update project (Protected)
- `DELETE /api/projects/:id` - Delete project (Protected)

### Task APIs
- `POST /api/tasks` - Create a new task (Protected)
- `GET /api/tasks/my-tasks` - Get tasks assigned to logged-in user (Protected)
- `GET /api/tasks/project/:projectId` - Get all tasks for a project (Protected)
- `PUT /api/tasks/:id` - Update task (Protected)
- `PATCH /api/tasks/:id/status` - Update task status (Protected)
- `PATCH /api/tasks/:id/assign` - Assign task to user (Protected)
- `DELETE /api/tasks/:id` - Delete task (Protected)

### Team APIs
- `POST /api/team/:projectId/add` - Add team member to project (Protected)
- `POST /api/team/:projectId/remove` - Remove team member from project (Protected)
- `GET /api/team/:projectId` - Get all team members of a project (Protected)

## Database Models

### User Model
- name
- email (unique)
- password (hashed)
- role (admin/member)
- timestamps

### Project Model
- title
- description
- owner (User reference)
- teamMembers (Array of User references)
- status (planning/in-progress/completed/on-hold)
- startDate
- endDate
- timestamps

### Task Model
- title
- description
- project (Project reference)
- assignedTo (User reference)
- status (todo/in-progress/review/completed)
- priority (low/medium/high/urgent)
- dueDate
- timestamps

## Technologies Used
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
