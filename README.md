# Music Platform — WebFullstack MakerTime

An open music platform where users upload their own audio files to the server, metadata is stored in a database, and music plays through an interactive streaming player.

## Features

### Level 1 — Core
- **Backend:** Express server + MySQL database with a `tracks` table. File uploads (MP3 + cover art) via Multer.
- **Database:** On upload, the file path and metadata (title, artist) are written to the DB.
- **Frontend:** React page with an upload form and a track list fetched from the server via Axios.
- **Streaming:** Playback of the selected track through a standard HTML5 audio player streaming data from the server.

### Level 2 — State & UI
- **Redux Toolkit:** Player logic moved to global state. The player is pinned in the footer (Player Bar) and keeps playing while navigating between pages.
- **UI/UX:** Material UI media library (Grid of track cards). Loading spinner while the track list is being fetched.

### Level 3 — Search, Style, i18n
- **Search & Filter:** Live search by title and genre filtering via SQL queries on the backend.
- **Styled Components:** `styled()` from MUI for a responsive design that adapts to the current track's cover color.
- **i18next:** Full UA/EN localization of the interface.

## Tech stack

- Frontend: React 19, Vite, Material UI, Redux Toolkit, Axios, i18next
- Backend: Express, Multer, mysql2
- Database: MySQL (with JSON-file fallback for local dev)

## Quick start

### Server

```cmd
cd server
npm install
```

Create a **.env** file with your database credentials (never commit this file):

```dotenv
HOST=localhost
USER=root
PASSWORD=root
DATABASE=myDatabase
PORT=3306
```

```cmd
npm run dev
```

Server runs on port 3000. See `server/schema.sql` for the `tracks` table.

### Client

```cmd
cd client
npm install
npm run dev
```

## API

| Method | Endpoint       | Description                  |
| ------ | -------------- | ---------------------------- |
| GET    | `/files`       | List all tracks (newest first) |
| POST   | `/upload`      | Upload audio + cover (multipart: `audio`, `cover`, fields: `title`, `artist`, `genre`) |
| GET    | `/download/:id`| Download / stream a track    |
| GET    | `/delete/:id`  | Delete a track and its files |

## Author

Kwixq13 — 16 y.o. Fullstack developer from Ukraine.
