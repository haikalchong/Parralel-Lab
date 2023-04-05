const express= require("express")
const router = express.Router();

router.get('/',(req,res)=>{
    res.render("landing/index")
})

router.get('/aboutus',(req,res)=>{
    res.render("landing/about-us")
})

router.get("/contactus",(req,res)=>{
    res.render("landing/contact-us")
})



module.exports= router;