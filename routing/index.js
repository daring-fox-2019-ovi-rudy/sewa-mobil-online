let router = require('express').Router()
let Models = require('../models')
let Customer = Models.Customer
let Driver = Models.Driver 
let getrate = require('../helpers/basicrate')

const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

router.get("/test", (req,res)=>{
  res.send(req.session)
})

router.get("/", (req,res)=>{
  if(req.session.isLogin == undefined){   
    req.session.isLogin = false;
  } 
  let theUser = ""
  if(req.session.loggedAs){
    theUser = req.session.loggedAs
  }
  let status = ""
  if(req.query.status){
    let msg = req.query.status.toString()
    let message = "" 
    for(let i = 0; i < msg.length; i++){
      if(msg[i] === "-"){
        message += " "
      } else {
        message += msg[i]
      }
    }
    status = "Attention !! "+ message
  }
  res.render("home.ejs", {
    log : req.session,
    user: theUser,
    message : status
  })
})

/// LOGIN PAGE ///
router.get("/:user/login", (req,res)=>{
  let theUser = req.params.user
  let status = ""
  if(req.query.status){
    let msg = req.query.status.toString()
    let message = "" 
    for(let i = 0; i < msg.length; i++){
      if(msg[i] === "-"){
        message += " "
      } else {
        message += msg[i]
      }
    }
    status = "Attention !! "+ message
  }
  if(req.session.isLogin == undefined || req.session.isLogin == false){
    if(req.params.user == "customer" || req.params.user == "driver" ) {
      res.render("login_page.ejs", {
        log :req.session,
        user : theUser,
        message : status 
      })
    } else {
      res.send(`page not found`)
    }
  } else {
    res.redirect("/?status=already-logged-in")
  }
})

router.post("/:user/login", (req,res)=>{
  let theUser = req.params.user
  if(req.session.isLogin == undefined || req.session.isLogin == false){
    if(req.params.user == "customer" || req.params.user == "driver" ) {
     if(req.params.user == "driver") {
        let condition = {
          name : req.body.userName 
        }
        
        let myPlaintextPassword = req.body.password
        Driver.findOne({where:condition})
        .then(result=>{
          if(result) {
            let hash = result.password
            if(bcrypt.compareSync(myPlaintextPassword, hash) == true){
              req.session.isLogin = true
              req.session.userId = result.id
              req.session.userName = result.name
              req.session.loggedAs = 'driver'
              res.redirect("/")
            } else {
              res.redirect("/driver/login?status=login-failed-:-password-does-not-match")
            }
          } else {
            res.send("username not found")
          }
        })
      } else if(req.params.user == "customer") {
        // bcrypt.compareSync(myPlaintextPassword, hash);
      } 
    } else {
      res.send(`page not found`)
    }
  } else {
    res.redirect("/home")
  }
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
  if(req.params.user == "customer") {
    res.render("registerCustomer.ejs",{
      log :req.session,
      user : theUser 
    })
  } else if (req.params.user == "driver") {
    let objDriver = {}
    objDriver.name = req.body.name
    objDriver.password = req.body.password
    objDriver.car_type = req.body.car_type
    objDriver.phone_number = req.body.phone_number
    objDriver.license_plate = req.body.license_plate
    objDriver.driver_license = req.body.driver_license
    objDriver.createdAt = new Date
    objDriver.updatedAt = new Date
    let rate = getrate(objDriver.car_type)
    objDriver.basic_rate = rate

    Driver.create(objDriver)
    .then(result=>{
      res.redirect("/driver/login")
    })
    .catch(err=>{
      res.send(err)
    })
  } else {
    res.send(`page not found`)
  }
})

///  ORDER LISTS ///
router.get("/:user/orders", (req,res)=>{
  if(req.session.isLogin == undefined || req.session.isLogin == "false"){
    res.redirect("${req.params.user}/login?status=please-log-in-first")
  } else {
    if(req.params.user == "customer"){

    } else if (req.params.user == "driver"){
      
    } else {
      res.redirect("/?status=page-not-found")
    }
  }
})

router.post("/:user/orders", (req,res)=>{
  
})


module.exports = router