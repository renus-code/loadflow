import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  role: 'Admin' | 'Dispatcher' | 'Driver';
  isPending?: boolean;
  phone?: string;
  licenseNumber?: string;
  dob?: Date;
  city?: string;
  province?: string;
  postalCode?: string;
  address?: string; // Kept for backward compatibility/full string
  resetPasswordRequested?: boolean;
  resetPasswordApproved?: boolean;
  loginAttempts?: number;
  isLocked?: boolean;
  lockedUntil?: Date | null;
  tokenVersion: number;              // Session Revocation: Increment this to instantly invalidate all JWTs for this user
  twoFactorSecret?: string;          // 2FA TOTP secret string
  isTwoFactorEnabled: boolean;       // Whether the user has setup 2FA
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: false, default: null },
    role: { 
      type: String, 
      enum: ['Admin', 'Dispatcher', 'Driver'], 
      default: 'Driver' 
    },
    isPending: { type: Boolean, default: false },
    phone: { type: String, required: false },
    licenseNumber: { type: String, required: false },
    dob: { type: Date, required: false },
    city: { type: String, required: false },
    province: { type: String, required: false },
    postalCode: { type: String, required: false },
    address: { type: String, required: false },
    resetPasswordRequested: { type: Boolean, default: false },
    resetPasswordApproved: { type: Boolean, default: false },
    loginAttempts: { type: Number, default: 0 },
    isLocked: { type: Boolean, default: false },
    lockedUntil: { type: Date, default: null },
    tokenVersion: { type: Number, default: 0 },
    twoFactorSecret: { type: String, required: false },
    isTwoFactorEnabled: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
  }
);

// Force refresh model in development to pick up schema changes
if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.User;
}

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
