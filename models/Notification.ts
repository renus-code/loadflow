/**
 * ======================================================================================
 * MODEL: Notification (User Engagement)
 * ======================================================================================
 * Manages the asynchronous messaging pipeline for the LoadFlow ecosystem.
 * 
 * Features:
 * 1. Targeted Delivery: Supports global (role-based) or specific (user-based) alerts.
 * 2. Visual Semantics: Categorizes messages into priority types (INFO, DANGER, etc.).
 * 3. Deep Linking: Orchestrates contextual navigation via optional action URLs.
 * 4. Lifecycle Management: Tracks read/unread states with automated timestamps.
 * ======================================================================================
 */
import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  message: string;
  type: 'INFO' | 'WARNING' | 'DANGER' | 'SUCCESS';
  targetRole: string;
  userId?: mongoose.Types.ObjectId;
  link?: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    message: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['INFO', 'WARNING', 'DANGER', 'SUCCESS'], 
      default: 'INFO' 
    },
    targetRole: { type: String, required: false },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    link: { type: String, required: false },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
