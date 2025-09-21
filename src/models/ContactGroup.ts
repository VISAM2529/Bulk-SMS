// models/ContactGroup.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IContactGroup extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  color: string;
  contactIds: mongoose.Types.ObjectId[];
}

const contactGroupSchema = new Schema<IContactGroup>({
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
  description: String,
  color: {
    type: String,
    default: 'indigo'
  },
  contactIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Contact'
  }]
}, {
  timestamps: true
});

contactGroupSchema.index({ userId: 1, name: 1 }, { unique: true });

export default mongoose.model<IContactGroup>('ContactGroup', contactGroupSchema);