const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = (url) => {
    return mongoose.connect(url)
    .then(() => console.log('MongoDBに接続しました'))
    .catch((err) => console.log(err)); 
};

module.exports = connectDB;
