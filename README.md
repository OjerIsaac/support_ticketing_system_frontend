# Support Ticketing System Frontend

**Vue.js** web application for customers and support agents to create, manage, and respond to support tickets.

This project connects to the [Support Ticketing System Backend](https://github.com/OjerIsaac/support_ticketing_system_backend) (Ruby on Rails).

---

## Features

- Customer ticket submission
- Customer dashboard for ticket status tracking
- Agent dashboard to view and process tickets
- Comment threads between agents and customers
- Authentication via JWT
- Daily reminders for agents (triggered by backend)

---

## Prerequisites

- **Node.js** >= 16
- **npm**

---

## Getting Started

### Clone the Repository

```bash
git clone git@github.com:OjerIsaac/support_ticketing_system_frontend.git
cd support_ticketing_system_frontend
````

---

### Install Dependencies

```bash
npm install
```

---

### Configure Environment Variables

Create a `.env` file in the project root:

```dotenv
VITE_API_BASE_URL=http://localhost:3000/graphql
```

* `VITE_API_BASE_URL`: The Rails backend URL (default: `http://localhost:3000/graphql`)

Example for production:

```dotenv
VITE_API_BASE_URL=https://support-ticketing-system-backend.onrender.com/graphql
```

---

### Run the Development Server

```bash
npm run dev
```

Visit the app:

```
http://localhost:5173
```
