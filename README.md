# Task Manager - Backend

A REST API built with Node.js, Express, and MongoDB for managing tasks.

## Features
- Get all tasks
- Add a new task
- Toggle task completion status
- Delete a task

## Tech Stack
- Node.js
- Express
- MongoDB (via Mongoose)
- CORS
- dotenv

## API Endpoints

| Method | Endpoint     | Description              |
|--------|--------------|---------------------------|
| GET    | /tasks       | Get all tasks              |
| POST   | /tasks       | Add a new task              |
| PATCH  | /tasks/:id   | Toggle completed status     |
| DELETE | /tasks/:id   | Delete a task                |

## Setup

1. Clone the repo
2. Run `npm install`
3. Create a `.env` file with your MongoDB connection string:

MONGO_URI=your_connection_string
4. Run `node server.js`
5. Server runs on `http://localhost:3000`

## Frontend
This backend is paired with [task-manager-frontend](https://github.com/dhanushquinn-collab/task-manager-frontend)