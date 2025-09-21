// models/User.ts
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  role: 'user' | 'admin';
  whatsappBusinessId?: string;
  phoneNumberId?: string;
  accessToken?: string;
  creditBalance: number;
  settings: {
    notifications: boolean;
    autoRecharge: boolean;
    defaultTags: string[];
  };
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  whatsappBusinessId: String,
  phoneNumberId: String,
  accessToken: String,
  creditBalance: {
    type: Number,
    default: 0,
    min: 0
  },
  settings: {
    notifications: {
      type: Boolean,
      default: true
    },
    autoRecharge: {
      type: Boolean,
      default: false
    },
    defaultTags: [String]
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};
delete mongoose.models.User;
const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default User;
