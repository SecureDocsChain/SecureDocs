// backend/utils/db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;


const connectToDatabase = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000, // 30 secondes de délai d'attente pour la sélection du serveur
        socketTimeoutMS: 45000, // 45 secondes de délai d'attente pour les sockets
      });
      console.log('MongoDB connected');
    } else {
      console.log('MongoDB already connected');
    }
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
};
export default connectToDatabase;