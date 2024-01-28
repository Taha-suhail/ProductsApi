const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const user = require("../models/user");
const bcrypt = require("bcrypt");
// const dashboardPage = "../views/layouts/dashboard"
const dashboardRoute = require('../routes/dashboard');
const logoutRoute = require('../routes/logout');
router.use('/dashboard', dashboardRoute);
router.use('/logout', logoutRoute);
router.get("/",(req,res)=>{
    res.render("index");
})
router.get("/login",(req,res)=>{
    res.render("login");
})
router.get("/signup",(req,res)=>{
    res.render("signup");
})


router.post("/signup",async(req,res)=>{
    const data = {
        name: req.body.username,
        password: req.body.password
    };
    
    try {
        // Check if the user already exists
        const existUser = await user.findOne({ name: data.name });
    
        if (existUser) {
            res.send("User Already Exists. Please enter a different name.");
        } else {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(data.password,saltRounds);
            data.password = hashedPassword;
            // If the user does not exist, insert a new user
            const userData = await user.create(data);
            req.session.user = {
                username: data.name,
                // Add other user-related information if needed
            };
            res.redirect("/dashboard");
            // res.send("User created successfully.Please login now");
            // console.log("User created successfully.Please login now");
           
            
            // res.redirect("dash")
        }
        
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
   
    
})

router.post("/login", async (req, res) => {
    try {
        const check = await user.findOne({ name: req.body.username });
        if (!check) {
            res.send("User name cannot found")
            return;
        }
        // Compare the hashed password from the database with the plaintext password
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (!isPasswordMatch) {
            res.send("wrong Password");
            return;
        }
        else {
            // Set session information upon successful login
            req.session.user = {
                username: check.name,
                // Add other user-related information if needed
            };

        
            res.redirect("/dashboard");
        }
    }
    catch {
        res.send("wrong Details");
    }
});
module.exports = router;