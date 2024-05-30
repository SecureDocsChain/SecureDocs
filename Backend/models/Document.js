// backend/models/Document.js
import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileData: {
    type: Buffer,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["en attente", "validé", "rejeté"],
    default: "en attente",
  },
  verifiedBy: {
    type: String,
  },
  tokenId: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Document ||
  mongoose.model("Document", DocumentSchema);
