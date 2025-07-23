const express = require("express");
const router = express.Router();
const { addStock, allStocks } = require("../controllers/stockController");

router.post("/add-stock", addStock);
router.get("/all-stocks", allStocks);

module.exports = router;
