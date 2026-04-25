'use client'

import { useState, useEffect } from 'react';
import { ShowGrid } from '@components/organisms/ShowGrid/ShowGrid';
import { mediaService, RadioShow } from '@api/services/mediaService';

export default function Library() {
  const [, setActiveShow] = useState<RadioShow | null>(null);
  const [allShows, setAllShows] = useState<RadioShow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mediaService.getAllShows().then((shows) => {
      setAllShows(shows);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  const recentlyPlayed = allShows.slice(0, 3);
  const savedShows = allShows.slice(0, 8);

  const handleShowSelect = (show: RadioShow) => {
    window.location.href = `/shows/${show.id}`;
  };

  const handlePlayShow = (show: RadioShow) => {
    setActiveShow(show);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Library</h1>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin rounded-full border-t-2 border-b-2 h-10 w-10 border-primary"></div>
        </div>
      ) : (
        <>
          <section className="mb-16">
            <ShowGrid 
              title="Recently Played"
              shows={recentlyPlayed}
              onShowSelect={handleShowSelect}
              onPlay={handlePlayShow}
              cardSize="md"
              showLoadMore={false}
              emptyMessage="No recently played shows"
            />
          </section>
          
          <section className="mb-16">
            <ShowGrid 
              title="Saved Shows"
              shows={savedShows}
              onShowSelect={handleShowSelect}
              onPlay={handlePlayShow}
              cardSize="md"
              emptyMessage="No saved shows yet"
            />
          </section>
        </>
      )}
    </div>
  );
}
