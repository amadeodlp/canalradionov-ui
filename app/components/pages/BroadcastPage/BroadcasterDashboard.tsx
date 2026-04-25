'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@components/atoms/Button/Button';
import BroadcastStudio from '@components/organisms/BroadcastStudio/BroadcastStudio';
import ChatWindow from '@components/organisms/ChatWindow/ChatWindow';

interface BroadcastStats {
  totalListeners: number;
  peakListeners: number;
  averageDuration: number;
  totalBroadcasts: number;
}

interface BroadcasterDashboardProps {
  userId: string;
  userName: string;
}

export const BroadcasterDashboard: React.FC<BroadcasterDashboardProps> = ({
  userId,
  userName
}) => {
  const [activeTab, setActiveTab] = useState<'broadcast' | 'schedule' | 'analytics'>('broadcast');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [stats, setStats] = useState<BroadcastStats>({
    totalListeners: 0,
    peakListeners: 0,
    averageDuration: 0,
    totalBroadcasts: 0
  });
  
  // Mock scheduled broadcasts
  const scheduledBroadcasts = [
    {
      id: 'sched-1',
      title: 'Weekly Music Review',
      description: 'Reviewing the latest music releases',
      scheduledTime: new Date(Date.now() + 3600000 * 24).toISOString(),
      isRecurring: true,
      recurringPattern: 'WEEKLY'
    },
    {
      id: 'sched-2',
      title: 'Indie Artist Spotlight',
      description: 'Showcasing upcoming indie artists',
      scheduledTime: new Date(Date.now() + 3600000 * 72).toISOString(),
      isRecurring: false,
      recurringPattern: null
    }
  ];
  
  // Mock past broadcasts
  const pastBroadcasts = [
    {
      id: 'past-1',
      title: 'Weekend Hits',
      date: new Date(Date.now() - 3600000 * 48).toISOString(),
      duration: 5400, // 1.5 hours in seconds
      listeners: 120,
      recordingUrl: '/recordings/past-1'
    },
    {
      id: 'past-2',
      title: 'Jazz Session',
      date: new Date(Date.now() - 3600000 * 96).toISOString(),
      duration: 7200, // 2 hours in seconds
      listeners: 85,
      recordingUrl: '/recordings/past-2'
    }
  ];
  
  useEffect(() => {
    // In a real app, we would fetch stats from the API
    // This is just mock data
    setStats({
      totalListeners: 205,
      peakListeners: 45,
      averageDuration: 75, // 75 minutes
      totalBroadcasts: 12
    });
  }, []);
  
  const handleStartBroadcast = (id: string) => {
    setSessionId(id);
    setIsBroadcasting(true);
  };
  
  const handleStopBroadcast = () => {
    setSessionId(null);
    setIsBroadcasting(false);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };
  
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };
  
  return (
    <div className="min-h-screen bg-neutral-900 pb-16">
      {/* Header */}
      <header className="bg-neutral-800 border-b border-white/10 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white">Broadcaster Dashboard</h1>
          <p className="text-white/60">Manage your broadcasts, schedule shows, and track your audience</p>
        </div>
      </header>
      
      {/* Tab navigation */}
      <div className="bg-neutral-800 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto">
            <button 
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                activeTab === 'broadcast' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-white/60 hover:text-white'
              }`}
              onClick={() => setActiveTab('broadcast')}
            >
              Broadcast Studio
            </button>
            <button 
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                activeTab === 'schedule' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-white/60 hover:text-white'
              }`}
              onClick={() => setActiveTab('schedule')}
            >
              Schedule
            </button>
            <button 
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                activeTab === 'analytics' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-white/60 hover:text-white'
              }`}
              onClick={() => setActiveTab('analytics')}
            >
              Analytics
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="container mx-auto px-4 mt-8">
        {/* Broadcast Studio Tab */}
        {activeTab === 'broadcast' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column: Broadcast studio */}
            <div className="lg:col-span-2">
              <BroadcastStudio 
                onStartBroadcast={handleStartBroadcast}
                onStopBroadcast={handleStopBroadcast}
              />
              
              {/* Quick tips */}
              <div className="bg-neutral-800/60 rounded-xl p-6 mt-6">
                <h3 className="text-xl font-semibold text-white mb-4">Broadcasting Tips</h3>
                <ul className="space-y-3 text-white/80">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <p>Use a good quality microphone for the best audio experience.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <p>Find a quiet environment to reduce background noise.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <p>Engage with your listeners through the chat to build community.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <p>Promote your broadcast on social media to increase listeners.</p>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Right column: Chat */}
            <div className="h-[600px]">
              {isBroadcasting && sessionId ? (
                <ChatWindow 
                  broadcastId={sessionId}
                  isHost={true}
                  userName={userName}
                  userId={userId}
                  className="h-full"
                />
              ) : (
                <div className="bg-neutral-800 rounded-xl h-full flex items-center justify-center p-6 text-center">
                  <div>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4 text-white/20">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M8 10.5H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M8 14H13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <h3 className="text-xl font-semibold text-white mb-2">Chat Unavailable</h3>
                    <p className="text-white/60">Start broadcasting to enable the live chat with your listeners</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="space-y-8">
            {/* Upcoming broadcasts */}
            <div className="bg-neutral-800 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Scheduled Broadcasts</h2>
                <Button variant="primary" size="sm">
                  Schedule New
                </Button>
              </div>
              
              <div className="p-6">
                {scheduledBroadcasts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-white/60">No scheduled broadcasts</p>
                    <Button variant="outline" size="sm" className="mt-4">
                      Schedule Your First Broadcast
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y divide-white/10">
                    {scheduledBroadcasts.map(broadcast => (
                      <div key={broadcast.id} className="py-4 first:pt-0 last:pb-0">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                          <div>
                            <h3 className="text-lg font-semibold text-white">{broadcast.title}</h3>
                            <p className="text-white/60 text-sm mb-2">{broadcast.description}</p>
                            <div className="flex items-center text-sm text-white/80">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                                <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                              </svg>
                              {formatDate(broadcast.scheduledTime)}
                              
                              {broadcast.isRecurring && (
                                <span className="ml-3 inline-flex items-center bg-primary/20 text-primary px-2 py-0.5 rounded-full text-xs">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                                    <path d="M17 2L21 6L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M3 11V9C3 7.89543 3.89543 7 5 7H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M7 22L3 18L7 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M21 13V15C21 16.1046 20.1046 17 19 17H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                  Recurring
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex mt-4 sm:mt-0 space-x-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="danger" size="sm">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Past broadcasts */}
            <div className="bg-neutral-800 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-2xl font-bold text-white">Past Broadcasts</h2>
              </div>
              
              <div className="p-6">
                {pastBroadcasts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-white/60">No past broadcasts</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/10">
                    {pastBroadcasts.map(broadcast => (
                      <div key={broadcast.id} className="py-4 first:pt-0 last:pb-0">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                          <div>
                            <h3 className="text-lg font-semibold text-white">{broadcast.title}</h3>
                            <div className="flex flex-wrap text-sm text-white/80 gap-x-4 gap-y-1">
                              <div className="flex items-center">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                                  <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                                </svg>
                                {formatDate(broadcast.date)}
                              </div>
                              <div className="flex items-center">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                                  <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                                </svg>
                                {formatDuration(broadcast.duration)}
                              </div>
                              <div className="flex items-center">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                                  <path d="M17 8C17 10.7614 14.7614 13 12 13C9.23858 13 7 10.7614 7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8Z" stroke="currentColor" strokeWidth="2" />
                                  <path d="M3 21C3 17.134 7.02944 14 12 14C16.9706 14 21 17.134 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                {broadcast.listeners} listeners
                              </div>
                            </div>
                          </div>
                          <div className="flex mt-4 sm:mt-0 space-x-2">
                            <Button variant="outline" size="sm">
                              Listen
                            </Button>
                            <Button variant="outline" size="sm">
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Stats overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-neutral-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-white/60">Total Listeners</h3>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                    <path d="M17 8C17 10.7614 14.7614 13 12 13C9.23858 13 7 10.7614 7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8Z" stroke="currentColor" strokeWidth="2" />
                    <path d="M3 21C3 17.134 7.02944 14 12 14C16.9706 14 21 17.134 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-white">{stats.totalListeners}</div>
                <div className="text-xs text-green-400 mt-1">+8% from last month</div>
              </div>
              
              <div className="bg-neutral-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-white/60">Peak Listeners</h3>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                    <path d="M2 12H4.5L7.5 4L10.5 20L13.5 8L16.5 14L19.5 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-white">{stats.peakListeners}</div>
                <div className="text-xs text-green-400 mt-1">During &quot;Weekend Hits&quot; show</div>
              </div>
              
              <div className="bg-neutral-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-white/60">Avg. Duration</h3>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                    <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-white">{stats.averageDuration} min</div>
                <div className="text-xs text-yellow-400 mt-1">No change from last month</div>
              </div>
              
              <div className="bg-neutral-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-white/60">Total Broadcasts</h3>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" fill="currentColor" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-white">{stats.totalBroadcasts}</div>
                <div className="text-xs text-green-400 mt-1">+2 from last month</div>
              </div>
            </div>
            
            {/* Chart placeholder */}
            <div className="bg-neutral-800 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">Listener Growth</h2>
              </div>
              
              <div className="p-6">
                <div className="bg-neutral-700/50 rounded-lg h-64 flex items-center justify-center">
                  <p className="text-white/40">Listener growth chart will be shown here</p>
                </div>
              </div>
            </div>
            
            {/* Top broadcasts */}
            <div className="bg-neutral-800 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">Top Broadcasts</h2>
              </div>
              
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="pb-3 text-white/60 font-medium">Title</th>
                        <th className="pb-3 text-white/60 font-medium">Date</th>
                        <th className="pb-3 text-white/60 font-medium">Listeners</th>
                        <th className="pb-3 text-white/60 font-medium">Duration</th>
                        <th className="pb-3 text-white/60 font-medium">Engagement</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/5">
                        <td className="py-3 text-white">Weekend Hits</td>
                        <td className="py-3 text-white/60">Mar 12, 2025</td>
                        <td className="py-3 text-white">120</td>
                        <td className="py-3 text-white/60">1h 30m</td>
                        <td className="py-3 text-white">
                          <div className="flex items-center">
                            <div className="w-24 bg-neutral-700 rounded-full h-2 mr-2">
                              <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                            </div>
                            <span>75%</span>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-3 text-white">Jazz Session</td>
                        <td className="py-3 text-white/60">Mar 8, 2025</td>
                        <td className="py-3 text-white">85</td>
                        <td className="py-3 text-white/60">2h 00m</td>
                        <td className="py-3 text-white">
                          <div className="flex items-center">
                            <div className="w-24 bg-neutral-700 rounded-full h-2 mr-2">
                              <div className="bg-primary h-2 rounded-full" style={{ width: '68%' }}></div>
                            </div>
                            <span>68%</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 text-white">Artist Interview</td>
                        <td className="py-3 text-white/60">Mar 2, 2025</td>
                        <td className="py-3 text-white">63</td>
                        <td className="py-3 text-white/60">45m</td>
                        <td className="py-3 text-white">
                          <div className="flex items-center">
                            <div className="w-24 bg-neutral-700 rounded-full h-2 mr-2">
                              <div className="bg-primary h-2 rounded-full" style={{ width: '82%' }}></div>
                            </div>
                            <span>82%</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BroadcasterDashboard;
