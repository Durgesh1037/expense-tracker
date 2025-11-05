import express, { type Request, type Response } from "express";
import connectDB from "./config/db.ts";
import  cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
import authRoutes from "./routes/authRoutes.ts";
import profileRoutes from "./routes/profileRoutes.ts";
import expensesRoutes from "./routes/expensesRoutes.ts";
import dashboardRoutes from './routes/dashboardRoutes.ts';
import categoryRoutes from './routes/categoryRoutes.ts';

connectDB();

const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:3000';

app.use(cors({
  origin: FRONTEND_URL ? [FRONTEND_URL] : false, // Allow requests only from FRONTEND_URL or disable CORS if not set
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Allow cookies to be sent
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use((err: any, req: Request, res: Response, next: Function) => {
//   console.error(err.stack);
//   res.status(500).send("Something broke!");
// });
app.get("/", (req: Request, res: Response) => {
  res.send("Hello TypeScript with Express!");
});

app.use("/api/auth", authRoutes);
app.use("/api/me", profileRoutes);
app.use("/api/expenses", expensesRoutes);
app.use('/api/dashboard',dashboardRoutes);
app.use('/api/categories',categoryRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
