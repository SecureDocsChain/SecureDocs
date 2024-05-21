import express from 'express';
import Document from '../models/Document.js';
import connectToDatabase from '../utils/db.js';
import User from '../models/User.js'; 

const router = express.Router();

// Middleware pour établir la connexion à la base de données
router.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    console.log('Connected to database');
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database connection error' });
  }
});

// Soumettre un document
router.post('/', async (req, res) => {
  const { userId, name } = req.body; // Utilisez userId au lieu de userEmail
  try {
    // Vérifiez si l'utilisateur existe
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const document = new Document({ userId, name });
    await document.save();
    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Récupérer les documents d'un utilisateur
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params; // Utilisez userId au lieu de email
  try {
    // Vérifiez si l'utilisateur existe
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const documents = await Document.find({ userId });
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;