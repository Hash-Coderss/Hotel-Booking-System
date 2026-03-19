# StayEase - Hotel Booking Microservices System

A complete, highly scalable, and modern Hotel Booking platform built using **Spring Boot Microservices** backend and a **React+Vite** frontend.

## 🏗️ Architecture & Technical Aspects

The platform follows a standard Microservices architecture coordinated via a centralized API Gateway and dynamic Service Registry.

### Backend Stack
- **Framework**: Spring Boot 3.5.x, Spring Cloud 2025
- **Service Discovery**: Netflix Eureka (`service-registry`)
- **API Routing**: Spring Cloud Gateway MVC (`api-gateway`)
- **Inter-Service Communication**: OpenFeign (`spring-cloud-starter-openfeign`)
- **Security**: Spring Security + JWT (JSON Web Tokens)
- **Database**: MySQL (Each microservice has its own isolated database scheme)

### Frontend Stack
- **Framework**: React 18, Vite
- **Networking**: Axios with automatic JWT interceptors
- **Styling**: Custom CSS with Dark Glassmorphism aesthetic, React Hot Toast
- **Routing**: React Router DOM (v6)

### System Flow
1. **Frontend (`localhost:5173`)** talks solely to the **API Gateway (`localhost:8081`)**.
2. **API Gateway** automatically routes requests to the correct underlying microservice based on the path.
3. **Eureka Server (`localhost:8761`)** dynamically tracks the health and IP addresses of all running microservices.

---

## 👥 Member Contributions

This project was built collaboratively by our engineering team. Each member took ownership of a specific microservice domain:

*   **Tejdeep** — `auth-service` (Authentication, JWT Token Generation, Spring Security)
*   **Shankar** — `booking-service` (Booking Engine, Feign Client validation, Date logic)
*   **Dhanush** — `hotel-service` (Hotel CRUD, Search, Catalog Management)
*   **Adeeb** — `user-service` (User Profiles, Syncing IDs, Frontend React integration)

---

## 📜 API Endpoint Contract

All requests should be routed through the API Gateway `http://localhost:8081`. 

> **Authentication:** Most endpoints (except Login/Register and viewing hotels) require passing the JWT token in the headers:  
> `Authorization: Bearer <your_token_here>`

### 🛡️ Auth Service (by Tejdeep)
*Base Path: `/auth`*
| Method | Endpoint | Description | Body / Payload |
|---|---|---|---|
| `POST` | `/auth/register` | Create a new core credential | `{ "email": "x", "password": "x", "role": "USER\|ADMIN" }` |
| `POST` | `/auth/login` | Authenticate and retrieve JWT | `{ "email": "x", "password": "x" }` |

### 👤 User Service (by Adeeb)
*Base Path: `/users`*
| Method | Endpoint | Description | Body / Payload |
|---|---|---|---|
| `POST` | `/users` | Create user profile (run once after register) | `{ "name": "x", "location": "x" }` |
| `GET` | `/users/me` | Get the currently logged-in user profile | *JWT Token Required* |
| `GET` | `/users/{id}` | Get a specific user profile by ID | *JWT Token Required* |
| `PUT` | `/users/{id}` | Update your user profile | `{ "name": "x", "location": "x" }` |

### 🏨 Hotel Service (by Dhanush)
*Base Path: `/hotel`*
| Method | Endpoint | Description | Body / Payload |
|---|---|---|---|
| `GET` | `/hotel` | Get all hotels (supports `?city=x`) | *None* |
| `GET` | `/hotel/{id}` | Get a specific hotel by ID | *None* |
| `POST` | `/hotel` | Add a new hotel (**ADMIN ONLY**) | `{ "name", "city", "price", "rating", "description" }`|
| `PUT` | `/hotel/{id}` | Update a hotel (**ADMIN ONLY**) | `{ "name", "city", ... }` |
| `DELETE`| `/hotel/{id}` | Delete a hotel (**ADMIN ONLY**) | *None* |

### 📅 Booking Service (by Shankar)
*Base Path: `/bookings`*
| Method | Endpoint | Description | Body / Payload |
|---|---|---|---|
| `GET` | `/bookings` | List all bookings | *JWT Token Required* |
| `POST` | `/bookings` | Book a hotel stay | `{ "hotelId": 1, "checkIn": "YYYY-MM-DD", "checkOut": "YYYY-MM-DD", "price": 2500 }` |
| `PUT` | `/bookings/{id}` | Update a booking | `{ "checkIn": "...", "checkOut": "..." }` |
| `PUT` | `/bookings/cancel/{id}`| Cancel an active booking | *None* |

---

## 🚀 How to Run Locally

### 1. Database Setup
Create the following databases in MySQL:
`create database auth_db; create database userdb; create database hoteldb; create database bookingdb;`

### 2. Start Microservices
Run the services in this exact order to ensure successful Eureka registration:
1. `service-registry` (Port 8761)
2. `api-gateway` (Port 8081)
3. `auth-service` (Port 8084)
4. `user-service` (Port 8088)
5. `hotel-service` (Port 8082)
6. `booking-service` (Port 8083)

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Open your browser to `http://localhost:5173`.
