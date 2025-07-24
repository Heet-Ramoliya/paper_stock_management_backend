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

const removeStock = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Stock ID is required",
    });
  }

  const deleteQuery = `DELETE FROM stocks WHERE id = ?`;

  db.run(deleteQuery, [id], function (err) {
    if (err) {
      console.error("Error deleting stock:", err.message);
      return res.status(500).json({
        success: false,
        message: "Failed to delete stock",
        error: err.message,
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        success: false,
        message: "Stock not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Stock deleted successfully",
    });
  });
};

const updateStock = (req, res) => {
  const { id } = req.params;
  const { color, size, GSM, bf, brand, newWeight, newPiece } = req.body;

  if (!color || !size || !GSM || !bf || !brand || !newWeight || !newPiece) {
    return res.status(400).json({
      success: false,
      message:
        "All fields are required. Please provide color, size, GSM, BF, brand, newWeight, and newPiece.",
    });
  }

  const normalizedBrand =
    brand.trim().charAt(0).toUpperCase() + brand.trim().slice(1).toLowerCase();

  db.get(`SELECT weight, piece FROM stocks WHERE id = ?`, [id], (err, row) => {
    if (err) {
      console.error("Error fetching stock:", err.message);
      return res.status(500).json({
        success: false,
        message:
          "An error occurred while fetching stock data. Please try again.",
      });
    }

    if (!row) {
      console.warn(`Stock with ID ${id} not found.`);
      return res.status(404).json({
        success: false,
        message: `No stock found with ID ${id}.`,
      });
    }

    const currentWeight = parseFloat(row.weight);
    const currentPiece = parseInt(row.piece);
    const reduceWeight = parseFloat(newWeight);
    const reducePiece = parseInt(newPiece);

    const updatedWeight = currentWeight - reduceWeight;
    const updatedPiece = currentPiece - reducePiece;

    if (updatedWeight < 0 || updatedPiece < 0) {
      return res.status(400).json({
        success: false,
        message: `You cannot remove more than available stock.`,
      });
    }

    const updateQuery = `
      UPDATE stocks
      SET color = ?, size = ?, GSM = ?, bf = ?, weight = ?, brand = ?, piece = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const values = [
      color,
      size,
      GSM,
      bf,
      updatedWeight,
      normalizedBrand,
      updatedPiece,
      id,
    ];

    db.run(updateQuery, values, function (updateErr) {
      if (updateErr) {
        console.error("Error updating stock:", updateErr.message);
        return res.status(500).json({
          success: false,
          message: "Failed to update the stock. Please try again later.",
        });
      }

      return res.status(200).json({
        success: true,
        message: `Stock updated successfully`,
        updatedWeight,
        updatedPiece,
      });
    });
  });
};

module.exports = {
  addStock,
  allStocks,
  removeStock,
  updateStock,
};
