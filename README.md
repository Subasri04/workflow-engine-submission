# Workflow Engine 
## Overview

This project implements a dynamic **Workflow Engine** that allows users to:

* Create workflows
* Define input schemas
* Add configurable steps
* Define priority-based rules
* Execute workflows dynamically
* Track execution logs with rule evaluations
* Visually manage workflow steps using React Flow

---

# Tech Stack

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* TypeScript

## Frontend

* React
* TypeScript
* React Query
* React Router
* React Flow
* Tailwind CSS

---

# Project Structure

```
workflow-engine-submission/
│
├── backend/   (Express + MongoDB API)
├── frontend/  (React UI)
└── README.md
```

---

# Setup Instructions

### 1️⃣ Backend Setup

### Install dependencies

```bash
cd backend
npm install
```

### Create `.env` file

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/workflow_engine
```

### Start backend

```bash
npm run dev
```

Server runs at:

```
http://localhost:5000
```

---

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

# Workflow Engine Design

## 1️⃣ Workflow

Each workflow contains:

* name
* version (auto-incremented on update)
* status (active/inactive)
* input_schema
* steps

### Input Schema Example

```json
{
  "amount": { "type": "number", "required": true },
  "country": { "type": "string", "required": true },
  "priority": {
    "type": "string",
    "allowed_values": ["High", "Medium", "Low"]
  },
  "employee_email": { "type": "string" }
}
```

---

## 2️⃣ Steps

Each step contains:

* name
* step_type (approval, notification, task, etc.)
* order (execution sequence)
* metadata
* associated rules

---

## 3️⃣ Rules

Rules determine the next step dynamically.

Each rule contains:

* condition (string expression)
* next_step_id
* priority (lower number = higher priority)

### Rule Engine Behavior

* Rules are evaluated at runtime
* First matching rule by priority is selected
* DEFAULT rule acts as fallback
* All evaluations are logged
* Loop protection via configurable max iteration limit

---

## 4️⃣ Execution Flow

When execution starts:

1. First step (lowest order) is selected
2. Rules are evaluated
3. Matching rule determines next step
4. Logs are stored for:

   * step execution
   * rule evaluations
   * decision taken
5. Execution ends when:

   * No next step
   * DEFAULT rule ends workflow
   * Loop limit exceeded

---

## Sample Workflow 1 – Expense Approval

### Input Schema

```json
{
  "amount": { "type": "number", "required": true },
  "country": { "type": "string", "required": true },
  "priority": {
    "type": "string",
    "allowed_values": ["High", "Medium", "Low"]
  },
  "employee_email": { "type": "string" }
}
```

### Steps

1. Manager Approval (approval)
2. Finance Notification (notification)
3. Task Rejection (task)

### Rules for Manager Approval

| Priority | Condition                                              | Next Step            |
| -------- | ------------------------------------------------------ | -------------------- |
| 1        | amount > 1000 && country == "US" && priority == "High" | Finance Notification |
| 2        | amount <= 1000                                         | Finance Notification |
| 3        | priority == "Low"                                      | Task Rejection       |
| 4        | DEFAULT                                                | Task Rejection       |

---

### Execution Example 1

Input:

```json
{
  "amount": 1500,
  "country": "US",
  "priority": "High",
  "employee_email": "john@company.com"
}
```

Execution Path:

Manager Approval → Finance Notification → Completed

---

### Execution Example 2 (DEFAULT Case)

Input:

```json
{
  "amount": 500,
  "country": "US",
  "priority": "Medium",
  "employee_email": "john@company.com"
}
```

Execution Path:

Manager Approval → Task Rejection → Completed

---

### Sample Workflow 2 – Employee Onboarding

### Input Schema

```json
{
  "department": { "type": "string", "required": true },
  "experience_years": { "type": "number" },
  "location": { "type": "string" }
}
```

### Steps

1. HR Screening
2. Technical Interview
3. Manager Approval
4. Offer Rollout

### Rules for HR Screening

| Priority | Condition             | Next Step           |
| -------- | --------------------- | ------------------- |
| 1        | experience_years >= 3 | Technical Interview |
| 2        | DEFAULT               | Manager Approval    |

---

## Features Implemented

* Workflow versioning
* Server-side pagination
* Search & filtering
* Dynamic rule evaluation
* DEFAULT rule fallback
* Execution logging
* React Flow visual editor
* Loop protection
* Execution history page
* Execution detail with rule logs

---