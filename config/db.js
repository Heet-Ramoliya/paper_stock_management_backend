const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");
const initializeSchema = require("./schema");

const dbPath = path.join(__dirname, "../paper_stock.sqlite");
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
    return;
  }

  console.log("Connected to the paper stock database.");

  initializeSchema(db);
});

module.exports = db;
