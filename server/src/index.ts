// index.ts
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./database";
import Express from "./express"; // Assuming this is your custom Express app setup
import mongoose from "mongoose";
import { errorHandler } from "./middleware/errorHandler";
import express from 'express'; // <--- IMPORTANT: Add this import statement

dotenv.config();

connectDB();

const app = new Express().app; // Assuming this initializes your express app

// Middleware
app.use(cors()); // Make sure CORS is applied here so the client can connect
app.use(express.json()); // Essential for parsing JSON body

app.use(errorHandler); // Your error handling middleware

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
import accountRoutes from './routes/accountRoutes';

app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/destinations", monitoredDestinationRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/account", accountRoutes);

const path = require("path");
app.use(express.static(path.join(__dirname, "../../client/dist")));
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});