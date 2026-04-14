import mongoose, { Schema, Document } from 'mongoose';

export interface IStop {
  companyName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  appointmentNumber: string;
  date: Date;
  time: string;
  status: 'PENDING' | 'PICKED_UP' | 'DELIVERED';
  lat?: number;
  lng?: number;
}

export interface ILoad extends Document {
  loadNumber: string;
  commodity: string; // Description of the load
  
  pickups: IStop[];
  deliveries: IStop[];

  // Logistics & Details
  quantity: number;
  quantityUnit: 'skids' | 'pallets' | 'packages' | 'pieces' | 'box' | 'cases';
  weight: number;
  weightUnit: 'lbs' | 'kg';
  
  totalDistance?: number;       // In miles (mock feature)
  estimatedDuration?: number;   // In hours (mock feature)
  
  truckType?: 'Sleeper Cab' | 'Day Cab' | null;
  trailerType?: 'Dry Van' | 'Reefer' | 'Tri Axle' | 'Flatbed' | null;
  trailerNumber?: string;
  truckNumber?: string;
  assignedDriverId?: mongoose.Types.ObjectId | null;
  createdBy: mongoose.Types.ObjectId;
  
  status: 'PENDING' | 'ASSIGNED' | 'IN_TRANSIT' | 'PICKED_UP' | 'DELIVERED' | 'CANCELLED' | 'COMPLETED';
  podUrl?: string;
  createdAt: Date;
  __v: number;
}

const StopSchema = new Schema({
  companyName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  appointmentNumber: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  lat: { type: Number, required: false },
  lng: { type: Number, required: false },
  status: { type: String, enum: ['PENDING', 'PICKED_UP', 'DELIVERED'], default: 'PENDING' },
}, { _id: false });

const LoadSchema: Schema = new Schema({
  loadNumber: { type: String, required: true, unique: true },
  commodity: { type: String, required: true },
  
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

  totalDistance: { type: Number, required: false },
  estimatedDuration: { type: Number, required: false },

  truckType: { type: String, enum: ['Sleeper Cab', 'Day Cab'], default: null },
  trailerType: { type: String, enum: ['Dry Van', 'Reefer', 'Tri Axle', 'Flatbed'], default: null },
  truckNumber: { type: String, default: null },
  trailerNumber: { type: String, default: null },
  assignedDriverId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },

  
  status: { 
    type: String, 
    required: true, 
    enum: ['PENDING', 'ASSIGNED', 'IN_TRANSIT', 'PICKED_UP', 'DELIVERED', 'CANCELLED', 'COMPLETED'],
    default: 'PENDING' 
  },
  podUrl: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
  optimisticConcurrency: true
});

if (mongoose.models.Load) {
  delete mongoose.models.Load;
}

export default mongoose.model<ILoad>('Load', LoadSchema);

