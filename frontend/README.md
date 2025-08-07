# Rick and Morty AI App — Frontend

This is the **frontend** for the **Rick and Morty AI App**, a full-stack AI-powered platform that lets users search, create, and chat with Rick and Morty-style characters. Built with **Next.js 13+ (App Router)** and **Tailwind CSS**, the frontend offers an interactive and responsive UI powered by OpenRouter AI APIs and your Express backend.

---

## ✨ Features

- 🔐 JWT-based login & registration
- 🔍 Search Rick and Morty characters (API + custom)
- ➕ Create, edit, and delete custom characters
- 🧠 Generate AI-powered backstories
- 🧬 Big Five personality profiling
- 🎬 Episode recommendations using AI
- 💬 In-character AI chat interface
- 🔗 Relationship analysis for selected characters
- 🎨 Tailwind CSS + reusable UI components

---

## Tech Stack

| Tool            | Description                         |
|-----------------|-------------------------------------|
| **Next.js 13+** | React framework with App Router     |
| **TypeScript**  | Strongly typed language support     |
| **Tailwind CSS**| Utility-first CSS                   |
| **Radix UI**    | Accessible UI primitives (dialogs)  |
| **OpenRouter AI** | AI backend for all character features |
| **JWT Auth**    | Login / register + token handling   |

---

## Folder Structure

```

frontend/
├── app/                  # Next.js pages (app directory)
│   ├── characters/       # Search + interaction UI
│   ├── custom/           # Create/edit custom characters
│   ├── chat/             # AI chat interface
│   ├── login/            # Login screen
│   ├── register/         # Registration screen
│   └── layout.tsx        # Global layout and fonts
│
├── components/           # Reusable UI components
│   └── ui/               # Modals, buttons, cards, navbar
│
├── lib/                  # Shared utilities (e.g., auth fetch)
├── public/               # Static assets (logos, icons)
├── styles/ or globals.css# Tailwind + base styles
└── tsconfig.json         # TypeScript config

````

---

## Authentication

- JWT tokens are stored in `localStorage`
- Routes like `/characters`, `/custom`, and `/chat` are **protected**
- Middleware logic in `ClientWrapper.tsx` handles redirects for unauthenticated access

---

## Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
````

### 2. Start Development Server

```bash
npm run dev
```

Runs at: `http://localhost:3000`

---

## API Integration

The frontend communicates with the Express backend using `fetchWithAuth()` for all protected routes.

> Make sure the backend is running at `http://localhost:5000` or update `fetchWithAuth()` in `lib/api.ts` to match your environment.

---

## Key Screens & Components

| Page                   | Description                                |
| ---------------------- | ------------------------------------------ |
| `/characters`          | Search official + custom characters        |
| `/chat`                | Chat with any character                    |
| `/custom`              | List of user-created characters            |
| `/custom/new`          | Create a new character                     |
| `/custom/[id]`         | Edit character, view or generate backstory |
| `/login` / `/register` | Auth routes                                |

### Core Components

* `CharacterCard.tsx` — full character display UI
* `BackstoryModal.tsx` — modal for backstory viewing/editing
* `RelationshipModal.tsx` — AI-based relationship suggestions
* `Navbar.tsx` — top navigation bar
* `button.tsx`, `input.tsx`, etc. — shared styled components

---

## AI Features (via backend)

| Action               | Route Called                 |
| -------------------- | ---------------------------- |
| Generate backstory   | `POST /api/ai/backstory`     |
| Analyze personality  | `POST /api/ai/personality`   |
| Recommend episodes   | `POST /api/ai/episodes`      |
| Chat with character  | `POST /api/ai/chat`          |
| Predict relationship | `POST /api/ai/relationships` |

---

## Environment Notes

This frontend relies on:

* **Backend running at `http://localhost:5000`**
* **OpenRouter API key** configured in backend `.env`
* **CORS allowed from `http://localhost:3000`**

