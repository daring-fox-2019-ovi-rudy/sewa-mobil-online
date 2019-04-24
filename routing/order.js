let route = require('express').Router()

route.get("/order", (req,res)=>{
  res.send("halaman order")
})



module.exports = route