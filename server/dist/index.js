"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./database"));
const express_1 = __importDefault(require("./express"));
const mongoose_1 = __importDefault(require("mongoose"));
const errorHandler_1 = require("./middleware/errorHandler");
dotenv_1.default.config();
(0, database_1.default)();
const app = new express_1.default().app;
app.use(errorHandler_1.errorHandler);
app.get("/api/db-health", (_req, res) => {
    const dbHealthy = mongoose_1.default.connection.readyState === 1;
    if (dbHealthy) {
        res.status(200).json({
            status: "Database is healthy",
            connection: mongoose_1.default.connection.readyState,
        });
    }
    else {
        res.status(500).json({
            status: "Database is down",
            connection: mongoose_1.default.connection.readyState,
        });
    }
});
const users_1 = __importDefault(require("./routes/users"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const monitoredDestinationRoutes_1 = __importDefault(require("./routes/monitoredDestinationRoutes"));
const alertRoutes_1 = __importDefault(require("./routes/alertRoutes"));
app.use("/api/users", users_1.default);
app.use("/api/auth", authRoutes_1.default);
app.use("/api/destinations", monitoredDestinationRoutes_1.default);
app.use('/api/alerts', alertRoutes_1.default);
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
