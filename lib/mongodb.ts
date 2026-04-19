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
    // Basic ping to verify connection health before returning
    try {
      if (mongoose.connection.readyState === 1) {
        return cached.conn;
      }
    } catch (err) {
      console.warn('⚠️ Cached MongoDB connection is stale, reconnecting...');
      cached.conn = null;
      cached.promise = null;
    }
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, 
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
      maxPoolSize: 10, // Optimize for serverless environments
      minPoolSize: 1,
      heartbeatFrequencyMS: 30000,
    };

    console.log('🔄 Initializing MongoDB Stability Protocol...');
    
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB Stability Protocol Established');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e: any) {
    cached.promise = null;
    console.error('❌ MONGODB CONNECTION ERROR:', e.message);
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
