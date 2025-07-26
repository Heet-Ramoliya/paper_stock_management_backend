const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");
const initializeSchema = require("./schema");

const dbPath = path.join(process.cwd(), "paper_stock.sqlite");
const dbDir = path.dirname(dbPath);

console.log("Database path:", dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log("Created database directory:", dbDir);
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
    return;
  }
  console.log("Connected to the paper stock database.");

  initializeSchema(db, (err) => {
    if (err) {
      console.error("Schema initialization failed:", err.message);
    } else {
      console.log("Schema initialized successfully.");
    }
  });
});

module.exports = db;
