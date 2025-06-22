const mongoose = require('mongoose')
const URI = 'mongodb+srv://car-rental:0ZDfICRoG2lM1joz@car-rental.hfeecep.mongodb.net'
mongoose.set("strictQuery", false);
const connectToMongo = () => mongoose.connect(URI, () => {
    console.log("Connected to Mongo Successfully")
})

module.exports = connectToMongo


// const connectToMongoose = async () => {
//   try {
//     await mongoose.connect(mongoURI);
//     console.log('Connected to Mongoose successfully');
//   } catch (error) {
//     console.error('Error connecting to Mongoose:', error.message);
//   }
// };

// module.exports = connectToMongoose;
