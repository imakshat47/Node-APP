const path = require("path")

// To get express instance
const express = require('express')

// Mongoose
const mongoose = require('mongoose')

// To get evn instance
const dotenv = require('dotenv')

// Invoking Morgan 
const morgan = require('morgan')

// To invoke express handle bars
const exphbs = require('express-handlebars')

// Mehod Override
const methodOverride = require('method-override')

// Passport
const passport = require("passport")

// Express sessions
const session = require('express-session')

// Mongo Sesion
const MongoStore = require('connect-mongo')(session)

// To get Mongo DB instance    
const connectDB = require('./config/db')
const { CONNREFUSED } = require("dns")
const { Session } = require("inspector")
const { Mongoose } = require("mongoose")

// Load Config file
dotenv.config({ path: './config/config.env' })
    // Passport config
require('./config/passport')(passport)

// call connect db
connectDB()

// To call the express  & initialling app
const app = express()

// body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())


// Method Override
app.use(methodOverride(function(req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // to override method call
        let method = req.body._method
        delete req.body._method
        return method
    }
}))

// logging 
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}


// Handelbars helper
const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs')

// Handle bars
app.engine('.hbs', exphbs({
    helpers: { formatDate, stripTags, truncate, editIcon, select },
    defaultLayout: 'main',
    extname: '.hbs'
}));

app.set('view engine', '.hbs');


// Express session
app.use(session({
    secret: 'keybaord cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
        // cookie: { secure: true }
}))

// Passport middle ware
app.use(passport.initialize());
app.use(passport.session());


// Set global variables
app.use(function(req, res, next) {
    res.locals.user = req.user || null
    next()
})


// Static Folder
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));

// Setting PORT from config else 5000
const PORT = process.env.PORT || 5000

// To run the server
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))