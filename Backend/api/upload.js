import connectToDatabase from '../utils/db.js';
import Document from '../models/Document.js';
import crypto from 'crypto';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await connectToDatabase();

    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).send('Error parsing the files');
        return;
      }

      const file = files.file;
      const fileContent = fs.readFileSync(file.filepath);
      const hash = crypto.createHash('sha256').update(fileContent).digest('hex');
      const userId = fields.userId; // Récupéré depuis le frontend
      const email = fields.email; // Récupéré depuis le frontend

      console.log('Received fields:', { userId, email }); // Log des champs reçus

      if (!email) {
        res.status(400).send('Email is required');
        return;
      }

      const document = new Document({
        userId,
        email, // Enregistrement de l'email
        fileName: file.originalFilename,
        fileData: fileContent,
        hash,
        status: 'en attente'
      });

      try {
        await document.save();
        res.status(200).send('Document uploaded and stored successfully');
      } catch (error) {
        console.error('Error saving the document:', error);
        res.status(500).send('Error saving the document');
      }
    });
  } else {
    res.status(405).send('Method not allowed');
  }
}
