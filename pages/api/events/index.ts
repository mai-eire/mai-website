import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { Event } from '@prisma/client';

// Function to retry a database operation
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        console.log(`Retrying in ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
  
  throw lastError;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      console.log('Attempting to fetch events...');
      console.log('Database URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
      
      // Add a timeout to the database connection
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Database connection timeout')), 15000);
      });
      
      const eventsPromise = retryOperation(() => 
        prisma.event.findMany({
          where: {
            isActive: true,
          },
          orderBy: {
            date: 'asc',
          },
        })
      );
      
      const events = await Promise.race([eventsPromise, timeoutPromise]) as Event[];
      
      console.log(`Successfully fetched ${events.length} events`);
      return res.status(200).json(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      
      // Check if it's a database connection error
      if (error.code === 'P1001' || error.message?.includes('connection') || error.message?.includes('timeout')) {
        return res.status(500).json({ 
          error: 'Database connection error. Please check your database configuration.',
          details: process.env.NODE_ENV === 'development' ? error.message : 'Connection error',
          code: error.code,
          message: error.message
        });
      }
      
      return res.status(500).json({ 
        error: 'Error fetching events',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        code: error.code,
        message: error.message
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const {
        title,
        description,
        date,
        startTime,
        endTime,
        location,
        imageUrl,
        category,
      } = req.body;

      const event = await prisma.event.create({
        data: {
          title,
          description,
          date: new Date(date),
          startTime: new Date(startTime),
          endTime: endTime ? new Date(endTime) : null,
          location,
          imageUrl,
          category,
        },
      });

      return res.status(201).json(event);
    } catch (error) {
      console.error('Error creating event:', error);
      return res.status(500).json({ error: 'Error creating event' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
} 