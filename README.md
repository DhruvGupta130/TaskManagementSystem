# 📝 Task Management System

![Microservices Architecture](https://img.shields.io/badge/Architecture-Microservices-blue) ![Spring Boot](https://img.shields.io/badge/Backend-SpringBoot-green) ![React](https://img.shields.io/badge/Frontend-React-blue) ![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue) ![Docker](https://img.shields.io/badge/Containerization-Docker-blue)

## 📑 Project Overview
The **Task Management System** is a full-fledged web application built with a **microservices architecture**, designed for efficient task assignment, tracking, and management. It provides separate panels for **Users**, **Managers**, and **Admins** — ensuring role-based access and streamlined workflows. The system features real-time notifications, task prioritization, and deadline reminders.

## 🚀 Key Features
- 🧑‍💻 **User Management:** Register, login, and manage user profiles with secure JWT authentication.
- ✅ **Task Management:** Create, assign, update, and track tasks.
- 🔔 **Real-time Notifications:** Get instant updates on task status.
- 🎯 **Task Prioritization:** Organize tasks based on urgency and importance.
- ⏳ **Deadline Reminders:** Stay on top of due dates with automated alerts.
- 🔐 **Role-based Access Control:** Separate permissions for Admin, Manager, and User.
- 🌐 **Microservices Architecture:** Independent services for Users, Tasks, and Notifications.
- 🛡️ **Spring Security:** Secure API access with JWT tokens.
- 🐳 **Docker Containerization:** Streamlined deployment and scalability.

## 🛠️ Tech Stack
**Backend:**
- 🌱 Spring Boot
- 🌐 Spring Cloud (Eureka, API Gateway, Feign Clients)
- 🛡️ Spring Security + JWT
- 🛠️ Resilience4j (Circuit Breaker, Retry, Rate Limiter)
- 🐘 PostgreSQL

**Frontend:**
- ⚛️ React.js
- 💨 Tailwind CSS
- 🔄 Redux (State Management)

**Deployment:**
- 🐳 Docker
- 🌍 Singaporean Server (IST Timezone)

## 🏗️ Microservices Breakdown
1. **User Service:**
   - CRUD operations for users
   - Authentication and Authorization
   - Role management
2. **Task Service:**
   - CRUD operations for tasks
   - Task assignment and prioritization
3. **Notification Service:**
   - Real-time task updates
   - Deadline reminders

## ⚙️ Setup & Installation
```bash
# Clone the repository
git clone https://github.com/your-repo/task-management-system.git

# Navigate into the project directory
cd task-management-system

# Start Docker containers
docker-compose up --build

# Access the frontend
http://localhost:3000
```

## 🧪 API Endpoints
| Endpoint                      | Method | Description            |
|------------------------------|--------|------------------------|
| /api/users/register           | POST   | Register a new user    |
| /api/users/login              | POST   | Authenticate user      |
| /api/tasks/create             | POST   | Create a new task      |
| /api/tasks/{id}               | GET    | Get task by ID         |
| /api/notifications/{userId}   | GET    | Get user notifications |

## 🐛 Known Issues
- Real-time notifications need WebSocket integration.
- Advanced filtering options for tasks are in progress.

## 📄 License
This project is licensed under the **MIT License**.

---
🚀 Built with passion by Dhruv Gupta

