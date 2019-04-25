let router = require('express').Router()
let Customer = require("./customer")
let Driver = require("./driver")
let Order = require("./order")

router.get("/", (req, res) => {
    res.render("home.ejs")
})

router.get("/login",(req,res) => {
    res.render("login_page.ejs")
})
router.use("/", Customer)
router.use("/", Driver)
router.use("/", Order)

module.exports = router