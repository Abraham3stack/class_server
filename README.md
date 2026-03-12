# Classwork

This repository is split into two applications:

- `code-campus/`: frontend React app
- `server/`: backend Express app

## Frontend

Location: `code-campus`

Run:

```bash
cd code-campus
npm run dev
```

## Backend

Location: `server`

Run:

```bash
cd server
npm run dev
```

The backend expects MongoDB at:

```bash
mongodb://127.0.0.1:27017/code-campus-appraisal
```

You can override that with `MONGODB_URI`.
