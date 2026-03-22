import mongoose, { Schema, Document } from 'mongoose';

export interface IStop {
  address: string;
  city: string;
  state: string;
  postalCode: string;
  appointmentNumber: string;
  date: Date;
  time: string;
  status: 'PENDING' | 'PICKED_UP' | 'DELIVERED';
}

export interface ILoad extends Document {
  loadNumber: string;
  
  pickups: IStop[];
  deliveries: IStop[];

  // Logistics & Details
  quantity: number;
  quantityUnit: 'skids' | 'pallets' | 'packages' | 'pieces' | 'box' | 'cases';
  weight: number;
  weightUnit: 'lbs' | 'kg';
  
  trailerNumber?: string;
  truckNumber?: string;
  assignedDriverId?: mongoose.Types.ObjectId | null;
  createdBy: mongoose.Types.ObjectId;
  
  status: 'PENDING' | 'IN_TRANSIT' | 'PICKED_UP' | 'DELIVERED' | 'CANCELLED' | 'COMPLETED';
  createdAt: Date;
}

const StopSchema = new Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  appointmentNumber: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'PICKED_UP', 'DELIVERED'], default: 'PENDING' },
}, { _id: false });

const LoadSchema: Schema = new Schema({
  loadNumber: { type: String, required: true },
  
  pickups: { type: [StopSchema], required: true, validate: [(v: IStop[]) => v.length > 0, 'At least one pickup is required'] },
  deliveries: { type: [StopSchema], required: true, validate: [(v: IStop[]) => v.length > 0, 'At least one delivery is required'] },

  // Logistics
  quantity: { type: Number, required: true },
  quantityUnit: { 
    type: String, 
    required: true, 
    enum: ['skids', 'pallets', 'packages', 'pieces', 'box', 'cases'] 
  },
  weight: { type: Number, required: true },
  weightUnit: { 
    type: String, 
    required: true, 
    enum: ['lbs', 'kg'] 
  },

  truckNumber: { type: String, default: null },
  trailerNumber: { type: String, default: null },
  assignedDriverId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  
  status: { 
    type: String, 
    required: true, 
    enum: ['PENDING', 'IN_TRANSIT', 'PICKED_UP', 'DELIVERED', 'CANCELLED', 'COMPLETED'],
    default: 'PENDING' 
  },
  createdAt: { type: Date, default: Date.now },
});

if (mongoose.models.Load) {
  delete mongoose.models.Load;
}

export default mongoose.model<ILoad>('Load', LoadSchema);

