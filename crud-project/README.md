# Games Library API (CRUD Project)

This project implements a Games Library API with two collections: `games` and `platforms`.

Quick start

1. Copy `.env.example` to `.env` and set `MONGO_URI`.
2. Install dependencies:

```powershell
cd "c:\Users\rober\OneDrive\Documents\BYU Idaho\CSE 341\cse341\crud-project"
npm install
```

3. (Optional) Import sample data:

```powershell
npm run import
```

4. Start server:

```powershell
npm start
```

5. Open Swagger UI: `http://localhost:4000/api-docs`

Routes
- /games [GET, POST]
- /games/:id [GET, PUT, DELETE]
- /platforms [GET, POST]
- /platforms/:id [GET, PUT, DELETE]

Notes
- Do not commit `.env` to GitHub. Use the `.env.example` as a template.
- When deploying to Render, set the Root Directory to `crud-project`, Build Command `npm install`, Start Command `npm start`, and add `MONGO_URI` as a config var.
