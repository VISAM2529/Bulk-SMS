// models/CreditTransaction.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ICreditTransaction extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'purchase' | 'usage' | 'refund';
  amount: number;
  description: string;
  campaignId?: mongoose.Types.ObjectId;
  messageId?: mongoose.Types.ObjectId;
}

const creditTransactionSchema = new Schema<ICreditTransaction>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['purchase', 'usage', 'refund'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  campaignId: {
    type: Schema.Types.ObjectId,
    ref: 'Campaign'
  },
  messageId: {
    type: Schema.Types.ObjectId,
    ref: 'Message'
  }
}, {
  timestamps: true
});

creditTransactionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<ICreditTransaction>('CreditTransaction', creditTransactionSchema);