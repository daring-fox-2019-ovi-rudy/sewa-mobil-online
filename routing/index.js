let router = require('express').Router()
let Customer = require("./customer")
let Driver = require("./driver")
let Order = require("./order")

router.get("/", (req, res) => {
    res.render("home.ejs")
})
router.use("/", Customer)
router.use("/", Driver)

module.exports = router