let router = require('express').Router()
let Customer = require("./customer")
let Driver = require("./driver")
let Order = require("./order")

router.use("/", Customer)
router.use("/", Driver)

module.exports = router