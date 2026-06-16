const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimiter = require("./middlewares/rateLimiter");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(rateLimiter);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "API Backend Fonctionnelle",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
