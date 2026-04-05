import mongoose from 'mongoose';
import User from './models/User';
import dotenv from 'dotenv';

dotenv.config();

async function countDrivers() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) return;

  try {
    await mongoose.connect(MONGODB_URI);
    const count = await User.countDocuments({ role: 'Driver' });
    console.log(`Total Drivers: ${count}`);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

countDrivers();
