# Rick and Morty AI App

An AI-powered full-stack application that lets users **create**, **customize**, **analyze**, and **chat with characters** in the Rick and Morty universe. It uses the official Rick and Morty API alongside OpenRouter AI to create an immersive character experience.

---

## 🚀 Features

### 🖥️ Frontend (Next.js)
- 🔍 Search official and custom Rick and Morty characters
- 🎨 Create & edit custom characters with avatars
- ✍️ Generate rich AI backstories
- 🧠 Get Big Five personality analysis
- 🎬 AI-suggested matching episodes
- 💬 Chat with characters in their own voice
- 🔗 Analyze relationships between characters
- 👤 Authentication (Login/Register)
- 🧪 Fully responsive UI with Tailwind CSS

### 🧪 Backend (Node.js + Express)
- ✅ JWT-based user auth
- 🧾 REST APIs for characters, AI tools, and auth
- 🧠 OpenRouter AI integration (GPT models)
- 🌐 MongoDB database for custom characters

---

## 🛠️ Tech Stack

| Layer     | Stack                                      |
|----------:|--------------------------------------------|
| Frontend | Next.js 13+, TypeScript, Tailwind CSS       |
| Backend  | Node.js, Express.js, MongoDB, Mongoose      |
| AI       | OpenRouter AI API (GPT, DeepSeek, etc.)     |
| Auth     | JWT, bcrypt                                 |
| Infra    | dotenv, CORS, Helmet, Axios                 |

---

## Folder Structure

```

rick-and-morty-ai-app/
├── frontend/       # Next.js app with UI and routing
│   ├── app/        # Pages (characters, chat, auth, custom)
│   ├── components/ # UI components (modals, cards, buttons)
│   └── lib/        # API helpers
│
├── backend/        # Express.js server
│   ├── routes/     # Auth, character, and AI APIs
│   ├── models/     # MongoDB schemas
│   ├── middleware/ # Auth middleware
│   └── server.js   # Entry point

````

---

## Authentication

- Users must register and log in to access features.
- JWT tokens are stored in `localStorage` and used for protected API routes.
- Protected routes: `/api/characters`, `/api/ai/*`

---

## API Overview

### Auth (`/api/auth`)
| Method | Route      | Description       |
|--------|------------|-------------------|
| POST   | /register  | Create new user   |
| POST   | /login     | Login and get JWT |

### Characters (`/api/characters`)
| Method | Route                     | Description                     |
|--------|---------------------------|---------------------------------|
| GET    | /                         | Get user's characters           |
| POST   | /                         | Create a new character          |
| GET    | /search                   | Search API + custom characters  |
| GET    | /:id                      | Get character by ID             |
| PUT    | /:id                      | Update character                |
| DELETE | /:id                      | Delete character                |
| PATCH  | /:id/backstory            | Update character backstory      |
| DELETE | /:id/backstory            | Remove character backstory      |

### AI (`/api/ai`)
| Method | Route             | Description                         |
|--------|------------------|-------------------------------------|
| POST   | /chat            | Chat with a character               |
| POST   | /backstory       | Generate backstory using AI         |
| POST   | /personality     | Get Big Five personality traits     |
| POST   | /episodes        | Recommend relevant episodes         |
| POST   | /relationships   | Predict character relationships     |

---

## ⚙️ .env Example

```env
# Backend
PORT=5000
MONGO_URI=mongodb://localhost:27017/rickmortyai
JWT_SECRET=your_secret

# OpenRouter AI
OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions
OPENROUTER_MODEL=openai/gpt-oss-20b:free
OPENROUTER_API_KEY=your_openrouter_api_key

# Frontend URL
FRONTEND_URL=http://localhost:3000
````

---

## 🧪 Local Development

### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/rick-and-morty-ai-app.git
cd rick-and-morty-ai-app
```

### 2. Backend Setup

```bash
cd backend
npm install
npm start
```

> API runs at `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

> Frontend runs at `http://localhost:3000`

---

## Screenshots *(optional)*

> You can insert screenshots like this:

```
![Character Search](./screenshots/search.png)
![Backstory Modal](./screenshots/backstory.png)
```

---

## Future Ideas

* [ ] OAuth via Google/GitHub
* [ ] Save chat history
* [ ] Voice-to-character interactions
* [ ] Admin dashboard
* [ ] Theme customization
