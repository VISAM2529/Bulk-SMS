import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  // campaignId: mongoose.Types.ObjectId;
  // userId: mongoose.Types.ObjectId;
  to: string;
  type: 'text' | 'image' | 'document' | 'template';
  content: {
    text?: string;
    mediaUrl?: string;
    template?: {
      name: string;
      language: string;
      components: any[];
    };
  };
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  messageId?: string;
  errorCode?: number;
  errorMessage?: string;
  cost: number;
  timestamp: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    // campaignId: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'Campaign',
    //   required: true
    // },
    // userId: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'User',
    //   required: true
    // },
    to: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['text', 'image', 'document', 'template'],
      required: true
    },
    content: {
      text: String,
      mediaUrl: String,
      template: {
        name: String,
        language: String,
        components: [Schema.Types.Mixed]
      }
    },
    status: {
      type: String,
      enum: ['pending', 'sent', 'delivered', 'read', 'failed'],
      default: 'pending'
    },
    messageId: String,
    errorCode: Number,
    errorMessage: String,
    cost: {
      type: Number,
      default: 1,
      min: 0
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

messageSchema.index({ campaignId: 1, status: 1 });
messageSchema.index({ messageId: 1 });
messageSchema.index({ to: 1 });
messageSchema.index({ timestamp: 1 });
delete mongoose.models.Message;
const Message =
  mongoose.models.Message || mongoose.model<IMessage>('Message', messageSchema);

export default Message;
