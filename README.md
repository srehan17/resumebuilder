# Resume Builder

A full-stack web app where users can register, log in, and manage their resume — profile, work experience, and education.

## Features

- Register and log in with JWT-based authentication
- Manage your profile (name, email, phone, location, LinkedIn link)
- Add, edit, and delete work experience entries
- Add, edit, and delete education entries
- Preview a clean, read-only resume compiled from your data

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Redux Toolkit, React Router, Bootstrap 5 |
| Backend | Node.js, Express, MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Testing | Mocha, Chai, Supertest, mongodb-memory-server (backend) · Jest, React Testing Library (frontend) |

## Project Structure

```
resumebuilder/
├── client/        # React frontend
└── server/        # Express REST API
```

## Getting Started

### Prerequisites

- Node.js 16+
- MongoDB (local or Atlas)

### 1. Clone and install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment variables

Copy the example file and fill in your values:

```bash
cp server/.env.example server/.env
```

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5001
```

### 3. Run the app

```bash
# Start the backend (from /server)
npm run dev

# Start the frontend (from /client)
npm start
```

Frontend runs on `http://localhost:3000`, backend on `http://localhost:5001`.

## Testing

### Backend

```bash
cd server
npm test
```

Uses `mongodb-memory-server` — no real database required. Requires a `server/.env.test` file with `JWT_SECRET=testsecret` (not committed — create it manually before running tests).

28 integration tests covering auth, experience, and education endpoints.

### Frontend

```bash
cd client
npm test
```

27 unit tests covering Redux slice reducers (auth, experience, education) and app rendering.

## API Endpoints

All protected routes require `Authorization: Bearer <token>` header.

### Auth
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/api/users` | Public | Register |
| POST | `/api/users/login` | Public | Login |
| GET | `/api/users/me` | Protected | Get current user |

### Experience
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/api/experience` | Protected | Get all entries |
| POST | `/api/experience` | Protected | Create entry |
| PUT | `/api/experience/:id` | Protected | Update entry |
| DELETE | `/api/experience/:id` | Protected | Delete entry |

### Education
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/api/education` | Protected | Get all entries |
| POST | `/api/education` | Protected | Create entry |
| PUT | `/api/education/:id` | Protected | Update entry |
| DELETE | `/api/education/:id` | Protected | Delete entry |

### Profile
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/api/profile` | Protected | Get profile |
| POST | `/api/profile` | Protected | Create or update profile |
| DELETE | `/api/profile` | Protected | Delete profile |

## Screenshots

<img width="1322" height="711" alt="Screenshot 2026-04-24 at 10 53 33 PM" src="https://github.com/user-attachments/assets/9c6a4e52-c23f-4e6b-83b5-0fe46a2bfada" />
<br>
<br>
<img width="1322" height="711" alt="Screenshot 2026-04-24 at 10 53 04 PM" src="https://github.com/user-attachments/assets/e5c6a634-c02b-4761-82ed-c34d59fea90b" />
<br>
<br>
<img width="1322" height="711" alt="Screenshot 2026-04-24 at 10 54 37 PM" src="https://github.com/user-attachments/assets/28440550-4231-458f-82dc-6010f987d804" />
<br>
<br>
<img width="1322" height="711" alt="Screenshot 2026-04-24 at 10 54 30 PM" src="https://github.com/user-attachments/assets/cf9cb019-b145-46b8-b692-33a64a4f4f26" />
<br>
<br>
<img width="1322" height="711" alt="Screenshot 2026-04-24 at 10 54 17 PM" src="https://github.com/user-attachments/assets/542f7c98-9524-4068-8af2-7f432e841923" />
<br>
<br>
<img width="1322" height="711" alt="Screenshot 2026-04-24 at 10 54 06 PM" src="https://github.com/user-attachments/assets/c61af063-2222-4ace-bd42-5bb9ffe617dc" />


