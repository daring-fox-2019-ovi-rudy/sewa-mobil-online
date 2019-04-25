let router = require('express').Router()
let Models = require('../models')
let Customer = Models.Customer
let Driver = Models.Driver 

router.get("/test", (req,res)=>{
  res.render("registerCustomer.ejs")
})

router.get("/", (req,res)=>{
  if(req.session.isLogin == undefined){   
    req.session.isLogin = false;
  } 
  res.render("home.ejs", {
    log : req.session,
    user: ''
  })
})

/// LOGIN PAGE ///
router.get("/:user/login", (req,res)=>{
  let theUser = req.params.user
  if(req.session.isLogin == undefined || req.session.isLogin == false){
    if(req.params.user == "customer" || req.params.user == "driver" ) {
      res.render("login_page.ejs", {
        log :req.session,
        user : theUser 
      })
    } else {
      res.send(`page not found`)
    }
  } else {
    res.redirect("/home")
  }
})

router.post("/:user/login", (req,res)=>{
  res.send(req.params.user)
})

/// SIGN UP PAGE ///
router.get("/:user/register", (req,res)=>{
  let theUser = req.params.user
  if(req.params.user == "customer") {
      res.render("registerCustomer.ejs",{
        log :req.session,
        user : theUser 
      })
  } else if (req.params.user == "driver") {
    res.render("registerDriver.ejs", {
      log :req.session,
      user : theUser 
    })
  } else {
    res.send(`page not found`)
  }
})

router.post("/:user/register", (req,res)=>{
  let theUser = req.params.user
  res.send(req.body)
  if(req.params.user == "customer") {
    res.render("registerCustomer.ejs",{
      log :req.session,
      user : theUser 
    })
  } else if (req.params.user == "driver") {
    Driver.create()
    .then(result=>{
      let objDriver = {}
      objDriver.name = req.body.name
      objDriver.password = req.body.password
      objDriver.car_type = req.body.car_type
      objDriver.license_plate = req.body.license_plate
      res.send(result)
      
      
      res.render("registerDriver.ejs", {
        log :req.session,
        user : theUser 
      })
    })
} else {
  res.send(`page not found`)
}
})

module.exports = router