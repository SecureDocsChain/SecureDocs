// api/users.js
import express from 'express';
import User from '../models/User.js';
import connectToDatabase from '../utils/db.js';

const router = express.Router();

router.get('/:email', async (req, res) => {
  await connectToDatabase();

  const { email } = req.params;

  const user = await User.findOne({ email }).lean();
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json(user);
});

export default router;