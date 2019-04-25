let router = require('express').Router()
let Models = require('../models')
let Customer = Models.Customer
let Driver = Models.Driver 

router.get("/test", (req,res)=>{
  res.render("registerCustomer.ejs")
})

// router.get("/", (req,res)=>{
//   if(req.session.isLogin == undefined){   
//     req.session.isLogin = false;
//   } 
//   res.render("home.ejs", {
//     log : req.session
//   })
// })

// // router.post("/", (req,res)=>{
// //   if(req.session.isLogin == true){   
// //     req.session.isLogin = false;
// //   } else if(req.session.isLogin == false){   
// //     req.session.isLogin = true;
// //   } 
// //   res.redirect("/")
// // })


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

router.post("/:user/signup", (req,res)=>{
  let theUser = req.params.user
  res.send(req.params.user)
})

module.exports = router