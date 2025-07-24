const express = require("express");
const router = express.Router();
const {
  addStock,
  allStocks,
  removeStock,
  updateStock,
} = require("../controllers/stockController");

router.post("/add-stock", addStock);
router.get("/all-stocks", allStocks);
router.delete("/delete-stocks/:id", removeStock);
router.put("/update-stocks/:id", updateStock);

module.exports = router;
