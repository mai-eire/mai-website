import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { isSupabaseConfigured } from '../../lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log('Testing database connection...');
    console.log('Database URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
    console.log('Supabase configured:', isSupabaseConfigured() ? 'Yes' : 'No');
    
    // Log connection details (without sensitive information)
    const url = process.env.DATABASE_URL || '';
    if (url) {
      const urlObj = new URL(url);
      console.log('Connection details:', {
        host: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname,
        hasUsername: !!urlObj.username,
        hasPassword: !!urlObj.password,
      });
    }
    
    // Create a new Prisma client for testing
    const prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
    });
    
    // Try to connect to the database
    console.log('Attempting to connect to the database...');
    await prisma.$connect();
    console.log('Connected to the database');
    
    // Try a simple query
    console.log('Executing test query...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('Test query executed successfully');
    
    // Disconnect from the database
    await prisma.$disconnect();
    console.log('Disconnected from the database');
    
    return res.status(200).json({ 
      success: true, 
      message: 'Database connection successful',
      result,
      connectionUrl: process.env.DATABASE_URL ? 'Set (hidden)' : 'Not set',
      supabaseConfigured: isSupabaseConfigured(),
      connectionDetails: url ? {
        host: new URL(url).hostname,
        port: new URL(url).port,
        path: new URL(url).pathname,
        hasUsername: !!new URL(url).username,
        hasPassword: !!new URL(url).password,
      } : null
    });
  } catch (error) {
    console.error('Database connection error:', error);
    
    return res.status(500).json({ 
      success: false, 
      error: 'Database connection failed',
      message: error.message,
      code: error.code,
      connectionUrl: process.env.DATABASE_URL ? 'Set (hidden)' : 'Not set',
      supabaseConfigured: isSupabaseConfigured(),
      connectionDetails: process.env.DATABASE_URL ? {
        host: new URL(process.env.DATABASE_URL).hostname,
        port: new URL(process.env.DATABASE_URL).port,
        path: new URL(process.env.DATABASE_URL).pathname,
        hasUsername: !!new URL(process.env.DATABASE_URL).username,
        hasPassword: !!new URL(process.env.DATABASE_URL).password,
      } : null
    });
  }
} 