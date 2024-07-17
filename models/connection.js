const mongoose = require('mongoose')

const connectMongoDB = (url) => {
    mongoose.connect(url)
    .then(() => console.log('MongoDB connected'))
    .catch((e) => console.log('Connection not established'));
}

module.exports = {connectMongoDB};