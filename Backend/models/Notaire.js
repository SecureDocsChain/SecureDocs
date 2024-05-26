// backend/models/Notaire.js
import mongoose from 'mongoose';

const NotaireSchema = new mongoose.Schema({
  wallet: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  kbisNumber: {
    type: String,
    required: true
  },
  professionalInfo: {
    type: String,
    required: true
  },
  kycStatus: {
    type: String,
    enum: ['en attente', 'validé', 'rejeté'],
    default: 'en attente'
  },
  documents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }],
  appointments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Notaire || mongoose.model('Notaire', NotaireSchema);