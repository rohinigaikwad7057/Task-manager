const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorMiddleware");

connectDB();

const app = express();

/* Logger (move to top) */
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

/* CORS */
app.use(cors({
  origin: "*", // later you can restrict to frontend URL
}));

/* Body parser */
app.use(express.json());

/* Routes */
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

/* Health check */
app.get("/", (req, res) => {
  res.send("API is running");
});

/* Error handler */
app.use(errorHandler);

/* FIXED PORT */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});