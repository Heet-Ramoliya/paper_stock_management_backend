const express = require("express");
const router = express.Router();
const { getColors } = require("../controllers/colorsControllers");

router.get("/colors", getColors);

module.exports = router;
