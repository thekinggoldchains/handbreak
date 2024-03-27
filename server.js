/* eslint-disable multiline-comment-style */
const express = require('express')
const next = require('next')
const mongoose = require('mongoose')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const session = require('cookie-session')
const bodyParser = require('body-parser')
const socketIo = require('socket.io')
const http = require('http')
const url = require('url')
const path = require('path')

const Keys = require('./keys')

const dev = Keys.ENVIRON !== 'PROD' && Keys.ENVIRON !== 'HEROKU'
const app = next({dev})
const routes = require('./routes')
const handle = routes.getRequestHandler(app)

const apiRoutes = require('./api/routes')
const User = require('./api/models/User')

app
  .prepare()
  .then((req, res, next) => {
    const server = express()
    
    // Middleware to force redirect from http to https
    const secure = (req, res, next) => {
      if (req.secure || dev) {
        // request was via https, so do no special handling
        next()
      } else {
        // request was via http, so redirect to https
        res.redirect('https://' + req.headers.host + req.url)
      }
    }
    // console.log("Chegou aqui!")

    http.createServer((req, res) => {
      const parseUrl = url.parse(req.url, true);
      const {pathName} = parseUrl;

    })
    // Allows for cross origin domain request:
    server.use(function (req, res, next) {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Origin', 'https://s3-dc2.mspclouds.com/')
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
      next()
    })

    // MongoDB
    mongoose.Promise = Promise
    mongoose.connect(
      Keys.MONGODB_URI,
      {useNewUrlParser: true, useUnifiedTopology: true}
    )
    const db = mongoose.connection
    db.on('error', console.error.bind(console, 'connection error:'))

    // Parse application/x-www-form-urlencoded
    server.use(bodyParser.urlencoded({extended: false}))
    // Parse application/json
    server.use(bodyParser.json())
    server.use(bodyParser.urlencoded({extended: true}))
    // Parse cookies
    server.use(cookieParser())
    // Sessions
    server.use(
      session({
        secret: Keys.SESSION_SECRET,
        resave: true,
        saveUninitialized: false
      })
    )

    // Passport
    passport.use(User.createStrategy())
    passport.serializeUser(User.serializeUser())
    passport.deserializeUser(User.deserializeUser())
    server.use(passport.initialize())
    server.use(passport.session())

    let io
    server.use(function (req, res, next) {
      res.io = io
      next()
    })

    // Logger
    if (process.env.NODE_ENV === 'DEV') {
      server.use((req, res, next) => {
        const now = new Date()
        const log = {
          path: req.path,
          body: req.body,
          method: req.method,
          query: req.query,
          timestamp: now.getTime(),
          datetimeIsoString: now.toISOString()
        }
        console.log(JSON.stringify(log))
        console.log()
        next()
      })
    }

    // API routes
    server.use('/api/v1', apiRoutes)

    // Static routes
    server.use('/uploads', express.static('uploads'))
    server.use('/_next/server/middleware-build-manifest.js', express.static(path.join(__dirname, '.next', '/server/middleware-build-manifest.js')))
    server.use('/_next/server/middleware-react-loadable-manifest.js', express.static(path.join(__dirname, '.next', '/server/middleware-react-loadable-manifest.js')))

    // Next.js routes
    server.get('*', (req, res) => {
      return handle(req, res)
    })

    const finalServer = server.listen(Keys.PORT, err => {
      if (err) throw err
      // eslint-disable-next-line
      console.log('> Ready on https://localhost:' + Keys.PORT)
      const filePath = path.join(__dirname, '.next', '/server/middleware-build-manifest.js');
    })

    // Socket.io
    io = socketIo.listen(finalServer)
  })
  .catch(ex => {
    // eslint-disable-next-line
    console.error(ex.stack)
    process.exit(1)
  })
