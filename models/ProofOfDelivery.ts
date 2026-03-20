import mongoose, { Schema, Document } from 'mongoose';

export interface IProofOfDelivery extends Document {
  loadId: mongoose.Types.ObjectId;
  imageUrl: string;
  uploadedAt: Date;
}

const ProofOfDeliverySchema = new Schema<IProofOfDelivery>(
  {
    loadId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Load', 
      required: true 
    },
    imageUrl: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ProofOfDelivery || mongoose.model<IProofOfDelivery>('ProofOfDelivery', ProofOfDeliverySchema);
