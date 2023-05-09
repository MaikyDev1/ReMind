const mongoose = require('mongoose');

module.exports = mongoose.connect('mongodb+srv://MaikyDev:Maiky1234@weblicense.i3ro7ix.mongodb.net/?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true });