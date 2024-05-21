// backend/models/Appointment.js
import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
  notaireId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['en attente', 'confirmé', 'annulé'],
    default: 'en attente'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);