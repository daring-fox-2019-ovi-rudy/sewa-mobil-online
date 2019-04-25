const express = require('express')
const app = express()
const port = 3000

const cookieParser = require('cookie-parser');
const session = require('express-session')

const router = require('./routing/index')

app.use(cookieParser());
app.use(session({secret: '343ji43j4n3jn4jk3n'}))

app.use(express.urlencoded({
  extended : false
}))

app.use("/", router)

app.listen(port, ()=>{
  console.log("listening on port", port)
})