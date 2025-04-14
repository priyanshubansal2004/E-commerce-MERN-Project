const express = require("express");
const router = express.Router();
const Product = require("../models/Products");
const { protect, admin } = require("../middleware/authMiddleware");


// @desc    Create new product
// @route   POST /api/products
// @access  Private (add auth middleware if needed)
router.post("/",protect , admin, async (req, res) => {
    try {
      const product = new Product(req.body);
      const createdProduct = await product.save();
      res.status(201).json(createdProduct);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  // @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
router.put("/:id",protect , admin , async (req, res) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
      res.json(updatedProduct);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
router.delete("/:id",protect , admin ,  async (req, res) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
      res.json({ message: "Product deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // @route   GET /api/products
// @desc    Get all products with optional query filters
// @access  Public
router.get("/", async (req, res) => {
    try {
      const {
        collection,
        size,
        color,
        gender,
        minPrice,
        maxPrice,
        sortBy,
        search,
        category,
        material,
        brand,
        limit,
      } = req.query;
  
      const query = {};
  
      // Filter logic
      if (collection && collection.toLowerCase() !== "all") {
        query.collections = collection;
      }
  
      if (category && category.toLowerCase() !== "all") {
        query.category = category;
      }
  
      if (material) {
        query.material = { $in: material.split(",") };
      }
  
      if (brand) {
        query.brand = { $in: brand.split(",") };
      }
  
      if (size) {
        query.sizes = { $in: size.split(",") };
      }
  
      if (color) {
        query.colors = { $in: [color] };
      }
  
      if (gender) {
        query.gender = gender;
      }
  
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }
  
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }
  
      // Sort Logic
      let sort = {};
      if (sortBy) {
        switch (sortBy) {
          case "priceAsc":
            sort = { price: 1 };
            break;
          case "priceDesc":
            sort = { price: -1 };
            break;
          case "popularity":
            sort = { rating: -1 };
            break;
          default:
            break;
        }
      }
  
      // Fetch products and apply sorting and limit
      let products = await Product.find(query)
        .sort(sort)
        .limit(Number(limit) || 0);
  
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).send("server Error");
    }
  });
  
    // @route   GET /api/products/best-seller
// @desc    Retrieve the product with highest rating
// @access  Public
router.get("/best-seller", async (req, res) => {
    try {
      const bestSeller = await Product.findOne().sort({ rating: -1 }).limit(1);
      if (!bestSeller) {
        return res.status(404).json({ msg: "No products found" });
      }
      res.json(bestSeller);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Server Error" });
    }
  });

  // @route   GET /api/products/new-arrivals
// @desc    Retrieve latest 8 products - Creation date
// @access  Public
router.get("/new-arrivals", async (req, res) => {
    try {
      const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8);
      res.json(newArrivals);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Server Error" });
    }
  });
  

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
router.get("/:id" , async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/products/similar/:id
// @desc    Retrieve similar products based on the current product's gender and category
// @access  Public
router.get("/similar/:id", async (req, res) => {
    try {
      const { id } = req.params;
  
      // Get the current product
      const currentProduct = await Product.findById(id);
      if (!currentProduct) {
        return res.status(404).json({ msg: "Product not found" });
      }
  
      // Build query for similar products
      const similarProducts = await Product.find({
        _id: { $ne: id }, // exclude the current product
        gender: currentProduct.gender,
        category: currentProduct.category,
      }).limit(10); // optional limit
  
      res.json(similarProducts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Server Error" });
    }
  });

  
module.exports = router;
