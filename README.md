# IT Ticketing System

A full-stack IT Ticketing System built as a monorepo using Express, TypeScript, Next.js, PostgreSQL, Prisma, JWT Authentication, and Docker Compose.

## Overview

This project simulates a real-world IT support workflow where tickets move through department pipelines from creation to resolution.

Users can submit tickets, department members can assign and escalate tickets, and every action is tracked through an activity log.

---

## Tech Stack

### Backend

- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication

### Frontend

- Next.js
- TypeScript
- Tailwind CSS

### Infrastructure

- Docker Compose
- PostgreSQL Container

---

## Project Structure

```text
it-ticketing-system/
│
├── apps/
│   ├── api/        # Express + TypeScript backend
│   └── web/        # Next.js frontend
│
├── docker-compose.yml
│
└── README.md
```

---

## Features

### Authentication

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Role-based Access

### Roles

#### End User

- Create tickets
- View own submitted tickets

#### Department Member

- View department queue
- Assign tickets
- Escalate tickets
- Resolve tickets
- Close tickets

---

## Ticket Lifecycle

### Statuses

- OPEN
- IN_PROGRESS
- ESCALATED
- RESOLVED
- CLOSED

### Flow

```text
Create Ticket
      ↓
Assign Ticket
      ↓
Escalate Ticket
      ↓
Resolve Ticket
      ↓
Close Ticket
```

---

## Ticket Pipelines

Each ticket type follows a predefined department workflow.

Example:

```text
Help Desk
    ↓
Tier 2 Support
    ↓
Infrastructure
```

When a ticket is escalated:

- The next department becomes responsible.
- The ticket becomes unassigned.
- The escalation is logged.
- The ticket appears in the next department queue.

---

## Department View

Department members have access to:

### Unassigned Tickets

Tickets currently waiting for assignment within the department.

### Assigned Tickets

Tickets actively being worked on by department members.

---

## Activity Log

Every ticket maintains a complete audit trail.

Recorded events include:

### Ticket Created

```text
Ticket created by User A
```

### Assignment

```text
Assigned to User B
```

### Escalation

```text
Escalated to Tier 2 Support
```

### Status Changes

```text
OPEN → IN_PROGRESS
IN_PROGRESS → RESOLVED
RESOLVED → CLOSED
```

---

## Database Design

### Core Models

#### User

```text
User
├── Department
└── Tickets
```

Stores authentication information and department membership.

---

#### Department

```text
Department
├── Users
└── Queue
```

Represents support teams responsible for processing tickets.

---

#### Ticket

```text
Ticket
├── Ticket Type
├── Current Department
├── Assigned User
└── Activity Logs
```

Represents a support request moving through a department pipeline.

---

#### Ticket Type

Defines the category of the ticket and determines which pipeline it follows.

Examples:

- Hardware Issue
- Software Issue
- Network Issue

---

#### Ticket Pipeline

Maps a ticket type to an ordered sequence of departments.

Example:

```text
Hardware Issue

1. Help Desk
2. Tier 2 Support
3. Infrastructure
```

This design allows multiple ticket types to have different department workflows.

---

## API Routes

### Authentication

```http
POST /auth/register
POST /auth/login
```

### Tickets

```http
POST   /tickets
GET    /tickets/my
GET    /tickets/department
GET    /tickets/:id
GET    /tickets/:id/activity

PATCH  /tickets/:id/assign
PATCH  /tickets/:id/escalate
PATCH  /tickets/:id/resolve
PATCH  /tickets/:id/close
```

### Users

```http
GET /users/me
GET /users/department
```

### Dashboard

```http
GET /dashboard/stats
```

### Ticket Types

```http
GET /ticketTypes
```

### Department

```http
GET /department
```

---

## Setup Instructions

### 1. Clone Repository

```bash
git clone <repository-url>
cd it-ticketing-system
```

---

### 2. Start PostgreSQL

```bash
docker compose up -d
```

---

### 3. Backend Setup

```bash
cd apps/api

npm install
```

Create:

```env
DATABASE_URL=
JWT_SECRET=
PORT=5000
```

Run migrations:

```bash
npx prisma migrate dev
```

Generate Prisma client:

```bash
npx prisma generate
```

Start server:

```bash
npm run dev
```

---

### 4. Frontend Setup

```bash
cd apps/web

npm install
```

Create:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start frontend:

```bash
npm run dev
```

---

## Seed Instructions

Run:

```bash
cd apps/api

npx prisma db seed
```

## Default Testing Flow

1. Login as any Department Member
2. Go to Department Queue
3. Assign or escalate tickets
4. Switch account (different department) to observe pipeline movement

Seed data includes:

### Departments

- Help Desk
- Tier 2 Support
- Infrastructure

### Users

2 users per department (DEPARTMENT_MEMBER)
1 (END_USER)

### Ticket Types

- Hardware Issue
- Software Issue
- Network Issue

### Sample Tickets

Tickets are seeded in different lifecycle stages for testing.

---

## Design Decisions

### Pipeline-Based Routing

Instead of hardcoding escalation logic inside controllers, ticket progression is driven by the TicketPipeline table.

Benefits:

- Flexible workflows
- Different ticket types can have different department paths
- Easier future expansion

---

### JWT Authentication

JWT was selected because:

- Stateless authentication
- Simple frontend integration
- Easy protection of API routes

---

### Activity Log Audit Trail

Every important action creates an Activity Log record.

Benefits:

- Complete ticket history
- Accountability
- Easier debugging and tracking

---

### Department-Centric Workflow

Tickets belong to a current department rather than a specific user.

Benefits:

- Mimics real IT support environments
- Allows reassignment
- Enables department queues

---

## Author

Joven Bataller

Portfolio:
https://wakamonoo.site

Project completed as part of the IT Ticketing System Take-Home Assessment.
