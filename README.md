
# Chirpy   
Because “Twitter clone” sounded too serious for a TypeScript toy project.  

Chirpy is an experimental backend server built with Express + TypeScript. It handles users, chirps, and JWT authentication — because every side project deserves a login system.  

---

## ✨ What’s This?  
- Build a **real web server in TypeScript** — no frameworks doing magic behind your back.  
- Learn **how JWT auth actually works** (spoiler: it’s just signed JSON).  
- Understand **what makes TypeScript great** for backend code — types, errors, and compiler yelling at me before runtime does.  
- Play with **production-grade tools** (but don’t ship this in production unless you enjoy pain).  

> **Heads up:** This codebase is intentionally messy. It’s a **toy project** to re-learn the basics.  
> The entire codebase screams for refactoring. Don’t @ me.
> Refactoring will happen… eventually… probably… maybe.  

---

## 🛠 Installation  
```bash
git clone https://github.com/sithusan/chirpy
cd chirpy
npm install
npm run dev
```

 
# 🔐 Authentication

API endpoints (except `/api/healthz`) require a JWT.

## Login to get a token + refresh token

**POST** `/api/login`

**Request:**
```json
{
  "email": "<email>",
  "password": "<password>"
}
```

**Response:**
```json
{
  ...others
  "token": "<jwt_token>",
  "refreshToken": "<refresh_token>"
}
```

#  API Endpoints

## Health & Admin
| Method | Endpoint           | Description                                               | Auth |
|--------|--------------------|-----------------------------------------------------------|------|
| GET    | `/api/healthz`      | Returns OK if the server isn’t on fire                     | No   |
| GET    | `/admin/metrics`    | HTML page showing how many times Chirpy’s been visited     | No   |
| POST   | `/admin/reset`      | Resets visit count and nukes all users | No   |

## Authentication
| Method | Endpoint         | Description                                   | Auth |
|--------|------------------|-----------------------------------------------|------|
| POST   | `/api/login`      | Get JWT + refresh token                        | No   |
| POST   | `/api/refresh`    | Exchange refresh token for a shiny new JWT      | Yes   |
| POST   | `/api/revoke`     | Revoke refresh token (pretend logout is real)   | Yes   |

## Users
| Method | Endpoint        | Description                  | Auth |
|--------|-----------------|------------------------------|------|
| POST   | `/api/users`     | Create a new user            | No   |
| PUT    | `/api/users`     | Update an existing user      | Yes  |

## Chirps
| Method | Endpoint            | Description              | Auth |
|--------|---------------------|--------------------------|------|
| GET    | `/api/chirps`        | List all chirps           | No  |
| GET    | `/api/chirps/:id`    | Get chirp by ID           | No  |
| POST   | `/api/chirps`        | Create a new chirp        | Yes  |
| DELETE | `/api/chirps/:id`    | Delete chirp by ID        | Yes  |

## Webhooks
| Method | Endpoint                 | Description                   | Auth |
|--------|--------------------------|-------------------------------|------|
| POST   | `/api/polka/webhooks`      | Handle Polka webhook events    | Yes* |
