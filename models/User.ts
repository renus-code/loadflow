import mongoose, { Schema, Document } from 'mongoose';

/**
 * ======================================================================================
 * MODEL: User
 * ======================================================================================
 * Represents a person in the LoadFlow system.
 * This model handles:
 * 1. Authentication: Password hashes, 2FA secrets, and login attempts.
 * 2. RBAC (Role-Based Access Control): Admin, Dispatcher, and Driver roles.
 * 3. Profile Data: Driver license, contact info, and registration status.
 * 4. Security: tokenVersion for global session revocation and account locking.
 * ======================================================================================
 */
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
  // SESSION REVOCATION: Incrementing this number instantly invalidates all existing 
  // JWT tokens for this user, forcing them to re-login.
  tokenVersion: number;              
  twoFactorSecret?: string;          // 2FA TOTP secret string (Base32)
  isTwoFactorEnabled: boolean;       // Status of 2FA enrollment
  // Tracking who invited this user (if it was a driver request)
  requestedBy?: mongoose.Types.ObjectId;
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
    requestedBy: { type: Schema.Types.ObjectId, ref: 'User', required: false },
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
