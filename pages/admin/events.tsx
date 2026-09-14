import React from 'react';
import EventManager from '../../components/admin/EventManager';
import ProtectedRoute from '../../components/admin/ProtectedRoute';

export default function AdminEvents() {
  return (
    <ProtectedRoute>
      <EventManager />
    </ProtectedRoute>
  );
} 