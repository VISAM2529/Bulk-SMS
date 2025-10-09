import mongoose, { Document, Schema } from 'mongoose';

export interface ICampaignMessageInsight extends Document {
  campaignId: mongoose.Types.ObjectId | string;
  contact: string; // phone number
  status: 'queued' | 'sent' | 'delivered' | 'failed';
  error?: string;
  messageSid?: string;
  sentAt: Date;
  response?: any;
}

const campaignMessageInsightSchema = new Schema<ICampaignMessageInsight>({
  campaignId: { type: Schema.Types.Mixed, required: false, index: true },
  contact: { type: String, required: true },
  status: { type: String, enum: ['queued', 'sent', 'delivered', 'failed'], required: true },
  error: { type: String },
  messageSid: { type: String },
  sentAt: { type: Date, default: Date.now },
  response: { type: Schema.Types.Mixed },
}, {
  timestamps: true
});

export default mongoose.models.CampaignMessageInsight || mongoose.model<ICampaignMessageInsight>('CampaignMessageInsight', campaignMessageInsightSchema);
