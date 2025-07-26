const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const errorHandler = require("./middleware/errorHandler");
const colorsRoutes = require("./routes/colorsRoutes");
const stockRoute = require("./routes/stockRoute");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) =>
  res.send("Welcome to Paper Stock Management website")
);

app.get("/api/download-db", (req, res) => {
  const dbPath = "/opt/render/project/src/paper_stock.sqlite";
  res.download(dbPath, "paper_stock.sqlite", (err) => {
    if (err) {
      console.error("Error downloading database:", err.message);
      res.status(500).send("Error downloading database");
    }
  });
});

app.use("/api/paper-stock", colorsRoutes, stockRoute);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("SIGINT", () => {
  console.log("Shutting down server...");
  process.exit();
});
