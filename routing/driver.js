let route = require('express').Router()

route.get("/driver", (req,res)=>{
  res.send("halaman customer")
})


module.exports = route