const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const productsRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const orderRoutes = require("./routes/orderRoutes.js");
const uploadRoutes = require("./routes/uploadRoutes.js");
const subscribeRoute = require("./routes/subscribeRoute.js");
const adminRoutes = require("./routes/adminRoutes.js");
const productAdminRoutes = require("./routes/productAdminRoutes.js");
const adminOrderRoutes = require("./routes/adminOrderRoutes.js");

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB();

app.get("/" , (req,res) =>{
    res.send("Welcome to BRAND API!");
});

//api routes
app.use("/api/users" , userRoutes);
app.use("/api/products" , productsRoutes);
app.use("/api/cart" , cartRoutes);
app.use("/api/checkout" , checkoutRoutes);
app.use("/api/orders" , orderRoutes);
app.use("/api/upload" , uploadRoutes);
app.use("/api" , subscribeRoute);

//admin 
app.use("/api/admin/users" , adminRoutes);
app.use("/api/admin/products" , productAdminRoutes);
app.use("/api/admin/orders" , adminOrderRoutes);

app.listen(PORT , ()=> console.log(`http://localhost:${PORT}`));