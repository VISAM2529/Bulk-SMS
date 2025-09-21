// models/WebhookEvent.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IWebhookEvent extends Document {
  type: 'message' | 'status' | 'template';
  payload: any;
  processed: boolean;
}

const webhookEventSchema = new Schema<IWebhookEvent>({
  type: {
    type: String,
    enum: ['message', 'status', 'template'],
    required: true
  },
  payload: {
    type: Schema.Types.Mixed,
    required: true
  },
  processed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

webhookEventSchema.index({ processed: 1, createdAt: 1 });

export default mongoose.model<IWebhookEvent>('WebhookEvent', webhookEventSchema);