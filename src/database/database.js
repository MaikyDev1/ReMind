const mongoose = require('mongoose');

module.exports = mongoose.connect('mongodb+srv://weblicense.i3ro7ix.mongodb.net/ReMindDatabase',
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });