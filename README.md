# MüllKalender

A waste collection calendar for Erfurt, Germany. 
Type in your street, pick your house number, and see exactly when each bin gets picked up.

Built as my final project for the AI Software Developer bootcamp at WBS Coding School.

**Live app:** https://mullkalender-frontend.onrender.com
**API:** https://mullkalender-app.onrender.com

> Render's free tier spins down after inactivity, so the first request might take 30-60 seconds to wake up.

## What it does

- **Real address lookup.** Every street in Erfurt (770+ of them), scraped directly from the city's official waste calendar system, with live collection dates pulled on demand.
- **MüllBot.** An AI assistant that answers questions about waste sorting and can identify items from a photo.
- **Bilingual.** Full German/English support across the whole app, including the AI chat.
- **Reminders.** A banner that shows up when a collection is coming within your chosen window, with a dismiss that comes back the next day.
- **Saved address.** Log in once, set your address and language as favorites, and the home page loads them automatically next time.
- **Abfall-ABC.** A searchable guide for "which bin does this go in" for common household items.
- **Wertstoffhöfe map.** Recycling centers around Erfurt with hours and what they accept.

## Pages

- `/` — search your address and see your collection schedule
- `/chat` — talk to MüllBot
- `/abfall-abc` — look up how to dispose of a specific item
- `/map` — find a recycling center
- `/profile` — save your address, language, and reminder preferences (requires login)

## Tech stack

**Frontend:** React + TypeScript, Vite, Tailwind CSS, React Router, Leaflet for maps

**Backend:** Express + TypeScript, MongoDB with Mongoose, JWT auth

**AI:** Groq API (Llama models) for chat and photo identification

**Data source:** The official SWE Stadtwerke Erfurt waste calendar.

## How the address lookup actually works

Erfurt's waste calendar site doesn't have a public API, but it does have internal endpoints that its own mobile site calls. I reverse-engineered the flow:

1. **Streets are seeded once.** A script hits the city's street-search endpoint, grabs all ~770 streets with their internal IDs, and stores them in MongoDB along with their valid house numbers. This makes the autocomplete instant.
2. **The calendar itself is fetched live.** Once you pick a street and house number, the backend calls the city's calendar endpoint in real time and parses the HTML it gets back, since collection dates can change and shouldn't be cached indefinitely.
3. **There's a quirk in their data:** when a week spans a month boundary, the city's own site mislabels the days in the new month with the old month's name. The backend detects this (day numbers go backwards, like 26 then 1) and fixes the date itself.

## Project structure

mullkalender-app/

├── backend/
│   └── src/
│       ├── controllers/   # request handlers
│       ├── models/        # MongoDB schemas
│       ├── routes/        # API routes
│       ├── services/      # SWE scraping logic, AI calls
│       ├── prompts/        # AI prompt templates (DE/EN)
│       ├── middleware/    # JWT auth
│       ├── scripts/       # one-time street seeding script
│       └── utils/         # shared helpers (regex escaping, JWT secret)
└── frontend/
└── src/
├── pages/          # one component per route
├── components/     # shared + page-specific components
├── hooks/          # custom hooks (e.g. useProfile)
├── languages/      # DE/EN translation files + context
├── types/          # shared TypeScript types
└── utils/          # schedule parsing, reminder logic

## Running it locally

You'll need Node.js, a MongoDB connection (Atlas works fine), and a Groq API key for the AI features.

### Backend

```bash
cd backend
npm install
```

Create a `.env` file:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=something_long_and_random
GROQ_API_KEY=your_groq_key
PORT=5000

Seed the database with waste items and a test user:

```bash
npm run seed
```

Seed the street list (takes a few minutes, fetches ~770 streets and their house numbers from the city's API):

```bash
npm run seed:streets
```

Start the server:

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
```

Create a `.env`:

VITE_API_URL=http://localhost:5000

```bash
npm run dev
```

### Test account if you want it

email: test@mullkalender.de
password: test123

This account already has Anger 1, Erfurt set as its address.