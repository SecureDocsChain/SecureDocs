// pages/api/users/[email].js
import connectToDatabase from '../../../../../../Backend/utils/db.js';
import User from '../../../../../../Backend/models/User.js';

export default async function handler(req, res) {
    if (req.method === 'GET') {
      try {
        await connectToDatabase();
        console.log("Connected to database in getUser");
  
        const { email } = req.query;
  
        console.log(`Fetching user with email: ${email}`);
        const users = await User.find({ email }).lean(); // Utilisation de find() et lean()
        if (users.length === 0) {
          console.log("User not found:", email);
          return res.status(404).json({ message: 'User not found' });
        }
  
        console.log("User found:", users[0]);
        res.status(200).json(users[0]);
      } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: 'Error fetching user', details: error.message });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }