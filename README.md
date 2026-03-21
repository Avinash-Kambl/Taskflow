# ⚡ TaskFlow — Team Task Management App

A full-stack Kanban-style task management platform built with React.js, Node.js, Express, MongoDB, and JWT authentication.

---

## 🗂 Project Structure

```
taskflow/
├── backend/          # Node.js + Express REST API
│   ├── config/       # MongoDB connection
│   ├── controllers/  # Route logic
│   ├── middleware/   # JWT auth middleware
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API routes
│   └── server.js     # Entry point
│
└── frontend/         # React.js SPA
    └── src/
        ├── components/
        │   ├── Auth/     # Login, Register
        │   ├── Board/    # Dashboard, BoardPage, MemberModal
        │   ├── Layout/   # Navbar
        │   └── Task/     # TaskCard, TaskModal
        ├── context/      # AuthContext, ProjectContext, TaskContext
        ├── styles/       # Global CSS
        └── utils/        # Axios API config
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)

---

### 1. Backend Setup

```bash
cd taskflow/backend
npm install
```

Create a `.env` file (copy from `.env.example`):

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/taskflow
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

Start the backend server:

```bash
npm run dev     # development (nodemon)
npm start       # production
```

Backend runs at: **http://localhost:5000**

---

### 2. Frontend Setup

```bash
cd taskflow/frontend
npm install
```

Optionally create a `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm start
```

Frontend runs at: **http://localhost:3000**

---

## 🔌 API Endpoints (12 total)

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user (protected) |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get all user projects |
| POST | `/api/projects` | Create a project |
| GET | `/api/projects/:id` | Get single project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |
| POST | `/api/projects/:id/members` | Add member to project |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks/project/:id` | Get tasks by project |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| PATCH | `/api/tasks/:id/status` | Update task status (drag-drop) |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/search?email=` | Search users by email |

---

## ✨ Features

- 🔐 **JWT Authentication** — Register/Login with secure token-based auth
- 👥 **Role-Based Access** — Admin and Member roles per project
- 📋 **Kanban Board** — Drag-and-drop tasks across columns using `@hello-pangea/dnd`
- 🏷 **Task Management** — Title, description, priority, assignee, due date, tags
- 🎨 **Project Colors** — Color-coded projects for quick identification
- 📱 **Responsive** — Works on desktop and mobile
- 🌙 **Dark Theme** — Clean dark UI throughout

---

## 🛠 Tech Stack

**Frontend:** React.js 18, React Router v6, Context API, @hello-pangea/dnd, Axios, react-hot-toast, date-fns

**Backend:** Node.js, Express.js, Mongoose ODM, bcryptjs, jsonwebtoken, cors, dotenv

**Database:** MongoDB Atlas (cloud) or local MongoDB

**Deployment:** Render (backend), Vercel/Netlify (frontend)

---

## 🚢 Deployment

### Deploy Backend to Render
1. Push backend folder to GitHub
2. Create a new Web Service on [render.com](https://render.com)
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables from `.env`

### Deploy Frontend to Vercel
1. Push frontend folder to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Set `REACT_APP_API_URL` to your Render backend URL
4. Deploy!

---

## 📝 Default Kanban Columns

Each new project starts with 4 columns:
- **Todo** → **In Progress** → **In Review** → **Done**

---

Built with ❤️ by Avinash Kamble
