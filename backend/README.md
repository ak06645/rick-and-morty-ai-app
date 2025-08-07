# 🧠 Rick and Morty AI App – Backend

This is the backend for the **Rick and Morty AI App** – an AI-powered platform where users can create, chat with, and analyze Rick and Morty-inspired characters. The backend provides APIs for authentication, character management, and intelligent AI features like backstory generation, personality analysis, and relationship detection using OpenRouter AI models.

---

## 🚀 Features

- 🔐 **JWT Authentication** (register & login)
- 🌌 **Character Management** (CRUD + Search)
- ✍️ **AI-Generated Backstories**
- 🧠 **Big Five Personality Profiling**
- 🗣️ **In-Character Chat Simulation**
- 🎬 **Episode Recommendations**
- 🔗 **Relationship Analysis Between Characters**
- 🧠 **Powered by OpenRouter AI APIs**

---

## Tech Stack

| Layer       | Tech                                |
|-------------|-------------------------------------|
| **Server**  | Node.js, Express.js                 |
| **Database**| MongoDB, Mongoose                   |
| **Auth**    | JWT, bcryptjs                       |
| **AI API**  | [OpenRouter](https://openrouter.ai) |
| **Others**  | dotenv, cors, helmet, axios         |

---

## Project Structure
backend/
├── middleware/ # JWT authentication middleware
├── models/ # Mongoose models (User, Character)
├── routes/
│ ├── auth.js # Auth routes (login, register)
│ ├── characters.js # Character CRUD + search
│ └── ai/
│ ├── backstory.js # AI-generated character backstories
│ ├── chat.js # Chat as a R&M character
│ ├── episodes.js # Episode recommendations
│ ├── personality.js # Big Five trait analysis
│ └── relationships.js # AI-based relationship prediction
├── .env # Environment variables
├── server.js # App entry point
└── package.json

## API Authentication

- All routes under `/api/characters` and `/api/ai` are protected by JWT.
- Pass the token via the `Authorization` header:

```http
Authorization: Bearer <your_token>
```
## Environment Variables (.env)
PORT=5000
MONGO_URI=mongodb://localhost:27017/rickmortyai
JWT_SECRET=your_jwt_secret

# OpenRouter API config
OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions
OPENROUTER_MODEL=openai/gpt-oss-20b:free
OPENROUTER_API_KEY=your_openrouter_api_key

# CORS origin
FRONTEND_URL=http://localhost:3000



## 📁 Project Structure

