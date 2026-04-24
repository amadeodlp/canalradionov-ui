'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShowGrid } from '@components/organisms/ShowGrid/ShowGrid';
import { Input } from '@components/atoms/Input/Input';
import { Button } from '@components/atoms/Button/Button';
import { mediaService, RadioShow } from '@api/services/mediaService';

// Static categories (no need to fetch these)
const CATEGORIES = [
  { id: 'music', name: 'Music', showCount: 248 },
  { id: 'talkShows', name: 'Talk Shows', showCount: 187 },
  { id: 'news', name: 'News & Politics', showCount: 173 },
  { id: 'technology', name: 'Technology', showCount: 154 },
  { id: 'business', name: 'Business', showCount: 142 },
  { id: 'education', name: 'Education', showCount: 137 },
  { id: 'comedy', name: 'Comedy', showCount: 125 },
  { id: 'science', name: 'Science', showCount: 119 },
];

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [allShows, setAllShows] = useState<RadioShow[]>([]);

  useEffect(() => {
    mediaService.getAllShows().then(setAllShows);
  }, []);
  
  const filteredShows = allShows.filter(show => {
    const matchesSearch = searchQuery === '' ||
      show.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (show.host_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (show.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (show.tags && show.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesCategory = selectedCategory === '' ||
      (show.tags && show.tags.some(tag => tag.toLowerCase() === selectedCategory.toLowerCase()));
    return matchesSearch && matchesCategory;
  });

  const sortedShows = [...filteredShows].sort((a, b) => {
    if (sortBy === 'az') return a.title.localeCompare(b.title);
    return 0;
  });
  
  // Handle show selection
  const handleShowSelect = (show: RadioShow) => {
    console.log('Selected show:', show);
    // This would typically navigate to the show detail page
  };

  // Handle show play
  const handlePlayShow = (show: RadioShow) => {
    console.log('Playing show:', show);
    // This would typically update the global audio player with the selected show
  };
  
  // Clear filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSortBy('');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Discover Shows</h1>
      <p className="text-white/60 mb-8">Find new shows, hosts, and topics to explore.</p>
      
      {/* Search and filter bar */}
      <div className="bg-neutral-800/50 rounded-xl border border-white/10 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Search</label>
            <Input
              placeholder="Search shows, hosts, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
            />
          </div>
          
          {/* Category filter */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-neutral-700/50 border border-white/10 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(category => (
                <option key={category.id} value={category.name.toLowerCase()}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Sort options */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-neutral-700/50 border border-white/10 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">Recommended</option>
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="az">A-Z</option>
            </select>
          </div>
        </div>
        
        {/* Active filters */}
        {(searchQuery || selectedCategory || sortBy) && (
          <div className="flex items-center mt-4 pt-4 border-t border-white/10">
            <span className="text-sm text-white/60 mr-2">Active filters:</span>
            <div className="flex flex-wrap gap-2">
              {searchQuery && (
                <span className="bg-primary/20 text-primary text-xs px-3 py-1 rounded-full flex items-center">
                  Search: {searchQuery}
                  <button 
                    className="ml-2"
                    onClick={() => setSearchQuery('')}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </span>
              )}
              
              {selectedCategory && (
                <span className="bg-primary/20 text-primary text-xs px-3 py-1 rounded-full flex items-center">
                  Category: {selectedCategory}
                  <button 
                    className="ml-2"
                    onClick={() => setSelectedCategory('')}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </span>
              )}
              
              {sortBy && (
                <span className="bg-primary/20 text-primary text-xs px-3 py-1 rounded-full flex items-center">
                  Sort: {sortBy === 'recent' ? 'Most Recent' : sortBy === 'popular' ? 'Most Popular' : 'A-Z'}
                  <button 
                    className="ml-2"
                    onClick={() => setSortBy('')}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </span>
              )}
              
              <button 
                className="text-white/60 hover:text-white text-xs underline ml-2"
                onClick={clearFilters}
              >
                Clear all
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Results */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">
          {searchQuery || selectedCategory || sortBy 
            ? `Search Results (${sortedShows.length})`
            : 'Featured Shows'}
        </h2>
        
        <ShowGrid 
          shows={sortedShows}
          onShowSelect={handleShowSelect}
          onPlay={handlePlayShow}
          cardSize="md"
          emptyMessage="No shows found matching your search criteria. Try adjusting your filters."
        />
      </div>
      
      {/* Categories section */}
      <div className="mt-16 mb-8">
        <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {CATEGORIES.map(category => (
            <a 
              key={category.id}
              href={`/category/${category.id}`}
              className="bg-neutral-800/50 hover:bg-neutral-700/50 border border-white/10 rounded-lg p-4 transition-colors group"
            >
              <h3 className="text-lg font-medium group-hover:text-primary transition-colors">{category.name}</h3>
              <p className="text-sm text-white/60">{category.showCount} shows</p>
            </a>
          ))}
        </div>
      </div>
      
      {/* Featured Hosts */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Featured Hosts</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Host cards */}
          <div className="bg-neutral-800/50 border border-white/10 rounded-lg p-4 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full overflow-hidden mb-4">
              <Image
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="DJ Pulse"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-semibold">DJ Pulse</h3>
            <p className="text-sm text-white/60 mb-2">Electronic Music</p>
            <p className="text-xs text-white/40 mb-4">12 shows • 248 episodes</p>
            <Button variant="outline" size="sm">View Profile</Button>
          </div>

          <div className="bg-neutral-800/50 border border-white/10 rounded-lg p-4 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full overflow-hidden mb-4">
              <Image
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="Sarah Johnson"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-semibold">Sarah Johnson</h3>
            <p className="text-sm text-white/60 mb-2">Motivation & Business</p>
            <p className="text-xs text-white/40 mb-4">8 shows • 192 episodes</p>
            <Button variant="outline" size="sm">View Profile</Button>
          </div>

          <div className="bg-neutral-800/50 border border-white/10 rounded-lg p-4 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full overflow-hidden mb-4">
              <Image
                src="https://randomuser.me/api/portraits/men/67.jpg"
                alt="Professor Smith"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-semibold">Professor Smith</h3>
            <p className="text-sm text-white/60 mb-2">History & Education</p>
            <p className="text-xs text-white/40 mb-4">6 shows • 134 episodes</p>
            <Button variant="outline" size="sm">View Profile</Button>
          </div>

          <div className="bg-neutral-800/50 border border-white/10 rounded-lg p-4 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full overflow-hidden mb-4">
              <Image
                src="https://randomuser.me/api/portraits/women/68.jpg"
                alt="Dr. Lisa Park"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-semibold">Dr. Lisa Park</h3>
            <p className="text-sm text-white/60 mb-2">Psychology & Science</p>
            <p className="text-xs text-white/40 mb-4">4 shows • 97 episodes</p>
            <Button variant="outline" size="sm">View Profile</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
