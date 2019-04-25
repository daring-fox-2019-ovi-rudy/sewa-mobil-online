let route = require('express').Router()

route.get("/login",(req,res)=>{
  res.render("login_page.ejs")
})

route.post("/login", (req,res)=>{
  
})

module.exports = route