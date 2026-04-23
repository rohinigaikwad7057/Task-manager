const dotenv = require("dotenv");
dotenv.config(); 
const errorHandler = require("./middleware/errorMiddleware");

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

const taskRoutes = require("./routes/taskRoutes");
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use(errorHandler);
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
