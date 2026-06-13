import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import ticketRoutes from "./routes/ticket.routes";
import userRoutes from "./routes/user.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import ticketTypeRoutes from "./routes/ticketType.routes"

import { authMiddleware } from "./middleware/auth.middleware";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/me", authMiddleware, (req: any, res) => {
  res.json(req.user);
});

app.use("/auth", authRoutes);
app.use("/tickets", ticketRoutes);
app.use("/users", userRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/ticketType", ticketTypeRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`API is running on http://localhost:${PORT}`);
});
