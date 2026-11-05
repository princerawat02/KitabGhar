require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDatabase = require("./config/db");

const apiRoutes = require("./routes/index.routes");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.use("/api", apiRoutes);

app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Something went wrong." });
});

async function start() {
  app.listen(port, () => console.log(`KitabGhar API listening on ${port}`));
  connectDatabase().catch((error) => {
    console.error(
      "Unable to connect to MongoDB; API is running without a database connection:",
      error.message,
    );
  });
}

if (require.main === module)
  start().catch((error) => {
    console.error("Unable to start KitabGhar API:", error.message);
    process.exit(1);
  });

module.exports = app;
