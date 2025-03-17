'use client'

import { useState } from 'react';
import { ShowGrid } from '@components/organisms/ShowGrid/ShowGrid';

// Mock data for library content
const USER_LIBRARY = [
  {
    id: 'lib1',
    title: 'Late Night Jazz',
    hostName: 'Melody Parker',
    description: 'Smooth jazz for your late night relaxation and unwinding.',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    isLive: false,
    tags: ['Jazz', 'Relaxing', 'Night'],
    episodes: new Array(15),
  },
  {
    id: 'lib2',
    title: 'Tech Talk Daily',
    hostName: 'Alex Morgan',
    description: 'Daily discussions about the latest in technology, gadgets, and digital trends.',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    isLive: false,
    tags: ['Technology', 'News', 'Daily'],
    episodes: new Array(42),
  },
  {
    id: 'lib3',
    title: 'Morning Motivation',
    hostName: 'Sarah Johnson',
    description: 'Start your day with inspiring stories, productivity tips, and interviews with successful entrepreneurs.',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80',
    isLive: false,
    tags: ['Motivation', 'Self-improvement', 'Entrepreneurship'],
    episodes: new Array(35),
  },
  {
    id: 'lib4',
    title: 'History Uncovered',
    hostName: 'Professor Smith',
    description: 'Deep dives into overlooked historical events and figures that shaped our world.',
    imageUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1174&q=80',
    isLive: false,
    tags: ['History', 'Education', 'Documentary'],
    episodes: new Array(28),
  },
];

// Mock data for recently played
const RECENTLY_PLAYED = [
  {
    id: 'recent1',
    title: 'Electronic Horizons',
    hostName: 'DJ Pulse',
    description: 'Explore the latest electronic music trends with weekly guests and exclusive premieres.',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    isLive: false,
    tags: ['Electronic', 'Dance', 'House'],
    episodes: new Array(12),
  },
  {
    id: 'recent2',
    title: 'True Crime Stories',
    hostName: 'Mike Reynolds',
    description: 'In-depth analysis of famous criminal cases with expert interviews and eyewitness accounts.',
    imageUrl: 'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    isLive: false,
    tags: ['True Crime', 'Investigation', 'Documentary'],
    episodes: new Array(42),
  },
  {
    id: 'recent3',
    title: 'The Foodie Hour',
    hostName: 'Chef Ramiro',
    description: 'Culinary adventures, food history, and interviews with renowned chefs from around the world.',
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    isLive: false,
    tags: ['Food', 'Cooking', 'Culture'],
    episodes: new Array(22),
  }
];

export default function Library() {
  const [activeShow, setActiveShow] = useState<any>(null);
  
  // Handle show selection
  const handleShowSelect = (show: any) => {
    console.log('Selected show:', show);
    // Navigate to show detail page
    window.location.href = `/shows/${show.id}`;
  };
  
  // Handle show play
  const handlePlayShow = (show: any) => {
    setActiveShow(show);
    console.log('Playing show:', show);
    
    // Dispatch to player context/redux to update the player
    // For now, we'll just update local state
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Library</h1>
      
      {/* Recently Played Section */}
      <section className="mb-16">
        <ShowGrid 
          title="Recently Played"
          shows={RECENTLY_PLAYED}
          onShowSelect={handleShowSelect}
          onPlay={handlePlayShow}
          cardSize="md"
          showLoadMore={false}
        />
      </section>
      
      {/* Saved Shows Section */}
      <section className="mb-16">
        <ShowGrid 
          title="Saved Shows"
          shows={USER_LIBRARY}
          onShowSelect={handleShowSelect}
          onPlay={handlePlayShow}
          cardSize="md"
        />
      </section>
    </div>
  );
}
