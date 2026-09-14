export const MOCK_EVENTS = [
  {
    id: '1',
    title: 'Weekly Quran Study Circle',
    date: '2024-03-20T18:30:00',
    endDate: '2024-03-20T20:00:00',
    description: 'Join us for our weekly Quran study circle where we discuss and reflect on selected verses. Open to all levels of knowledge.',
    category: 'education',
    location: 'Main Prayer Hall',
    image: null,
    isRecurring: true,
    recurringPattern: 'weekly',
    status: 'upcoming'
  },
  {
    id: '2',
    title: 'Community Iftar Gathering',
    date: '2024-03-15T19:15:00',
    endDate: '2024-03-15T21:00:00',
    description: 'Join us for a blessed community iftar during Ramadan. Bring a dish to share with your brothers and sisters.',
    category: 'community',
    location: 'Community Hall',
    image: null,
    isRecurring: false,
    status: 'upcoming'
  },
  {
    id: '3',
    title: 'Youth Islamic Workshop',
    date: '2024-03-25T10:00:00',
    endDate: '2024-03-25T16:00:00',
    description: 'A full-day workshop for young Muslims aged 15-25, covering topics from Islamic history to contemporary challenges.',
    category: 'youth',
    location: 'Learning Center',
    image: null,
    isRecurring: false,
    status: 'upcoming'
  },
  {
    id: '4',
    title: 'Sisters Weekly Halaqah',
    date: '2024-03-22T11:00:00',
    endDate: '2024-03-22T12:30:00',
    description: 'Weekly sisters-only study circle focusing on various Islamic topics and personal development.',
    category: 'education',
    location: 'Sisters Prayer Area',
    image: null,
    isRecurring: true,
    recurringPattern: 'weekly',
    status: 'upcoming'
  },
  {
    id: '5',
    title: 'Family Fun Day',
    date: '2024-04-05T12:00:00',
    endDate: '2024-04-05T17:00:00',
    description: 'A day of activities, games, and food for the whole family. Join us for a day of fun and brotherhood/sisterhood.',
    category: 'community',
    location: 'Mosque Grounds',
    image: null,
    isRecurring: false,
    status: 'upcoming'
  }
];

export const EVENT_CATEGORIES = [
  { id: 'GENERAL', label: 'General', color: '#757575' },
  { id: 'EDUCATIONAL', label: 'Educational', color: '#2e7d32' },
  { id: 'YOUTH', label: 'Youth', color: '#ed6c02' },
  { id: 'COMMUNITY', label: 'Community', color: '#1976d2' },
  { id: 'RELIGIOUS', label: 'Religious', color: '#9c27b0' },
  { id: 'CHARITY', label: 'Charity', color: '#d32f2f' }
];

export const EVENT_STATUS = {
  DRAFT: 'draft',
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}; 