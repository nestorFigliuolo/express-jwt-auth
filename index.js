const path = require('path')
const express = require('express')
const app = express()
const cookieParser = require("cookie-parser");
const port = 3000
const jwt = require('jsonwebtoken')
const secret = 'asdkjalk12jlk2helmnlkje12l3'

function generateAccessToken(user) {
  return jwt.sign(user, secret, { 
    expiresIn: '36000s'
  });
}

function checkToken(req, res, next) {
  console.log(req.cookies)
  if(!req.cookies.auth) {
    res.redirect('/login')
  }
  var decoded = jwt.verify(req.cookies.auth, secret);
  console.log('decoded', decoded)
  if(decoded) {
    req.user = decoded.user
    req.lastLogin = new Date()
    next()
  } else {
    res.redirect('/login')
  }
}

app.use(express.json());
app.use(cookieParser())

app.get('/', checkToken, (req, res) => {
  console.log('/', req.user)
  res.send(`Hola ${req.user} - ultimo loggeo ${req.lastLogin.toISOString()}`)
})

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'))
})

app.post('/login', (req, res) => {
  console.log(req.body)
  if(req.body.user === 'validUser') {
    const token = generateAccessToken(req.body)
    res.cookie('auth', token, {
      httpOnly: true
    })
    res.status(200).send()
  } else {
    res.status(401).send()
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
