const express = require("express");

const router = express.Router();

const {
  placeOrder,

  getOrders,

  getUserOrders,

  updateOrderStatus,
} = require("../controllers/orderController");

router.post("/", placeOrder);

router.get("/", getOrders);

router.get("/user/:phone", getUserOrders);

router.put("/:id", updateOrderStatus);

module.exports = router;
