// models/Campaign.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ICampaign extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  templateId?: mongoose.Types.ObjectId;
  message: string;
  mediaUrl?: string;
  contacts: string[];
  groups: mongoose.Types.ObjectId[];
  schedule?: Date;
  status: 'draft' | 'scheduled' | 'processing' | 'completed' | 'failed';
  creditsEstimated: number;
  creditsUsed: number;
  tags: string[];
  stats: {
    total: number;
    sent: number;
    delivered: number;
    read: number;
    failed: number;
    pending: number;
  };
}

const campaignSchema = new Schema<ICampaign>({
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
  templateId: {
    type: Schema.Types.ObjectId,
    ref: 'MessageTemplate'
  },
  message: {
    type: String,
    required: true
  },
  mediaUrl: String,
  contacts: [String],
  groups: [{
    type: Schema.Types.ObjectId,
    ref: 'ContactGroup'
  }],
  schedule: Date,
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'processing', 'completed', 'failed'],
    default: 'draft'
  },
  creditsEstimated: {
    type: Number,
    default: 0,
    min: 0
  },
  creditsUsed: {
    type: Number,
    default: 0,
    min: 0
  },
  tags: [String],
  stats: {
    total: { type: Number, default: 0 },
    sent: { type: Number, default: 0 },
    delivered: { type: Number, default: 0 },
    read: { type: Number, default: 0 },
    failed: { type: Number, default: 0 },
    pending: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

campaignSchema.index({ userId: 1, status: 1 });
campaignSchema.index({ schedule: 1 });
campaignSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<ICampaign>('Campaign', campaignSchema);