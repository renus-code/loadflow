/**
 * Global MongoDB Connection Protocol
 * 
 * Ensures a single, heavily optimized database connection pool is used across 
 * all serverless Next.js API routes, preventing connection spikes and memory leaks.
 */
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of hanging
      socketTimeoutMS: 45000,
    };

    console.log('🔄 Initializing MongoDB Connection Protocol...');
    
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB Connection Established Successfully');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e: any) {
    cached.promise = null;
    console.error('❌ MONGODB CONNECTION ERROR:', e.message);
    
    if (e.code === 'ECONNREFUSED' && e.syscall === 'querySrv') {
      console.error('💡 DIAGNOSTIC: SRV DNS Resolution Refused.');
      console.error('   This usually means your network/VPN blocks SRV records.');
      console.error('   FIX: Use the "Standard Connection String" (mongodb://...) in .env');
    }
    
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
