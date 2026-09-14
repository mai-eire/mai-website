import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid event ID' });
  }

  // GET single event
  if (req.method === 'GET') {
    try {
      const event = await prisma.event.findUnique({
        where: { id },
      });

      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      return res.status(200).json(event);
    } catch (error) {
      console.error('Error fetching event:', error);
      return res.status(500).json({ error: 'Error fetching event' });
    }
  }

  // UPDATE event
  if (req.method === 'PUT') {
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
        isActive,
      } = req.body;

      const updatedEvent = await prisma.event.update({
        where: { id },
        data: {
          title,
          description,
          date: new Date(date),
          startTime: new Date(startTime),
          endTime: endTime ? new Date(endTime) : null,
          location,
          imageUrl,
          category,
          isActive,
          updatedAt: new Date(),
        },
      });

      return res.status(200).json(updatedEvent);
    } catch (error) {
      console.error('Error updating event:', error);
      return res.status(500).json({ error: 'Error updating event' });
    }
  }

  // DELETE event
  if (req.method === 'DELETE') {
    try {
      await prisma.event.delete({
        where: { id },
      });

      return res.status(204).end();
    } catch (error) {
      console.error('Error deleting event:', error);
      return res.status(500).json({ error: 'Error deleting event' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
} 