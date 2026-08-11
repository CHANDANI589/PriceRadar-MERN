const express = require("express");
const router = express.Router();
const { searchShopping, getProductOffers } = require("../controllers/shoppingController");

router.get("/search", searchShopping);
router.get("/offers", getProductOffers);

module.exports = router;
