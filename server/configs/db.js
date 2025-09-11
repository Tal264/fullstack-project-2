const mongoose = require('mongoose');

const connectDB = () => {
  mongoose
    .connect('mongodb://localhost:27017/FinalProjectDB')
    .then(() => console.log('Connected to FinalProjectDB'))
    .catch((error) => console.log(error));
};

module.exports = connectDB;
