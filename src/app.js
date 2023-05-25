require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');
const { env } = require('process');
const PORT = process.env.PORT || 3000;
const db = require('../src/database/database');
const flash = require('express-flash');

/*
    DATA BASE -----------------------------------------------------------
*/

db.then(() => {
    console.log('AUTH | The MongoDB is connected and secured | Powerd by MongoDB.');
})

/*
    EXPRESS AND AUTH -----------------------------------------------------------
*/

const data = require("../src/database/models/user_data");
const initializePassport = require('../src/auth/passport_config');
const passport = require("passport");
const cookieParser = require('cookie-parser');

initializePassport(
    passport,
    // email => data.findOne({ 'email': email }),
    email => NaN,
    uuid => NaN
);

app.use(flash());
app.use(session({
    secret: process.env.AUTH_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({extended: false}))
app.use(express.json());
app.use(cookieParser());

/*
    VIEW ENGINE -----------------------------------------------------------
*/

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend/views'))
app.use(express.static(path.join(__dirname, '../frontend/assets')));

/*
    ROUTES ----------------------------------------------------------------
*/

const homeRoute = require('./routes/home_route');
const authRoute = require('./routes/auth_route');
const cdnRoute = require('./routes/cdn_route');
const apiRoute = require('./routes/api_route');

app.use('/auth', authRoute);
app.use('/cdn', cdnRoute);
app.use('/api', apiRoute);
app.use('/home', homeRoute);
/* MIDDLEWARE ROUTES */
app.get('/', (req, res) => {
});
//app.use('/home', homeRoute);

app.listen(PORT, () => {
    console.log(`EXPRESS | Server is up and running on: ${PORT}`);
})

/*
    OTHER -----------------------------------------------------------------
*/