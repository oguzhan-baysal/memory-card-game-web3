const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Varsayılan MongoDB URI'si, .env dosyası yoksa kullanılacak
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cardmemorygame';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected to:', mongoURI);
  } catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
