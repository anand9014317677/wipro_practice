# SmartPizza AI — Backend (Auth Foundation)

Spring Boot 3.4 + Java 21 + MySQL 8 backend for the SmartPizza AI capstone.
This first slice delivers a **fully runnable authentication module** built on the
same layered architecture every future module (pizzas, cart, orders, payments, AI)
will plug into.

## What's implemented

- **JWT authentication** — register, login, stateless `Bearer` token security
- **Role-based authorization** — `CUSTOMER`, `ADMIN`, `DELIVERY` (route rules wired in `SecurityConfig`)
- **Layered architecture** — `controller → service → repository → entity`, with DTOs + a mapper
- **Global exception handling** — consistent JSON error body for validation / auth / not-found
- **Bean validation** — `@Valid` on request DTOs
- **Swagger / OpenAPI** — interactive docs with a JWT "Authorize" button
- **Seeded demo accounts** — admin + delivery created on first startup

## Prerequisites

- JDK 21
- Maven 3.9+ (or use the IDE's bundled Maven)
- MySQL 8 running locally

## Configuration

Defaults live in `src/main/resources/application.yml` and can be overridden with env vars:

| Variable        | Default     | Notes                                   |
|-----------------|-------------|-----------------------------------------|
| `DB_HOST`       | `localhost` |                                         |
| `DB_PORT`       | `3306`      |                                         |
| `DB_NAME`       | `smartpizza`| Auto-created on first run               |
| `DB_USERNAME`   | `root`      |                                         |
| `DB_PASSWORD`   | `root`      | Change to match your local MySQL        |
| `JWT_SECRET`    | dev default | **Override in production**, min 32 chars|
| `CORS_ORIGINS`  | localhost:5173,3000 | Comma-separated allowed origins  |

The schema is created automatically (`spring.jpa.hibernate.ddl-auto=update`), so you
only need an empty MySQL server running — the `smartpizza` database is created for you.

## Run it

```bash
cd backend
mvn spring-boot:run
```

Or open the `backend` folder in IntelliJ IDEA and run `SmartPizzaApplication`.

App starts on **http://localhost:8080**.

## Try it

Swagger UI: **http://localhost:8080/swagger-ui.html**

### Default seeded accounts
| Role     | Email                     | Password      |
|----------|---------------------------|---------------|
| ADMIN    | `admin@smartpizza.ai`     | `admin123`    |
| DELIVERY | `delivery@smartpizza.ai`  | `delivery123` |

### Register a customer
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Anand G","email":"anand@example.com","password":"secret123","phone":"9876543210"}'
```

### Login
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"anand@example.com","password":"secret123"}'
```
Both return:
```json
{ "accessToken": "<JWT>", "tokenType": "Bearer", "user": { ... } }
```

### Call a protected endpoint
```bash
curl http://localhost:8080/api/v1/users/me \
  -H "Authorization: Bearer <JWT>"
```

## Project structure

```
backend/src/main/java/com/smartpizza/
├── SmartPizzaApplication.java
├── config/        # SecurityConfig, ApplicationConfig (beans), OpenApiConfig, DataInitializer
├── security/      # JwtService, JwtAuthenticationFilter, CustomUserDetailsService
├── entity/        # User, Role
├── repository/    # UserRepository
├── dto/           # request/ (Register, Login)  +  response/ (Auth, User)
├── mapper/        # UserMapper (entity -> DTO)
├── service/       # AuthService + impl/AuthServiceImpl
├── controller/    # AuthController, UserController
└── exception/     # GlobalExceptionHandler, ApiError, custom exceptions
```

## How this maps to the capstone rubric

- **JWT Security (10)** — token issue/validate, stateless filter chain, role rules
- **REST API Development (15)** — versioned `/api/v1` endpoints, proper status codes
- **Validation & Error Handling (5)** — DTO validation + global handler
- **Component Architecture** — clean separation across layers, interface-based service

## Next modules (to be added on this skeleton)

1. Pizza catalog + categories (search / filter / sort)
2. Cart & order logic
3. Payments (Razorpay / Stripe)
4. **AI recommendation engine** (the headline AI feature)
5. Delivery tracking + ETA
