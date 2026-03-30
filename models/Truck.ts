import mongoose, { Schema, Document } from 'mongoose';

export interface ITruck {
  truckNo: string;
  vin: string;
  plate: string;
  year: number;
  make: string;
  model: string;
  truckType: 'Sleeper Cab' | 'Day Cab';
  createdAt: Date;
}

const TruckSchema: Schema = new Schema({
  truckNo: { type: String, required: true, unique: true },
  vin: { type: String, required: true, unique: true },
  plate: { type: String, required: true, unique: true },
  year: { type: Number, required: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  truckType: { type: String, enum: ['Sleeper Cab', 'Day Cab'], required: true },
  createdAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
  optimisticConcurrency: true,
});

export default mongoose.models.Truck || mongoose.model<ITruck & Document>('Truck', TruckSchema);
