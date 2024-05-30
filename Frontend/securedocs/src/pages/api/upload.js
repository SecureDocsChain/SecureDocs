import { IncomingForm } from "formidable";
import fs from "fs";
import crypto from "crypto";
import connectToDatabase from "../../../../../Backend/utils/db.js";
import Document from "../../../../../Backend/models/Document.js";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    await connectToDatabase();

    const form = new IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing the files:", err);
        res.status(500).send("Error parsing the files");
        return;
      }

      console.log(files);

      if (!files.file || files.file.length === 0) {
        res.status(400).send("No file uploaded");
        return;
      }

      const file = files.file[0]; // Access the first file in the array

      const filePath = file.filepath;
      if (!filePath) {
        res.status(400).send("File path is undefined");
        return;
      }

      try {
        const fileContent = fs.readFileSync(filePath);
        const hash = crypto
          .createHash("sha256")
          .update(fileContent)
          .digest("hex");
        let email = fields.email;
        let userId = fields.userId;

        if (Array.isArray(email)) {
          email = email[0]; // Prend le premier élément si c'est un tableau
        }

        if (Array.isArray(userId)) {
          userId = userId[0]; // Prend le premier élément si c'est un tableau
        }
        userId = userId.toString(); // S'assure que c'est une chaîne de caractères
        console.log(`userId: ${userId}`);

        const document = new Document({
          userId,
          email,
          fileName: file.originalFilename,
          fileData: fileContent,
          hash,
          status: "en attente",
          verifiedBy: "",
          tokenId: 0,
        });

        await document.save();

        res.status(200).send("Document uploaded and stored successfully");
      } catch (error) {
        console.error("Error saving the document:", error);
        res.status(500).send("Error saving the document");
      }
    });
  } else {
    res.status(405).send("Method not allowed");
  }
}
