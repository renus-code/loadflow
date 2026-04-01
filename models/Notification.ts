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
