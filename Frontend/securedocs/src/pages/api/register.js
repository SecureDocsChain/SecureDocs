import connectToDatabase from '../../../../../Backend/utils/db.js';
import User from '../../../../../Backend/models/User.js';

export default async function handler(req, res) {
    if (req.method === 'POST') {
      try {
        await connectToDatabase();
        console.log("Connected to database in register");
  
        const { wallet, email } = req.body;
        console.log(`Received data - Wallet: ${wallet}, Email: ${email}`);
  
        if (!wallet || !email ) {
          console.log("Wallet, email or name not provided");
          return res.status(400).json({ error: 'Wallet, email, and name are required' });
        }
  
        console.log(`Checking if user with email ${email} exists`);
        const existingUsers = await User.find({ email }).maxTimeMS(20000); // Augmentez le délai d'attente pour cette opération
        if (existingUsers.length > 0) {
          console.log("User already exists:", existingUsers[0]);
          return res.status(200).json({ message: 'User already exists', user: existingUsers[0] });
        }
  
        const user = new User({ wallet, email });
  
        await user.save();
        console.log("User registered successfully:", user);
  
        res.status(201).json({ message: 'User registered successfully', user });
      } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: 'Error registering user', details: error.message });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }