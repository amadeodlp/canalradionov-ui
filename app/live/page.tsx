'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@components/atoms/Button/Button';
import { ChatWindow } from '@components/organisms/ChatWindow/ChatWindow';
import { mediaService, RadioShow } from '@api/services/mediaService';

const mockUser = {
  id: 'user123',
  name: 'RadioFan',
};

export default function LivePage() {
  const [selectedBroadcast, setSelectedBroadcast] = useState<RadioShow | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [liveBroadcasts, setLiveBroadcasts] = useState<RadioShow[]>([]);

  useEffect(() => {
    mediaService.getLiveShows().then(setLiveBroadcasts);
  }, []);

  const handleSelectBroadcast = (broadcast: RadioShow) => {
    setSelectedBroadcast(broadcast);
  };

  const handlePlayPause = (broadcast: RadioShow) => {
    if (selectedBroadcast && selectedBroadcast.id === broadcast.id) {
      setIsPlaying(!isPlaying);
    } else {
      setSelectedBroadcast(broadcast);
      setIsPlaying(true);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Live Now</h1>
      <p className="text-white/60 mb-8">Tune in to live broadcasts happening right now.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Broadcasts list */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-6">
            {liveBroadcasts.map(broadcast => (
              <div
                key={broadcast.id}
                className={`
                  rounded-xl overflow-hidden border
                  ${selectedBroadcast?.id === broadcast.id ? 'border-primary' : 'border-white/10'}
                  transition-colors duration-300
                `}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Broadcast image */}
                  <div className="md:w-1/3 relative">
                    <Image
                      src={broadcast.image_url}
                      alt={broadcast.title}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover aspect-video md:aspect-square"
                    />
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center">
                      <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
                      LIVE
                    </div>
                  </div>

                  {/* Broadcast details */}
                  <div className="md:w-2/3 p-4 flex flex-col">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-bold">{broadcast.title}</h2>
                        <p className="text-white/60">Hosted by {broadcast.host_name}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-white/60">On air for</div>
                        <div className="text-white font-medium">{broadcast.scheduled_time}</div>
                      </div>
                    </div>

                    <p className="mt-2 text-white/80">{broadcast.description}</p>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {broadcast.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-neutral-700/80 text-white px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/60 mr-1">
                          <path d="M18 8C18 4.68629 15.3137 2 12 2C8.68629 2 6 4.68629 6 8C6 11.3137 8.68629 14 12 14C15.3137 14 18 11.3137 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M2.50002 22C3.52083 19.3696 5.23961 17.111 7.43544 15.5185C9.63128 13.9261 12.2296 13.0655 14.9017 13.0655C17.5737 13.0655 20.1721 13.9261 22.3679 15.5185C24.5637 17.111 26.2825 19.3696 27.3033 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="text-white/60">0 listeners</span>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSelectBroadcast(broadcast)}
                        >
                          Join Chat
                        </Button>

                        <Button
                          variant={selectedBroadcast?.id === broadcast.id && isPlaying ? "danger" : "primary"}
                          size="sm"
                          onClick={() => handlePlayPause(broadcast)}
                          leftIcon={
                            selectedBroadcast?.id === broadcast.id && isPlaying ? (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
                                <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
                              </svg>
                            ) : (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 4L18 12L6 20V4Z" fill="currentColor" />
                              </svg>
                            )
                          }
                        >
                          {selectedBroadcast?.id === broadcast.id && isPlaying ? 'Stop' : 'Listen'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat window */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            {selectedBroadcast ? (
              <div className="h-[600px] flex flex-col">
                <div className="p-4 bg-neutral-800 rounded-t-xl border-b border-white/10">
                  <h2 className="font-semibold">Chat: {selectedBroadcast.title}</h2>
                </div>
                <div className="flex-grow">
                  <ChatWindow
                    broadcastId={selectedBroadcast.id}
                    isHost={false}
                    userName={mockUser.name}
                    userId={mockUser.id}
                    className="h-full rounded-none rounded-b-xl"
                  />
                </div>
              </div>
            ) : (
              <div className="h-[600px] flex flex-col items-center justify-center bg-neutral-800 rounded-xl border border-white/10 p-6">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4 text-white/40">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 10.5H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 14H13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3 className="text-xl font-semibold mb-2">Select a broadcast</h3>
                <p className="text-white/60 text-center">
                  Choose a live broadcast to join the chat and interact with other listeners.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming broadcasts section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Coming Up Next</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="bg-neutral-800/50 border border-white/10 rounded-lg overflow-hidden">
            <div className="relative">
              <Image src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80" alt="Upcoming broadcast" width={400} height={300} className="w-full h-48 object-cover" />
              <div className="absolute bottom-2 left-2 bg-neutral-900/80 text-white text-xs px-2 py-1 rounded">
                Starting in 15 minutes
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold">Jazz Sessions</h3>
              <p className="text-white/60 text-sm">Hosted by Melody Murray</p>
              <Button variant="outline" size="sm" className="w-full mt-3">Set Reminder</Button>
            </div>
          </div>

          <div className="bg-neutral-800/50 border border-white/10 rounded-lg overflow-hidden">
            <div className="relative">
              <Image src="https://images.unsplash.com/photo-1485579149621-3123dd979885?ixlib=rb-4.0.3&auto=format&fit=crop&w=1231&q=80" alt="Upcoming broadcast" width={400} height={300} className="w-full h-48 object-cover" />
              <div className="absolute bottom-2 left-2 bg-neutral-900/80 text-white text-xs px-2 py-1 rounded">
                Starting in 45 minutes
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold">Hip Hop History</h3>
              <p className="text-white/60 text-sm">Hosted by DJ Classic</p>
              <Button variant="outline" size="sm" className="w-full mt-3">Set Reminder</Button>
            </div>
          </div>

          <div className="bg-neutral-800/50 border border-white/10 rounded-lg overflow-hidden">
            <div className="relative">
              <Image src="https://images.unsplash.com/photo-1507413245164-6160d8298b31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80" alt="Upcoming broadcast" width={400} height={300} className="w-full h-48 object-cover" />
              <div className="absolute bottom-2 left-2 bg-neutral-900/80 text-white text-xs px-2 py-1 rounded">
                Starting in 1 hour 20 minutes
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold">Mind Matters</h3>
              <p className="text-white/60 text-sm">Hosted by Dr. Lisa Park</p>
              <Button variant="outline" size="sm" className="w-full mt-3">Set Reminder</Button>
            </div>
          </div>

          <div className="bg-neutral-800/50 border border-white/10 rounded-lg overflow-hidden">
            <div className="relative">
              <Image src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80" alt="Upcoming broadcast" width={400} height={300} className="w-full h-48 object-cover" />
              <div className="absolute bottom-2 left-2 bg-neutral-900/80 text-white text-xs px-2 py-1 rounded">
                Starting in 2 hours 5 minutes
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold">Startup Stories</h3>
              <p className="text-white/60 text-sm">Hosted by Entrepreneur Eric</p>
              <Button variant="outline" size="sm" className="w-full mt-3">Set Reminder</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule section */}
      <div className="mt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Weekly Schedule</h2>
          <Link href="/schedule"><Button variant="outline" size="sm">View Full Schedule</Button></Link>
        </div>

        <div className="overflow-hidden rounded-lg border border-white/10 bg-neutral-800/30">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-neutral-800/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Time</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Monday</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Tuesday</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Wednesday</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Thursday</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Friday</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">8:00 AM</td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium">Morning Motivation</div><div className="text-xs text-white/60">Sarah Johnson</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium">Morning Motivation</div><div className="text-xs text-white/60">Sarah Johnson</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium">Morning Motivation</div><div className="text-xs text-white/60">Sarah Johnson</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium">Morning Motivation</div><div className="text-xs text-white/60">Sarah Johnson</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium">Morning Motivation</div><div className="text-xs text-white/60">Sarah Johnson</div></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">10:00 AM</td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium">Tech Talk Daily</div><div className="text-xs text-white/60">Alex Chen</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium">Tech Talk Daily</div><div className="text-xs text-white/60">Alex Chen</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium">Tech Talk Daily</div><div className="text-xs text-white/60">Alex Chen</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium">Tech Talk Daily</div><div className="text-xs text-white/60">Alex Chen</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium">Tech Talk Daily</div><div className="text-xs text-white/60">Alex Chen</div></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">2:00 PM</td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium">Indie Spotlight</div><div className="text-xs text-white/60">Melody Finder</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium">Jazz Sessions</div><div className="text-xs text-white/60">Melody Murray</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium">Hip Hop History</div><div className="text-xs text-white/60">DJ Classic</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium">World Music Journey</div><div className="text-xs text-white/60">DJ WorldWide</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium">Indie Spotlight</div><div className="text-xs text-white/60">Melody Finder</div></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">8:00 PM</td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium">Electronic Horizons</div><div className="text-xs text-white/60">DJ Pulse</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium">True Crime Stories</div><div className="text-xs text-white/60">Mike Reynolds</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium">Mind Matters</div><div className="text-xs text-white/60">Dr. Lisa Park</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium">Startup Stories</div><div className="text-xs text-white/60">Entrepreneur Eric</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium">Electronic Horizons</div><div className="text-xs text-white/60">DJ Pulse</div></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
