const db = require("../config/db");

const addStock = (req, res) => {
  const { color, size, GSM, bf, brand, piece, weight } = req.body;

  if (!color || !size || !GSM || !bf || !brand || !piece || !weight) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const normalizedBrand =
    brand.trim().charAt(0).toUpperCase() + brand.trim().slice(1).toLowerCase();

  const checkQuery = `
      SELECT * FROM stocks
      WHERE color = ? AND size = ? AND GSM = ? AND bf = ? AND brand = ?
    `;

  db.get(checkQuery, [color, size, GSM, bf, normalizedBrand], (err, row) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({
        success: false,
        message: "Database error",
        error: err.message,
      });
    }

    if (row) {
      const updateQuery = `
          UPDATE stocks
          SET weight = weight + ?, piece = piece + ?
          WHERE id = ?
        `;

      db.run(updateQuery, [weight, piece, row.id], function (err) {
        if (err) {
          console.error("Error updating stock:", err);
          return res.status(500).json({
            success: false,
            message: "Failed to update stock",
            error: err.message,
          });
        }

        return res.status(200).json({
          success: true,
          message: "Stock updated successfully",
        });
      });
    } else {
      const insertQuery = `
          INSERT INTO stocks (color, size, GSM, bf, brand, piece, weight, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `;

      db.run(
        insertQuery,
        [color, size, GSM, bf, normalizedBrand, piece, weight],
        function (err) {
          if (err) {
            console.error("Error inserting stock:", err);
            return res.status(500).json({
              success: false,
              message: "Failed to add stock",
              error: err.message,
            });
          }
          return res.status(201).json({
            success: true,
            message: "New stock added successfully",
          });
        }
      );
    }
  });
};

const allStocks = (req, res) => {
  const query = `SELECT * FROM stocks ORDER BY created_at DESC`;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Error fetching stocks:", err.message);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch stock records",
        error: err.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Stock data fetched successfully",
      data: rows,
    });
  });
};

module.exports = {
  addStock,
  allStocks,
};
