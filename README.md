# 📝 Task Management System

![Microservices Architecture](https://img.shields.io/badge/Architecture-Microservices-blue)
![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot-green)
![React.js](https://img.shields.io/badge/Frontend-React.js-blue)
![Docker](https://img.shields.io/badge/Containerization-Docker-blue)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)
![Spring Security](https://img.shields.io/badge/Security-Spring%20Security-red)
![Eureka](https://img.shields.io/badge/Service%20Discovery-Eureka-orange)
![API Gateway](https://img.shields.io/badge/API%20Gateway-Spring%20Cloud%20Gateway-purple)

## 📖 Project Overview
The Task Management System is a robust and scalable web application built on a microservices architecture. It streamlines task assignment, tracking, and notifications with role-based access for users, managers, and admins. The system ensures efficient task management, security, and real-time communication between services.

## ✨ Key Features
- 🧑‍💻 **User Management**: Registration, login, profile management with JWT authentication
- 📋 **Task Management**: CRUD operations on tasks with prioritization and deadlines
- 🔔 **Real-Time Notifications**: Deadline reminders and status updates
- 🗂️ **Role-Based Access Control**: Different functionalities for users, managers, and admins
- 🔄 **Service Communication**: Feign clients for inter-service calls
- ⚙️ **Resilience & Fault Tolerance**: Resilience4j for circuit breaking and rate limiting
- 🌐 **Microservices Architecture:** Independent services for Users, Tasks, and Notifications.
- 🌐 **API Gateway**: Unified entry point for secure and efficient routing
- 🐳 **Dockerized Deployment**: Containerized services for easy deployment

## 🏗️ Tech Stack
### 🖥️ Frontend:
- React.js with Tailwind CSS for a sleek and responsive UI
- Redux for state management
- Axios for API calls

### 🖥️ Backend:
- Spring Boot for microservices development
- Spring Security with JWT for authentication and authorization
- Feign Clients for service-to-service communication
- Resilience4j for fault tolerance

### 🗃️ Database:
- PostgreSQL for reliable data management

### 🛠️ DevOps:
- Docker for containerization
- Eureka for service discovery
- Spring Cloud Gateway for API routing

## 🏛️ Microservices Architecture
```
                           +-------------------------+
                           |      API Gateway        |
                           +-----------+-------------+
                                       |
        +------------------------------+----------------------------+
        |                              |                            |
+----------------+     +----------------------+       +----------------------+
| User Service   |<--->|    Task Service      |<----->| Notification Service |
+----------------+     +----------------------+       +----------------------+
```
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

## 🏁 Getting Started
### 🚧 Prerequisites
- Java 23+
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL Or equivalent

### 🔧 Installation & Setup
1. **Clone the repository:**
    ```bash
    $ git clone https://github.com/dhruvgupta130/task-management-system.git
    ```
2. **Set up environment variables:**
   Create `.env` files for each microservice and set database URLs, JWT secrets, etc.

3. **Run services with Docker Compose:**
    ```bash
    $ docker-compose up --build
    ```
4. **Access the app:**
   - Frontend: `http://localhost:5173`
   - API Gateway: `http://localhost:8080`

## 🚀 Usage
- **User Panel:** Manage tasks, view notifications, and update profile
- **Manager Panel:** Assign and track tasks, monitor team progress
- **Admin Panel:** Manage users, view system-wide data

## 📂 Project Structure
```
.
├── user-service
│   ├── src
│   │   ├── controllers
│   │   ├── client
│   │   ├── configuration
│   │   ├── model
│   │   ├── dto
│   │   ├── services
│   │   ├── repositories
│   ├── resources
├── task-service
│   ├── src
│   │   ├── controllers
│   │   ├── model
│   │   ├── dto
│   │   ├── client
│   │   ├── exception
│   │   ├── services
│   │   ├── repositories
│   │   ├── task
│   ├── resources
├── notification-service
│   ├── src
│   │   ├── controllers
│   │   ├── model
│   │   ├── dto
│   │   ├── services
│   │   ├── repositories
│   │   ├── task
│   ├── resources
├── admin-server
├── api-gateway
├── eureka-server
├── react-app
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── management
│   │   ├── pages
│   │   ├── services
│   ├── public
├── docker-compose.yml
```
## 🧪 API Endpoints
| Endpoint                      | Method | Description             |
|-------------------------------|--------|-------------------------|
| /api/users/register           | POST   | Register a new user     |
| /api/users/login              | POST   | Authenticate user       |
| /api/tasks/create             | POST   | Create a new task       |
| /api/tasks/{id}               | GET    | Get task by ID          |
| /api/notifications/{userId}   | GET    | Get user notifications  |

## 🧑‍💻 Contribution Guidelines
We welcome contributions! Please fork the repository and create a pull request.

## 🐛 Known Issues
- Real-time notifications need WebSocket integration.
- Advanced filtering options for tasks are in progress.

## 🐘 PostgreSQL Setup (Optional)

If you don’t have PostgreSQL set up, use Docker to start a PostgreSQL container:

```bash
    docker run --name postgres-container -e POSTGRES_USER=youruser -e POSTGRES_PASSWORD=yourpassword -e POSTGRES_DB=taskdb -p 5432:5432 -d postgres
```

## 📄 License
This project is licensed under the MIT License.

## 💬 Contact
For questions or suggestions, feel free to reach out:
- **Email:** dhruvgupta130@gmail.com
- **LinkedIn:** [Your LinkedIn](https://www.linkedin.com/in/dhruvgupta130)

---

🚀 Built with passion by Dhruv Gupta

