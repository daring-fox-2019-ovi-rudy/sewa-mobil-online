let route = require('express').Router()

route.get("/customer",(req,res)=>{
  res.send("halaman customer")
})

module.exports = route