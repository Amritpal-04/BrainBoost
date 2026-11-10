const mongoose = require('mongoose');

const Mongo_url = process.env.MONGO_CONN;

mongoose.connect(Mongo_url)
    .then(() => {
         console.log('MongoDB connected successfully');
    }).catch((err) => {
        console.log('MongoDB connection error:', err);
    })