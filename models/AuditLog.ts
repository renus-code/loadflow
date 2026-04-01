import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  userId: mongoose.Types.ObjectId;   // The user who performed the action
  action: string;                    // e.g., 'LOAD_CREATED', 'USER_DELETED', 'LOGIN'
  entityType: string;                // e.g., 'Load', 'User', 'Truck', 'Auth'
  entityId?: mongoose.Types.ObjectId;// The ID of the item affected (if applicable)
  details?: Record<string, any>;     // JSON snapshot of what changed, or metadata
  ipAddress?: string;                // The IP address of the user
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: { type: Schema.Types.ObjectId, required: false },
    details: { type: Schema.Types.Mixed, required: false }, // Mixed accepts any JSON object
    ipAddress: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: false,
  }
);

// Indexes for fast searching in the Admin dashboard
AuditLogSchema.index({ userId: 1, createdAt: -1 });
AuditLogSchema.index({ entityType: 1, entityId: 1 });
AuditLogSchema.index({ action: 1 });

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.AuditLog;
}

export default mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
