import connectToDatabase from '../../../../../../../Backend/utils/db.js';
import Document from '../../../../../../../Backend/models/Document.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    await connectToDatabase();

    const { email } = req.query;
    console.log("Email received:", email); // Log pour vérifier que l'email est reçu

    try {
      const documents = await Document.find({ email }).lean();
      if (documents.length === 0) {
        console.log("No documents found for user:", email);
        return res.status(200).json([]); // Renvoie un tableau vide au lieu d'une erreur 404
      }

      console.log("Documents found:", documents);
      res.status(200).json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ error: 'Error fetching documents', details: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}