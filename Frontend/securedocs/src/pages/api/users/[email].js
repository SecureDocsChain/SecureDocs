// pages/api/users/[email].js
import connectToDatabase from '../../../../../../Backend/utils/db.js';
import User from '../../../../../../Backend/models/User.js';

export default async function handler(req, res) {
  await connectToDatabase();
  const { email } = req.query;

  if (req.method === 'GET') {
    try {
      console.log("Connected to database in getUser");

      console.log(`Fetching user with email: ${email}`);
      const users = await User.find({ email }).lean();
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
  } else if (req.method === 'PUT') {
    try {
      const updates = req.body;
      console.log(`Updating user with email: ${email}`, updates);

      const updatedUser = await User.findOneAndUpdate({ email }, updates, { new: true });
      if (!updatedUser) {
        console.log("User not found for update:", email);
        return res.status(404).json({ message: 'User not found' });
      }

      console.log("User updated:", updatedUser);
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: 'Error updating user', details: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}