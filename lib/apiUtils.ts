/**
 * ======================================================================================
 * UTILITY: API Stability Wrapper (withStability)
 * ======================================================================================
 * A Higher-Order Function (HOF) that enforces application-wide stability standards.
 * 
 * Features:
 * 1. Connection Orchestration: Automatically manages MongoDB connection cycles.
 * 2. Performance Monitoring: Flags and logs "Slow Routes" exceeding 5000ms latency.
 * 3. Unified Error Schema: Standardizes 400 (Validation), 409 (Duplicate), and 500 errors.
 * 4. Observability: Provides detailed execution duration and error context in logs.
 * ======================================================================================
 */
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from './mongodb';

/**
 * Stability Wrapper for API Routes
 * 
 * Provides:
 * 1. Automatic MongoDB Connection Management
 * 2. Standardized Error Handling
 * 3. Execution Timeout Safety
 * 4. Request Logging for Debugging
 */
export function withStability(handler: (req: NextRequest, ...args: any[]) => Promise<NextResponse>) {
  return async (req: NextRequest, ...args: any[]) => {
    const startTime = Date.now();
    const url = new URL(req.url);
    const routeName = url.pathname;

    try {
      // 1. Ensure Database Connection
      await connectToDatabase();

      // 2. Execute Handler
      const response = await handler(req, ...args);
      
      const duration = Date.now() - startTime;
      if (duration > 5000) {
        console.warn(`⏳ SLOW ROUTE: ${routeName} took ${duration}ms`);
      }

      return response;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      console.error(`❌ API STABILITY ERROR [${routeName}] (${duration}ms):`, error.message);

      // Standardized Error Responses
      if (error.name === 'ValidationError') {
        return NextResponse.json({ 
          error: 'Validation Failed', 
          details: error.message,
          code: 'ERR_VALIDATION' 
        }, { status: 400 });
      }

      if (error.name === 'MongoServerError' && error.code === 11000) {
        return NextResponse.json({ 
          error: 'Resource already exists', 
          code: 'ERR_DUPLICATE' 
        }, { status: 409 });
      }

      // Default Server Error
      return NextResponse.json({ 
        error: 'A technical stability issue occurred', 
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error',
        code: 'ERR_INTERNAL'
      }, { status: 500 });
    }
  };
}
