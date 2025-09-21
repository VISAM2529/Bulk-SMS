// models/Contact.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IContact extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  phoneNumber: string;
  groups: mongoose.Types.ObjectId[];
  tags: string[];
  isActive: boolean;
}

const contactSchema = new Schema<IContact>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  groups: [{
    type: Schema.Types.ObjectId,
    ref: 'ContactGroup'
  }],
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

contactSchema.index({ userId: 1, phoneNumber: 1 }, { unique: true });
contactSchema.index({ userId: 1, groups: 1 });

export default mongoose.model<IContact>('Contact', contactSchema);