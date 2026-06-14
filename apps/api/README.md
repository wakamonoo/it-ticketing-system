# Ticketing System API

Backend API for the IT Ticketing System built with Node.js, Express, Prisma, and PostgreSQL.

## Features

- Authentication (JWT)
- Ticket creation and lifecycle management
- Department-based routing
- Ticket assignment and escalation
- Resolution and closing flow
- Activity logging for audit trail
- Role-based access control

## Tech Stack

- Node.js
- Express
- Prisma ORM
- PostgreSQL

## Setup

### Install dependencies
npm install

### Environment variables
Create a `.env` file:

DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your_secret

### Prisma setup
npx prisma generate
npx prisma migrate dev

### Run server
npm run dev

Server runs at:
http://localhost:5000

## API Routes

POST   /tickets
GET    /tickets/my
GET    /tickets/department
GET    /tickets/:id
GET    /tickets/:id/activity
PATCH  /tickets/:id/assign
PATCH  /tickets/:id/escalate
PATCH  /tickets/:id/resolve
PATCH  /tickets/:id/close
GET    /users/me
GET    /users/department
GET    /dashboard/stats
GET    /ticketTypes
GET    /department