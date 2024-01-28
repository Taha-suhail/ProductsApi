require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const session = require("express-session");
const bcrypt = require('bcrypt');
const path = require('path')
const port = 5000 ||  process.env.PORT;
const methodOverride = require("method-override");
const connectDB = require("./server/config/db");
connectDB();
app.use(express.urlencoded({extended:true}));//the data submitted from the form would be available in your route handler as req.body.username and req.body.password
app.use(session({
    secret: "goku", // Replace with a secret key for session encryption
    resave: false,
    saveUninitialized: false,
  }));
app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.static("public"));
app.use(expressLayouts);
app.set('layout','./layouts/main');
app.set('view engine','ejs');
app.use('/',require('./server/routes/index'))
app.use('/',require('./server/routes/dashboard'))

app.get("*",function(req,res){
    res.status(404).send("error page does not exist");
})
app.listen(port,()=>{
    console.log(`app is listening on port ${port}`);
})