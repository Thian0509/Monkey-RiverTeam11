import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./database";
import Express from "./express";
import mongoose from "mongoose";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

connectDB();

const app = new Express().app;
app.use(errorHandler);

app.get("/api/db-health", (_req, res) => {
  const dbHealthy = mongoose.connection.readyState === 1;
  if (dbHealthy) {
    res.status(200).json({
      status: "Database is healthy",
      connection: mongoose.connection.readyState,
    });
  } else {
    res.status(500).json({
      status: "Database is down",
      connection: mongoose.connection.readyState,
    });
  }
});

import usersRoutes from "./routes/users";
import authRoutes from "./routes/authRoutes";
import monitoredDestinationRoutes from "./routes/monitoredDestinationRoutes";
import alertRoutes from './routes/alertRoutes';

app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/destinations", monitoredDestinationRoutes);
app.use('/api/alerts', alertRoutes);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
