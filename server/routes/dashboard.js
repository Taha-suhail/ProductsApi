const express = require('express');
const router = express.Router();
const dashboardPage = "../views/layouts/dashboard"
const product = require("../models/product");
const isAuthenticated = require('../middleware/authMiddleware');
router.get("/dashboard",isAuthenticated,async(req,res)=>{
    try {
        const allProduct = await product.find();
        res.render("dashboard/index",{
            layout:dashboardPage,
            products:allProduct
        })
    } catch (error) {
        console.log(error);
    }
   
})
//route for rendering adding page
router.get("/dashboard/add",isAuthenticated,(req,res)=>{
    res.render("dashboard/add",{
        layout:dashboardPage
    })
})
//route for adding new products in the dashboard
router.post("/dashboard/add",async(req,res)=>{
    try {
        const newProductData = req.body;
        newProductData.featured = req.body.featured === 'on';
        // console.log('Featured Field:', newProductData.featured);
        const existingProduct = await product.findOne({ productId: newProductData.productId });

        if (existingProduct) {
            // Alert the user that the chosen productId already exists
            return res.status(400).send('Product ID already exists. Please choose a different one.');
        }

        const newProduct = await product.create(newProductData);
        res.redirect('/dashboard');
    } catch (error) {
        console.log("Error adding product")
    }
})
//route for rendering update page
router.get('/dashboard/product/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        // console.log(productId)
        const productData = await product.findOne({ productId: productId });

        if (!productData) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Render the form with the existing values
        res.render('dashboard/update', { productData,layout:dashboardPage });
    } catch (error) {
        console.error('Error fetching product details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
//updating the product and redirecting to dashboard
router.put("/dashboard/product/update/:productId",async(req,res)=>{
    try {
        const productId = req.params.productId;
        const updatedData = req.body;
        const updateProduct = await product.findOneAndUpdate({ productId: productId }, updatedData, { new: true });
        if (!updateProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.redirect("/dashboard")
    } catch (error) {
        console.log(error);
    }
})
//delete a product
router.delete("/dashboard/product/delete/:productId",async(req,res)=>{
    try {
        const productId = req.params.productId;
        await product.findOneAndDelete({productId:productId});
        res.redirect("/dashboard")
    } catch (error) {
        console.log(error)
    }
   
    
})
//route for rendering products that are featured and rendering the featured tab
router.get("/dashboard/featured",async(req,res)=>{
    try {
        const featuredProducts = await product.find({featured:true});
        res.render("dashboard/featured",{
            layout:dashboardPage,
            products:featuredProducts
        })
    } catch (error) {
        console.log(error)
    }
})

// Route to fetch products with price less than a certain value
router.get('/dashboard/price/:maxPrice', async (req, res) => {
    try {
        const maxPrice = parseFloat(req.params.maxPrice);

        // Fetch products with price less than the specified value
        const products = await product.find({ price: { $lt: maxPrice } });

        // Render the view with the filtered products
        res.render('dashboard/price', { products, maxPrice, layout: dashboardPage });
    } catch (error) {
        console.error('Error fetching products by price:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
module.exports = router;