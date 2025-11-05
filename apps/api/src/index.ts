import express, { type Request, type Response } from "express";
import connectDB from "./config/db.ts";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
import authRoutes from "./routes/authRoutes.ts";
import profileRoutes from "./routes/profileRoutes.ts";
import expensesRoutes from "./routes/expensesRoutes.ts";
import dashboardRoutes from './routes/dashboardRoutes.ts';
import categoryRoutes from './routes/categoryRoutes.ts';

connectDB();


app.use(cors({
  origin: [process.env.FRONTEND_URL], // Adjust according to your frontend URL and port
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
