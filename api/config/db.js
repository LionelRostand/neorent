const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=${process.env.MONGO_AUTH_SOURCE}`;
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connecté');
  } catch (error) {
    console.error('❌ Erreur MongoDB :', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;