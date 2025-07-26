import mongoose, { Schema, Document, models } from 'mongoose';

export interface ILead extends Document {
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  source?: string;
  status: 'New' | 'Contacted' | 'In Progress' | 'Won' | 'Lost';
  notes?: string;
  createdBy: mongoose.Schema.Types.ObjectId;
}

const LeadSchema: Schema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  company: { type: String },
  source: { type: String },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'In Progress', 'Won', 'Lost'],
    default: 'New',
    required: true,
  },
  notes: { type: String }, // Admin notes
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

export default models.Lead || mongoose.model<ILead>('Lead', LeadSchema);