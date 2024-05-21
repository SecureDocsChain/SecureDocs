// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  wallet: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    unique: true,
    index: true
  },
  name: {
    type: String,
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

export default mongoose.models.User || mongoose.model('User', UserSchema);