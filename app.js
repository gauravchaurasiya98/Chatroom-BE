require("dotenv").config();
const cors = require("cors");
const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authentication");
const userRouter = require("./routes/user");
const apiRouter = require("./routes/api");
const validation = require("./middlewares/validation");
const webSocketController = require("./controllers/websocket");
const {
  connectToMongoDb,
  closeMongoConnection,
} = require("./utils/mongo-connection");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true, // Allow cookies
  },
});

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // Allow cookies
  })
);
// Middleware to parse cookie
app.use(cookieParser());
// Middleware to parse json body
app.use(express.json());

// Authentication routes (login, register, etc.)
app.use("/auth", authRouter);
// User session management routes (refresh token, logout)
app.use("/user", validation.validateRefreshToken, userRouter);
// Protected application-specific routes
app.use("/api", validation.validateAuthToken, apiRouter);
app.use((err, req, res, next) => {
  console.error("Fallback error:", err.message);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Server error" });
});

// Middleware to authenticate WebSocket connections
io.use(validation.authenticateWebSocketConnections);
// Handle WebSocket connections
io.on("connection", (socket) =>
  webSocketController.handleConnections(io, socket)
);

const closeHttpServer = () => {
  console.log("Closing HTTP server...");
  server.close((err) => {
    if (err) {
      console.error("Error closing HTTP server:", err.message);
    } else {
      console.log("HTTP server closed.");
    }
  });
};

// Graceful shutdown
const cleanupResources = async () => {
  console.log("\nShutting down server...");
  webSocketController.closeWebSocketConnections();
  closeHttpServer();
  closeMongoConnection();
  process.exit(0); // Exit the process gracefully
};

// Event listeners for graceful shutdown
process.on("SIGINT", cleanupResources); // Ctrl+C
process.on("SIGTERM", cleanupResources); // Termination signal (e.g., from a hosting provider)

const PORT = process.env.PORT || 3000;
const startServer = async () => {
  await connectToMongoDb();
  server.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
  });
};

// Start the server
startServer();
