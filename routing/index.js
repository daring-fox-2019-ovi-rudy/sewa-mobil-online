let router = require('express').Router()
let Models = require('../models')
let Customer = Models.Customer

let Driver = Models.Driver
let Order = Models.Order 

let getrate = require('../helpers/basicrate')

const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


/// test routes ///
router.get("/test", (req,res)=>{
  Order.findAll({where: {order_date : "2019-04-23", status:0}})
  .then(orders=>{
    if(orders.length > 0){
      let ids = []
      console.log(orders)
      orders.forEach(order=>{
        ids.push(order.DriverId)
      })
      return ids  
    } else {
      Driver.findAll()
      .then(drivers=>{
        if(drivers){
          if(drivers.length > 0) {
            res.send(drivers)
          } else {
            res.redirect("/?status=no-driver-available")  
          }
        } else{
          res.redirect("/?status=no-driver-available")
        }
      })
      .catch(err=>{
        throw err
      })
    }
  })
  .then(ids =>{
    Driver.findAll({
      where : {
        id : {
          [Op.notIn] : ids
        }
      }
    })
    .then(drivers=>{
      if(drivers){
        if(drivers.length > 0) {
          res.send(drivers)
        } else {
          res.redirect("/?status=no-driver-available")  
        }
      } else{
        res.redirect("/?status=no-driver-available")
      }
    })
    .catch(err=>{
      throw err
    })
  })
  .catch(err=>{
    res.send(err)
  })
})

/// MAIN PAGE ///
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
            res.redirect("/driver/login?status=login-failed-:-password-does-not-match")
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
            res.redirect("/customer/login?status=login-failed-:-username-does-not-found")
          }
        })
      } 
    } else {
      res.redirect("/customer/login?status=login-failed-:-page-does-not-found")
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
      res.redirect("/customer/login?status=success-create-customer")
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
    objDriver.max_passenger = Driver.getMaxPassenger(req.body.car_type)
    // res.send(objDriver)
    Driver.create(objDriver)
    .then(result=>{
      res.redirect("/driver/login?status=success-create-driver")
    })
    .catch(err=>{
      res.send(err)
    })
  } else {
    res.send(`page not found`)
  }
})

// // HISTORY ORDER
router.get("/:user/orders", (req,res)=>{
  if(req.session.isLogin) {
    if(req.session.isLogin == true) {
      if(req.params.user == "customer"){
        let condition = { CustomerId : req.session.userId}
        Order.findAll({
          where : condition,
          include: [Driver],
          order: [['createdAt', 'DESC']]
        })
        .then(results=>{
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
          if(results){
            if(results.length > 0){
              res.render("historyCustomer.ejs", {
                datas : results,
                message : status,
                user : theUser,
                log : req.session
              })
            } else {
              res.redirect("/?status=no-data-found")  
            }
          } else {
            res.redirect("/?status=please-login-first")
          }
        })
      } else if(req.params.user == "driver"){
        // res.send("disini")
        let condition = { DriverId : req.session.userId}
        Order.findAll({
          where : condition,
          include: [Customer],
          order: [['createdAt', 'DESC']]
        })
        .then(results=>{
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
          if(results){
            if(results.length > 0){
              res.render("historyDriver.ejs", {
                datas : results,
                message : status,
                user : theUser,
                log : req.session
              })
            } else {
              res.redirect("/?status=no-data-found")  
            }
          } else {
            res.redirect("/?status=please-login-first")
          }
        })
      } else {
        res.send("page does not exists")
      }
    } else {
      res.redirect("/?status=please-login-first")
    }
  } else {
    res.redirect("/?status=please-login-first")
  }
})

// HANDLE UPDATE REJECT ORDER
router.get("/process/:updateId/accept", (req,res)=>{
  let orderId = req.params.updateId
  let objUpd = {status : 1}
  Order.update(objUpd, {where : {id : orderId}})
  .then(result=>{
    let hasil = ""
    if(result == 1) {
      hasil = "sukses"
    } else {
      hasil = "gagal"
    }
    res.redirect(`/driver/orders?status=${hasil}`)
  })
  .catch(err=>{
    res.send(err)
  })
})

router.get("/process/:updateId/reject", (req,res)=>{
  let objUpd = {status : 2}
  let orderId = req.params.updateId
  Order.update(objUpd, {where : {id : orderId}})
  .then(result=>{

  })
  .catch(err=>{
    res.send(err)
  })
})

// // CUSTOMER PLACE ORDER 1. PILIH TANGGAL PESAN
router.get("/customer/rent", (req,res) => {
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

  res.render("rentCustomer.ejs",{
    log : req.session,
    user : "customer",
    message : status
  })
})

// // CUSTOMER PLACE ORDER 2. PILIH DRIVER AVAILABLE
router.post("/customer/rent", (req, res) => {
  let od = req.body.order_date
  od = od.toString()
  let sekarang = new Date
  sekarang = sekarang.toISOString().split('T')[0]
  if(od < sekarang){
    res.redirect("/customer/rent?status=date-must-be-later-than-today")
  } else {
    Order.findAll({where: {order_date : od, status:0}})
  .then(orders=>{
    if(orders.length > 0){
      let ids = []
      orders.forEach(order=>{
        ids.push(order.DriverId)
      })
      return ids  
    } else {
      Driver.findAll()
      .then(drivers=>{
        if(drivers){
          if(drivers.length > 0) {
            // res.send(drivers)
            // res.send(req.session)
            res.render("chooseDriver.ejs", {
              log : req.session,
              order_date: od,
              user: "costumer",
              datas : drivers
            })
          } else {
            res.redirect("/?status=no-driver-available")  
          }
        } else{
          res.redirect("/?status=no-driver-available")
        }
      })
      .catch(err=>{
        throw err
      })
    }
  })
  .then(ids =>{
    Driver.findAll({
      where : {
        id : {
          [Op.notIn] : ids
        }
      }
    })
    .then(drivers=>{
      if(drivers){
        if(drivers.length > 0) {
          res.send(drivers)
        } else {
          res.redirect("/?status=no-driver-available")  
        }
      } else{
        res.redirect("/?status=no-driver-available")
      }
    })
    .catch(err=>{
      throw err
    })
  })
  .catch(err=>{
    res.send(err)
  })
  }
})

// // HANDLE CREATE NEW ORDER DARI CUSTOMER PLAXE ORDER
router.get("/neworder/:driverId/:customerId/:date", (req,res)=>{
  let id_driver = req.params.driverId
  let id_customer = req.params.customerId
  let the_date = req.params.date
  let obj ={
    order_date : the_date,
    CustomerId : id_customer,
    DriverId : id_driver,
    createdAt : new Date,
    updatedAt : new Date,
    status : 0
  }
  // obj = JSON.stringify(obj)
  // obj = JSON.parse(obj)
  Order.create(obj)
  .then(result=>{
    res.redirect(`/customer/orders`)
  })
  .catch(err=>{
    res.send(err)
  })
})

// // LOG OUT
router.get("/logout", (req,res)=>{
  req.session.destroy(err=>{
    if(err){
      res.redirect("/?status=err")
    } else {
      res.redirect("/")
    }
  })
})

router.get("/:user/", (req, res) => {
  if (req.params.user == "customer"){
    Customer.findOne({
      where : {
        id: req.session.userId
      }
    })
    .then( result => {
      res.render("accountCustomer.ejs",{
        res : result,
        log : req.session,
        user : req.params.user
      })
    })
    .catch(err => {
      res.send(err)
    })
  }else if (req.params.user == "driver"){
    Driver.findOne({
      where : {
        id: req.session.userId
      }
    })
    .then( result => {
      res.render("accountDriver.ejs",{
        res : result,
        log : req.session,
        user : req.params.user
      })
    })
    .catch(err => {
      res.send(err)
    })
  }else{
    res.send("data not found")
  }
})

router.get("/:user/del", (req, res) => {
  console.log(req.session.userId)
  if (req.params.user == "customer"){
    Customer.destroy({
      where : {
        id: req.session.userId
      }
    })
    .then( result => {
      req.session.destroy(err=>{
        if(err){
          res.redirect("/?status=err")
        } else {
          res.redirect("/")
        }
      })
    })
    .catch(err => {
      res.send(err)
    })
  }else if (req.params.user == "driver"){
    Driver.destroy({
      where : {
        id: req.session.userId
      }
    })
    .then( result => {
      req.session.destroy(err=>{
        if(err){
          res.redirect("/?status=err")
        } else {
          res.redirect("/")
        }
      })
    })
    .catch(err => {
      res.send(err)
    })
  }else{
    res.send("data not found")
  }
})


module.exports = router