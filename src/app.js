require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');
const { env } = require('process');
const PORT = process.env.PORT || 3000;

/*
    VIEW ENGINE -----------------------------------------------------------
*/

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend/views'))
app.use(express.static(path.join(__dirname, '../frontend/assets')));

/*
    ROUTES ----------------------------------------------------------------
*/

//const homeRoute = require('./routes/home_route');

/* MIDDLEWARE ROUTES */
app.get('/', (req, res) => {
    res.render('home', {
        requser: req.user
    });
});
app.get('/api', (req, res) => {
    res.render('home', {
        requser: req.user
    });
});
//app.use('/home', homeRoute);

app.listen(PORT, () => {
    console.log(`EXPRESS | Server is up and running on: ${PORT}`);
})

/*
    OTHER -----------------------------------------------------------------
*/
