import connectToDatabase from '../Backend/utils/db.js';

async function testConnection() {
  try {
    await connectToDatabase();
    console.log("Connected to MongoDB successfully.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

testConnection();