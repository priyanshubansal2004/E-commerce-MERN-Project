const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Products");
const {protect} = require("../middleware/authMiddleware");

// Helper to get cart
const getCart = async (userId, guestId) => {
  if (guestId) return await Cart.findOne({ guestId: String(guestId) });
  if (userId) return await Cart.findOne({ userId });
  return null;
};

// @route POST /api/cart
// @desc Add a product to the cart (user or guest)
// @access Public
router.post("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;
  
  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const parsedQuantity = Number(quantity);

    let cart = await getCart(userId, guestId);

    if (cart) {
      const index = cart.products.findIndex(
        (p) =>
          p.productId.toString() === productId &&
          p.size === size &&
          p.color === color
      );

      if (index > -1) {
        cart.products[index].quantity += parsedQuantity;
      } else {
        cart.products.push({
          productId,
          name: product.name,
          image: product.images[0].url,
          price: product.price,
          size,
          color,
          quantity: parsedQuantity,
        });
      }
    } else {
      const newGuestId = guestId ? String(guestId) : "guest_" + new Date().getTime();

      cart = await Cart.create({
        user: userId || undefined,
        guestId: newGuestId,
        products: [
          {
            productId,
            name: product.name,
            image: product.images[0].url,
            price: product.price,
            size,
            color,
            quantity: parsedQuantity,
          },
        ],
      });
    }

    cart.totalPrice = cart.products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await cart.save();
    return res.status(200).json(cart);
  } catch (error) {
    console.error("Cart Add Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route PUT /api/cart
// @desc Update product quantity in the cart for a guest or logged-in user
// @access Public
router.put("/", async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;
  
    try {
      let cart = await getCart(userId, guestId);
      if (!cart) return res.status(404).json({ message: "Cart not found" });
  
      const productIndex = cart.products.findIndex(
        (p) =>
          p.productId.toString() === productId &&
          p.size === size &&
          p.color === color
      );
  
      if (productIndex > -1) {
        if (quantity > 0) {
          cart.products[productIndex].quantity = Number(quantity);
        } else {
          cart.products.splice(productIndex, 1); // Remove if quantity is 0
        }
  
        cart.totalPrice = cart.products.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
  
        await cart.save();
        return res.status(200).json(cart);
      } else {
        return res.status(404).json({ message: "Product not found in cart" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server Error" });
    }
  });
  

// @route GET /api/cart
// @desc Get the cart for a guest or logged in user
// @access Public
router.get("/", async (req, res) => {
  const { userId, guestId } = req.query;

  try {
    const cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.status(200).json(cart);
  } catch (error) {
    console.error("Cart Fetch Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// @route DELETE /api/cart
// @desc Remove a product from the cart
// @access Public
router.delete("/", async (req, res) => {
    const { productId, size, color, guestId, userId } = req.body;

    try {
      let cart = await getCart(userId, guestId);
      if (!cart) return res.status(404).json({ message: "cart not found" });
  
      const productIndex = cart.products.findIndex(
        (p) =>
          p.productId.toString() === productId &&
          p.size === size &&
          p.color === color
      );
  
      if (productIndex > -1) {
        cart.products.splice(productIndex, 1);
  
        cart.totalPrice = cart.products.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
  
        await cart.save();
        return res.status(200).json(cart);
      } else {
        return res.status(404).json({ message: "Product not found in cart" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server Error" });
    }
  });
  
// @route POST /api/cart/merge
// @desc Merge guest cart into user cart on login
// @access Private
router.post("/merge", protect, async (req, res) => {
    const { guestId } = req.body;
  
    try {
      // Find the guest cart and user cart
      const guestCart = await Cart.findOne({ guestId });
      const userCart = await Cart.findOne({ user: req.user._id });
  
      if (guestCart) {
        if (guestCart.products.length === 0) {
          return res.status(400).json({ message: "Guest cart is empty" });
        }
  
        if (userCart) {
          // Merge guest cart into user cart
          guestCart.products.forEach((guestItem) => {
            const productIndex = userCart.products.findIndex(
              (item) =>
                item.productId.toString() === guestItem.productId.toString() &&
                item.size === guestItem.size &&
                item.color === guestItem.color
            );
  
            if (productIndex > -1) {
              // If the item exists in user cart, update quantity
              userCart.products[productIndex].quantity += guestItem.quantity;
            } else {
              // Otherwise, add the guest item to the cart
              userCart.products.push(guestItem);
            }
          });
  
          userCart.totalPrice = userCart.products.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
          );
  
          await userCart.save();
  
          // Remove guest cart after merging
          try {
            await Cart.findOneAndDelete({ guestId });
          } catch (error) {
            console.error("Error deleting guest cart:", error);
          }
  
          return res.status(200).json(userCart);
        } else {
          // If user has no existing cart, assign guest cart to user
          guestCart.user = req.user._id;
          guestCart.guestId = undefined;
          await guestCart.save();
  
          return res.status(200).json(guestCart);
        }
      } else {
        if (userCart) {
          // Guest cart already merged, return user cart
          return res.status(200).json(userCart);
        }
  
        return res.status(404).json({ message: "Guest cart not found" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server Error" });
    }
  });
  
module.exports = router;
