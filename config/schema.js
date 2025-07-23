module.exports = function initializeSchema(db) {
  db.serialize(() => {
    // Stocks Table
    db.run(`
        CREATE TABLE IF NOT EXISTS stocks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          color TEXT NOT NULL,
          size REAL NOT NULL,
          GSM REAL NOT NULL,
          bf TEXT NOT NULL,
          brand TEXT NOT NULL,
          piece INTEGER DEFAULT 0,
          weight REAL DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

    // Colors Table
    db.run(`
        CREATE TABLE IF NOT EXISTS colors (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL
        )
      `);
  });
};
