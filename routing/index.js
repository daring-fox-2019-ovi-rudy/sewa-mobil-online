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
  res.render("home.ejs", {
    log : req.session,
    user: theUser
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
    res.redirect("/")
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
            }
          } else {
            res.send("username not found")
          }
        })
      } else if(req.params.user == "customer") {
        let condition = {
          name : req.body.userName 
        }
        
        let myPlaintextPassword = req.body.password
        Customer.findOne({where:condition})
        .then(result=>{
          if(result) {
            let hash = result.password
            if(bcrypt.compareSync(myPlaintextPassword, hash) == true){
              req.session.isLogin = true
              req.session.userId = result.id
              req.session.userName = result.name
              req.session.loggedAs = 'customer'
              res.redirect("/")
            }
          } else {
            res.send("username not found")
          }
        })
      } 
    } else {
      res.send(`page not found`)
    }
  } else {
    res.redirect("/test")
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
    Customer.create({
      name : req.body.name,
      password : req.body.password,
      phone_number : req.body.phone_number,
      createdAt : new Date(),
      updatedAt : new Date()
    })
    .then(result => {
      res.redirect("/customer/login")
    })
    .catch(err=>{
      res.send(err)
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

module.exports = router