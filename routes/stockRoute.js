const express = require("express");
const router = express.Router();
const {
  addStock,
  allStocks,
  removeStock,
  updateStock,
  groupStocksByColors,
} = require("../controllers/stockController");

router.post("/add-stock", addStock);
router.get("/all-stocks", allStocks);
router.delete("/delete-stocks/:id", removeStock);
router.put("/update-stocks/:id", updateStock);
router.get("/grouped-stocks", groupStocksByColors);

module.exports = router;
