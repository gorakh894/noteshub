const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('⚠️  Server will continue running but database operations will fail');
    console.error('💡 Troubleshooting:');
    console.error('   1. Check your internet connection');
    console.error('   2. Verify MongoDB Atlas IP whitelist (add 0.0.0.0/0 for testing)');
    console.error('   3. Check if your network blocks MongoDB ports');
    console.error('   4. Try installing MongoDB locally and update .env to: mongodb://localhost:27017/enginotes');
    // Don't exit - let server run without DB for testing API routes
  }
};

module.exports = connectDB;
