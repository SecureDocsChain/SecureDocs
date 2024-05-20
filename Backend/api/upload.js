// backend/api/upload.js
import connectToDatabase from '../utils/db';
import Document from '../models/Document';
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
      const fileContent = fs.readFileSync(file.path);
      const hash = crypto.createHash('sha256').update(fileContent).digest('hex');
      const userId = fields.userId; // Récupéré depuis le frontend

      const document = new Document({
        userId,
        fileName: file.name,
        fileData: fileContent,
        hash,
        status: 'en attente'
      });

      await document.save();

      res.status(200).send('Document uploaded and stored successfully');
    });
  } else {
    res.status(405).send('Method not allowed');
  }
}
