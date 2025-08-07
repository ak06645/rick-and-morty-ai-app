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

## How to Use the Rick and Morty AI App

Once the app is running at [http://localhost:3000](http://localhost:3000), here’s how users can interact with it:

---

### 1. Register & Login

* Go to `/register` to create a new account.
* Then go to `/login` and log in.
* A token is stored in your browser to access protected features.

---

### 2. Search Characters

* Navigate to `/characters`.
* Enter a name (e.g., `Morty`) or species (e.g., `Alien`) in the search bar.
* Results are fetched from:

  * The official Rick and Morty API
  * Your own custom characters (if any)

---

### 3. Add Custom Characters

* Go to `/custom`.
* Click **“+ Add New Character”**.
* Fill in details like name, species, gender, origin, and image (URL or file upload).
* Click **“Create”** — your character is now saved!

---

### 4. Generate Backstories

* From `/characters` or `/custom`, view a character card.
* Click **“Generate Backstory”** (for custom or API characters).
* View a vivid AI-generated story in a modal.
* You can regenerate (API) or delete (custom) backstories anytime.

---

### 5. Personality Analysis

* After generating a backstory, click **“Analyze Personality”**.
* The app uses AI to give a Big Five trait profile (Openness, Agreeableness, etc.).

---

### 6. Episode Suggestions

* With a backstory in place, click **“Recommend Episodes”**.
* The app recommends 2–3 Rick and Morty episodes that match your character's vibe.

---

### 7. Chat with Characters

* Go to `/chat`.
* Select a character from the dropdown (auto-loaded from the Rick and Morty API).
* Type a question and click **“Ask \[Character]”**.
* The character responds in their unique voice using AI.

---

### 8. Analyze Relationships

* On `/characters`, **select two or more characters**.
* Click **“Generate Relationship”**.
* You'll get an AI-generated summary of their likely relationship (e.g., rivals, lovers, allies).

---

## Tips

* You can combine **official characters** and **your custom ones** in searches and interactions.
* Use the **custom character editor** (`/custom/[id]`) to update traits and regenerate content.

---

## Sample Login Credentials (Optional for Demo)

You can provide dummy credentials for reviewers:

```text
Username: demo_user
Password: demo123
```

(Only if you seed this user in the DB)

---

## Future Ideas

* [ ] OAuth via Google/GitHub
* [ ] Save chat history
* [ ] Voice-to-character interactions
* [ ] Admin dashboard
* [ ] Theme customization
