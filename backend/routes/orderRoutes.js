const express = require("express");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// @desc   Get current logged-in user's orders (alias)
// @route  GET /api/orders/my-orders
// @access Private
router.get("/my-orders", protect, async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });
  
  // GET /orders/:id - Get a single order by ID
  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    if (!id || id === "undefined") {
      return res.status(400).json({ message: "Invalid order ID" });
    }
  
    try {
      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (err) {
      console.error("Error fetching order:", err);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  
module.exports = router;
