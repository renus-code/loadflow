import mongoose, { Schema, Document } from 'mongoose';

export interface ILoad extends Document {
  loadNumber: string;
  
  // Pickup Information
  pickupAddress: string;
  pickupCity: string;
  pickupState: string;
  pickupPostalCode: string;
  pickupAppointmentNumber: string;
  pickupDate: Date;
  pickupTime: string;

  // Delivery Information
  deliveryAddress: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryPostalCode: string;
  deliveryAppointmentNumber: string;
  deliveryDate: Date;
  deliveryTime: string;

  // Logistics & Details
  quantity: number;
  quantityUnit: 'skids' | 'pallets' | 'packages' | 'pieces' | 'box' | 'cases';
  weight: number;
  weightUnit: 'lbs' | 'kg';
  
  status: 'Pending' | 'Assigned' | 'Transit' | 'In Transit' | 'Delivered';
  createdAt: Date;
}

const LoadSchema: Schema = new Schema({
  loadNumber: { type: String, required: true },
  
  // Pickup
  pickupAddress: { type: String, required: true },
  pickupCity: { type: String, required: true },
  pickupState: { type: String, required: true },
  pickupPostalCode: { type: String, required: true },
  pickupAppointmentNumber: { type: String, required: true },
  pickupDate: { type: Date, required: true },
  pickupTime: { type: String, required: true },

  // Delivery
  deliveryAddress: { type: String, required: true },
  deliveryCity: { type: String, required: true },
  deliveryState: { type: String, required: true },
  deliveryPostalCode: { type: String, required: true },
  deliveryAppointmentNumber: { type: String, required: true },
  deliveryDate: { type: Date, required: true },
  deliveryTime: { type: String, required: true },

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

  status: { 
    type: String, 
    required: true, 
    enum: ['Pending', 'Assigned', 'Transit', 'In Transit', 'Delivered'],
    default: 'Pending' 
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Load || mongoose.model<ILoad>('Load', LoadSchema);
