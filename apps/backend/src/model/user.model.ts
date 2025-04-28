import mongoose, { Document, Schema, Model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { logger } from '../utils/logger.util';

interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

// Password hashing middleware
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    logger.error('Password hashing error:', error);
    next(error as Error);
  }
});

// Password comparison method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Indexes
userSchema.index({ createdAt: 1 });
userSchema.index({ updatedAt: 1 });
userSchema.index({ name: 1 });
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 })

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;