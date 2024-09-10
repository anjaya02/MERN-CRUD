require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const app = express();
const bodyParser = require("body-parser");

// IMPORT ROUTES
const postRoutes = require("./routes/posts");

// MIDDLEWARE
app.use(cors());
app.use(bodyParser.json());
app.use("/api", postRoutes);  

const PORT = process.env.PORT || 8000;
const DB_URL = process.env.DB_URL;

if (!DB_URL) {
  console.error("DB_URL is not defined in environment variables.");
  process.exit(1);
}

mongoose
  .connect(DB_URL, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

