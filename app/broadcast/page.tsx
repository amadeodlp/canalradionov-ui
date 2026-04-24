'use client'

import React, { useState } from 'react';
import { BroadcastStudio } from '@components/organisms/BroadcastStudio/BroadcastStudio';
import { ChatWindow } from '@components/organisms/ChatWindow/ChatWindow';

export default function BroadcastPage() {
  // State for broadcast session
  const [broadcastSession, setBroadcastSession] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  
  // Mock user data (would come from auth context in a real app)
  const mockUser = {
    id: 'user123',
    name: 'DJ Wavecaster',
    email: 'dj@wavecaster.com',
    profileImage: 'https://randomuser.me/api/portraits/women/44.jpg',
  };
  
  // Handle start broadcast
  const handleStartBroadcast = (sessionId: string) => {
    setBroadcastSession(sessionId);
    setIsLive(true);
  };
  
  // Handle stop broadcast
  const handleStopBroadcast = () => {
    setBroadcastSession(null);
    setIsLive(false);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Broadcast Studio</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Broadcast Studio */}
        <div className="lg:col-span-2">
          <BroadcastStudio 
            onStartBroadcast={handleStartBroadcast}
            onStopBroadcast={handleStopBroadcast}
          />
          
          {/* Tips for broadcasters */}
          <div className="mt-6 p-6 bg-neutral-800/50 border border-white/10 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Broadcasting Tips</h3>
            <ul className="space-y-3 text-white/80">
              <li className="flex items-start">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 text-primary flex-shrink-0 mt-1">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Use a good microphone and find a quiet space to broadcast
              </li>
              <li className="flex items-start">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 text-primary flex-shrink-0 mt-1">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Promote your scheduled broadcasts on social media
              </li>
              <li className="flex items-start">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 text-primary flex-shrink-0 mt-1">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Engage with your listeners through the chat
              </li>
              <li className="flex items-start">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 text-primary flex-shrink-0 mt-1">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Be consistent with your broadcasting schedule
              </li>
            </ul>
          </div>
        </div>
        
        {/* Chat window */}
        <div className="lg:col-span-1 h-[600px]">
          {isLive && broadcastSession ? (
            <ChatWindow 
              broadcastId={broadcastSession}
              isHost={true}
              userName={mockUser.name}
              userId={mockUser.id}
              className="h-full"
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-neutral-800/50 border border-white/10 rounded-xl p-6">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4 text-white/40">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 10.5H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 14H13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h3 className="text-xl font-semibold mb-2">Chat will be available when you&apos;re live</h3>
              <p className="text-white/60 text-center">
                Start your broadcast to activate the live chat and interact with your listeners.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Upcoming scheduled broadcasts */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Your Scheduled Broadcasts</h2>
        
        {/* Mock scheduled broadcasts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-neutral-800/50 border border-white/10 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">Electronic Fridays</h3>
                <p className="text-white/60 text-sm">March 17, 2025 • 8:00 PM</p>
              </div>
              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded">Scheduled</span>
            </div>
            <p className="mt-2 text-white/80 text-sm">Weekly electronic music showcase featuring the latest tracks and guest mixes.</p>
          </div>
          
          <div className="bg-neutral-800/50 border border-white/10 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">Morning Tech Talk</h3>
                <p className="text-white/60 text-sm">March 15, 2025 • 10:00 AM</p>
              </div>
              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded">Scheduled</span>
            </div>
            <p className="mt-2 text-white/80 text-sm">Daily discussion of the latest tech news and trends with listener call-ins.</p>
          </div>
          
          <div className="bg-neutral-800/50 border border-white/10 p-4 rounded-lg flex items-center justify-center border-dashed">
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-white/60">Schedule a New Broadcast</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Past broadcasts */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Your Past Broadcasts</h2>
        
        <div className="overflow-hidden rounded-lg border border-white/10 bg-neutral-800/30">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-neutral-800/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Duration</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Listeners</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium">Weekend Mix Session</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-white/60">March 10, 2025</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-white/60">2h 15m</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-white/60">328</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">
                  <button className="text-primary hover:text-primary-dark">Download</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium">Tech News Roundup</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-white/60">March 8, 2025</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-white/60">1h 30m</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-white/60">176</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">
                  <button className="text-primary hover:text-primary-dark">Download</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium">Indie Discoveries</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-white/60">March 5, 2025</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-white/60">1h 45m</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-white/60">204</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">
                  <button className="text-primary hover:text-primary-dark">Download</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
