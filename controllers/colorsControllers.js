const db = require("../config/db");

db.run(
  `
  CREATE TABLE IF NOT EXISTS colors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );
`,
  (err) => {
    if (err) {
      console.error("Error creating colors table:", err);
    } else {
      db.get("SELECT COUNT(*) AS count FROM colors", (err, row) => {
        if (err) {
          console.error("Error checking colors table:", err);
        } else if (row.count === 0) {
          db.run(
            `
          INSERT INTO colors (name) VALUES ('Natural'), ('Golden'), ('White');
        `,
            (err) => {
              if (err) {
                console.error("Error inserting default colors:", err);
              } else {
                console.log("Default colors inserted");
              }
            }
          );
        }
      });
    }
  }
);

const getColors = (req, res, next) => {
  db.all("SELECT * FROM colors", (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch colors" });
    } else {
      console.log("Fetched colors:", rows);
      res.status(200).json({
        success: true,
        message: "Colors fetched successfully",
        data: rows,
      });
    }
  });
};

module.exports = { getColors };
