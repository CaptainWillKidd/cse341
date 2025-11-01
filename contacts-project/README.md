# Contacts Project (Week 1)

This project implements a small Contacts API for the CSE341 Week 1 assignment. It includes:

- GET /contacts - returns all contacts
- GET /contacts/:id - returns a single contact by MongoDB _id

Setup

1. Copy `.env.example` to `.env` and set `MONGO_URI` to your MongoDB connection string.

2. Install dependencies:

```powershell
cd "c:\Users\rober\OneDrive\Documents\BYU Idaho\CSE 341\cse341\contacts-project"
npm install
```

3. (Optional) Import sample data into your `contacts` collection:

```powershell
npm run import
```

4. Start the server:

```powershell
npm start
```

The server listens on `process.env.PORT` or `3000` by default. Test endpoints with a REST client or PowerShell:

```powershell
Invoke-RestMethod -Uri 'http://localhost:3000/contacts' | ConvertTo-Json -Depth 5

Invoke-RestMethod -Uri 'http://localhost:3000/contacts/<id>' | ConvertTo-Json -Depth 5
```

Deploying to Render

- Push the repository to GitHub.
- Create a new Web Service on Render and connect to your GitHub repo.
- Set the Start Command to `npm start`.
- Add a config var `MONGO_URI` with your connection string in the Render dashboard.

Notes

- `.env` is ignored by `.gitignore`. Do not commit it.
- The `import-data.js` script will insert three sample contacts into your `contacts` collection. Use it only once to avoid duplicates.
