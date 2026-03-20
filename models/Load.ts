import mongoose, { Schema, Document } from 'mongoose';

export interface ILoad extends Document {
  pickupLocation: string;
  deliveryLocation: string;
  trailerNumber: string;
  truckNumber: string;
  pickupAppointmentNumber: string;
  pickupTime: string;
  deliveryTime: string;
  deliveryAppointmentTime: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  appointmentTime: Date;
  weight: number;
  quantity: number;
  status: 'Pending' | 'Assigned' | 'Transit' | 'Delivered';
  assignedDriverId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const LoadSchema = new Schema<ILoad>(
  {
    pickupLocation: { type: String, required: true },
    deliveryLocation: { type: String, required: true },
    trailerNumber: { type: String, required: true },
    truckNumber: { type: String, required: true },
    pickupAppointmentNumber: { type: String },
    pickupTime: { type: String },
    deliveryTime: { type: String },
    deliveryAppointmentTime: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    appointmentTime: { type: Date, required: true },
    weight: { type: Number, required: true },
    quantity: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['Pending', 'Assigned', 'In Transit', 'Delivered'], 
      default: 'Pending' 
    },
    assignedDriverId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User' 
    },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Load || mongoose.model<ILoad>('Load', LoadSchema);
