import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDb from './db/db.js'
import formRoutes from './routes/Form.js'

dotenv.config()

// const app = express()
// const PORT = process.env.PORT || 5001

// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || 'http://localhost:5173',
//   }),
// )
// app.use(express.json())

// app.get('/api/health', (_req, res) => {
//   res.json({ status: 'ok' })
// })

// app.use('/api/forms', formRoutes)


// try {
//   app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`)
//   })
//   const db = await connectDb()
//   if(db){
//     console.log('Connected to database')
//   } 

// } catch (error) {
//     console.error('Failed to start server', error)
//     process.exit(1)
// }


connectDb();

const app = express();
const origin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const methods = ["GET", "POST", "PUT", "DELETE"];

app.use(cors({ origin, methods }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ──────────────────  Routes ─────────────────────────
app.use("/api/forms", formRoutes);

// ───────────────── Fallback & error middleware ───────────────

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
