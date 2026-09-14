import React from 'react';
// TEMPORARY: the events endpoint is currently unavailable, so we show the gym
// schedule image instead. To restore the real events page, swap the import/return
// below back to the original Events component (kept intact in components/Events.js).
// import Events from '../components/Events';
import EventsScheduleTemp from '../components/EventsScheduleTemp';

export default function EventsPage() {
  // return <Events />;
  return <EventsScheduleTemp />;
}
