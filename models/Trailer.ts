import mongoose, { Schema, Document } from "mongoose";

export interface ITrailer {
  trailerNo: string;
  vin: string;
  plate: string;
  year: number;
  make: string;
  model: string;
  trailerType: 'Dry Van' | 'Reefer' | 'Tri Axle' | 'Flatbed';
  createdAt: Date;
}

const TrailerSchema: Schema = new Schema({
  trailerNo: { type: String, required: true, unique: true },
  vin: { type: String, required: true, unique: true },
  plate: { type: String, required: true, unique: true },
  year: { type: Number, required: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  trailerType: { type: String, enum: ['Dry Van', 'Reefer', 'Tri Axle', 'Flatbed'], required: true },
  createdAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
  optimisticConcurrency: true,
});

export default mongoose.models.Trailer ||
  mongoose.model<ITrailer & Document>("Trailer", TrailerSchema);
