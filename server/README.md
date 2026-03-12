# Server

This folder contains the backend Express application only.

## Responsibilities

- Accept appraisal submissions from the frontend
- Validate and persist appraisal records with Mongoose
- Connect to MongoDB

## Scripts

```bash
npm run dev
npm run start
```

## Default API

- `GET /api/health`
- `POST /api/forms`
- `GET /api/forms`

## Database

Default connection string:

```bash
mongodb://127.0.0.1:27017/code-campus-appraisal
```
