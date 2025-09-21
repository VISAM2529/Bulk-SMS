// models/MessageTemplate.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ITemplateButton {
  type: 'QUICK_REPLY' | 'URL';
  text: string;
  url?: string;
}

export interface ITemplateComponent {
  type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS';
  text: string;
  buttons?: ITemplateButton[];
}

export interface IMessageTemplate extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
  components: ITemplateComponent[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  language: string;
  metaBusinessId: string;
}

const templateButtonSchema = new Schema<ITemplateButton>({
  type: {
    type: String,
    enum: ['QUICK_REPLY', 'URL'],
    required: true
  },
  text: {
    type: String,
    required: true
  },
  url: String
});

const templateComponentSchema = new Schema<ITemplateComponent>({
  type: {
    type: String,
    enum: ['HEADER', 'BODY', 'FOOTER', 'BUTTONS'],
    required: true
  },
  text: {
    type: String,
    required: true
  },
  buttons: [templateButtonSchema]
});

const messageTemplateSchema = new Schema<IMessageTemplate>({
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
  category: {
    type: String,
    enum: ['MARKETING', 'UTILITY', 'AUTHENTICATION'],
    required: true
  },
  components: [templateComponentSchema],
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING'
  },
  language: {
    type: String,
    default: 'en_US'
  },
  metaBusinessId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

messageTemplateSchema.index({ userId: 1, name: 1 }, { unique: true });

export default mongoose.model<IMessageTemplate>('MessageTemplate', messageTemplateSchema);