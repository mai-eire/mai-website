const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const prisma = new PrismaClient();
const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000', 
    'http://localhost:5000', 
    'http://localhost:5001',
    'https://mai-website.netlify.app'  // TODO: replace with your actual Netlify domain
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Apply CORS middleware before any routes
app.use(cors(corsOptions));
app.use(express.json());

// Add a middleware to log requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// GET all events
app.get('/api/events', async (req, res) => {
  try {
    console.log('Fetching events...'); // Debug log
    const events = await prisma.event.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        date: 'asc',
      },
    });
    
    console.log('Events fetched:', events); // Debug log
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Error fetching events' });
  }
});

// POST new event
app.post('/api/events', async (req, res) => {
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
      isActive
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
        isActive
      },
    });

    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Error creating event: ' + error.message });
  }
});

// PUT update event
app.put('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      date,
      startTime,
      endTime,
      location,
      imageUrl,
      category,
      isActive
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

    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Error updating event: ' + error.message });
  }
});

// DELETE event
app.delete('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.event.delete({
      where: { id },
    });
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Error deleting event' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`API Server is running on port ${PORT}`);
}); 