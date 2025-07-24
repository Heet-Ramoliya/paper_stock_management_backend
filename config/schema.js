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
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Trigger to auto-update 'updated_at' field on UPDATE
    db.run(`
      CREATE TRIGGER IF NOT EXISTS update_stock_updated_at
      AFTER UPDATE ON stocks
      FOR EACH ROW
      BEGIN
        UPDATE stocks SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
      END;
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
