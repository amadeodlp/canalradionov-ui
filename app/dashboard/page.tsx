'use client'

import React from 'react';
import BroadcasterDashboard from '@components/pages/BroadcastPage/BroadcasterDashboard';

export default function DashboardPage() {
  // Mock user data (would come from auth context in a real app)
  const mockUser = {
    id: 'user-123',
    name: 'DJ Wavecaster',
  };
  
  return (
    <BroadcasterDashboard
      userId={mockUser.id}
      userName={mockUser.name}
    />
  );
}
