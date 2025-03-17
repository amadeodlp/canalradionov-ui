'use client'

import { useState, useEffect } from 'react';
import { Button } from '@components/atoms/Button/Button';
import { ShowGrid } from '@components/organisms/ShowGrid/ShowGrid';

// Mock data for featured shows
const FEATURED_SHOWS = [
  {
    id: 'show1',
    title: 'Electronic Horizons',
    hostName: 'DJ Pulse',
    description: 'Explore the latest electronic music trends with weekly guests and exclusive premieres.',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    isLive: true,
    tags: ['Electronic', 'Dance', 'House'],
    episodes: new Array(12),
  },
  {
    id: 'show2',
    title: 'Jazz Conversations',
    hostName: 'Melody Murray',
    description: 'Deep dives into jazz classics and conversations with jazz musicians about their craft.',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80',
    isLive: false,
    scheduledTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    tags: ['Jazz', 'Interviews', 'Music History'],
    episodes: new Array(24),
  },
  {
    id: 'show3',
    title: 'Tech Unplugged',
    hostName: 'Alex Chen',
    description: 'Weekly discussions about technology trends, product launches, and interviews with tech leaders.',
    imageUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1120&q=80',
    isLive: false,
    tags: ['Technology', 'Interviews', 'Reviews'],
    episodes: new Array(18),
  },
  {
    id: 'show4',
    title: 'Morning Motivation',
    hostName: 'Sarah Johnson',
    description: 'Start your day with inspiring stories, productivity tips, and interviews with successful entrepreneurs.',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80',
    isLive: false,
    scheduledTime: new Date(Date.now() + 43200000).toISOString(), // 12 hours from now
    tags: ['Motivation', 'Self-improvement', 'Entrepreneurship'],
    episodes: new Array(35),
  },
  {
    id: 'show5',
    title: 'True Crime Stories',
    hostName: 'Mike Reynolds',
    description: 'In-depth analysis of famous criminal cases with expert interviews and eyewitness accounts.',
    imageUrl: 'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    isLive: false,
    tags: ['True Crime', 'Investigation', 'Documentary'],
    episodes: new Array(42),
  }
];

// Mock data for trending shows
const TRENDING_SHOWS = [
  {
    id: 'trend1',
    title: 'Crypto Today',
    hostName: 'BlockchainBob',
    description: 'Daily updates on cryptocurrency markets, blockchain technology, and NFT trends.',
    imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80',
    isLive: false,
    tags: ['Cryptocurrency', 'Finance', 'Technology'],
    episodes: new Array(52),
  },
  {
    id: 'trend2',
    title: 'Indie Spotlight',
    hostName: 'Melody Finder',
    description: 'Discover the best indie music from around the world with artist interviews and live sessions.',
    imageUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    isLive: true,
    tags: ['Indie', 'Music Discovery', 'Interviews'],
    episodes: new Array(28),
  },
  {
    id: 'trend3',
    title: 'Planet Earth',
    hostName: 'Dr. Emma Green',
    description: 'Exploring environmental issues, climate science, and sustainability initiatives worldwide.',
    imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80',
    isLive: false,
    scheduledTime: new Date(Date.now() + 129600000).toISOString(), // 36 hours from now
    tags: ['Environment', 'Science', 'Sustainability'],
    episodes: new Array(19),
  },
  {
    id: 'trend4',
    title: 'Game On',
    hostName: 'PlayerOne',
    description: 'Weekly gaming news, reviews, and interviews with developers and pro gamers.',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    isLive: false,
    tags: ['Gaming', 'Esports', 'Reviews'],
    episodes: new Array(31),
  }
];

// Mock data for recommended shows
const RECOMMENDED_SHOWS = [
  {
    id: 'rec1',
    title: 'History Uncovered',
    hostName: 'Professor Smith',
    description: 'Deep dives into overlooked historical events and figures that shaped our world.',
    imageUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1174&q=80',
    isLive: false,
    tags: ['History', 'Education', 'Documentary'],
    episodes: new Array(45),
  },
  {
    id: 'rec2',
    title: 'The Foodie Hour',
    hostName: 'Chef Ramiro',
    description: 'Culinary adventures, food history, and interviews with renowned chefs from around the world.',
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    isLive: false,
    scheduledTime: new Date(Date.now() + 172800000).toISOString(), // 48 hours from now
    tags: ['Food', 'Cooking', 'Culture'],
    episodes: new Array(22),
  },
  {
    id: 'rec3',
    title: 'Mind Matters',
    hostName: 'Dr. Lisa Park',
    description: 'Exploring psychology, mental health, and the latest in neuroscience research.',
    imageUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    isLive: false,
    tags: ['Psychology', 'Mental Health', 'Science'],
    episodes: new Array(37),
  },
  {
    id: 'rec4',
    title: 'Global Beats',
    hostName: 'DJ WorldWide',
    description: 'Showcase of music traditions and contemporary sounds from across the globe.',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    isLive: false,
    tags: ['World Music', 'Cultural', 'Entertainment'],
    episodes: new Array(29),
  },
];

// Mock categories
const CATEGORIES = [
  { id: 'cat1', name: 'Music', showCount: 248 },
  { id: 'cat2', name: 'Talk Shows', showCount: 187 },
  { id: 'cat3', name: 'News & Politics', showCount: 173 },
  { id: 'cat4', name: 'Technology', showCount: 154 },
  { id: 'cat5', name: 'Business', showCount: 142 },
  { id: 'cat6', name: 'Education', showCount: 137 },
  { id: 'cat7', name: 'Comedy', showCount: 125 },
  { id: 'cat8', name: 'Science', showCount: 119 },
];

export default function Home() {
  const [activeShow, setActiveShow] = useState<any>(null);
  
  // Handle show selection
  const handleShowSelect = (show: any) => {
    console.log('Selected show:', show);
    // This would typically navigate to the show detail page
    // For now, we'll just log it
  };
  
  // Handle show play
  const handlePlayShow = (show: any) => {
    setActiveShow(show);
    console.log('Playing show:', show);
    // This would typically update the global audio player with the selected show
  };
  
  return (
    <div className="container mx-auto px-4">
      {/* Hero section */}
      <section className="relative mt-8 mb-16 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary-dark/90 z-10"></div>
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
            alt="Wavecaster Hero" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-20 py-24 px-8 md:px-16 flex flex-col items-start">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Your Voice, <br />Amplified
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-xl">
            Create, discover and connect through live radio shows and podcasts. Start broadcasting today and share your passion with the world.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="light" 
              size="lg"
              href="/broadcast"
            >
              Start Broadcasting
            </Button>
            <Button 
              variant="outline-light" 
              size="lg"
              href="/discover"
            >
              Discover Shows
            </Button>
          </div>
        </div>
      </section>
      
      {/* Live & Upcoming Shows */}
      <section className="mb-16">
        <ShowGrid 
          title="Featured Shows"
          shows={FEATURED_SHOWS}
          onShowSelect={handleShowSelect}
          onPlay={handlePlayShow}
          featuredIndex={0}
          cardSize="lg"
          showLoadMore={false}
        />
      </section>
      
      {/* Categories section */}
      <section className="mb-16">
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
      </section>
      
      {/* Trending Shows */}
      <section className="mb-16">
        <ShowGrid 
          title="Trending Shows"
          shows={TRENDING_SHOWS}
          onShowSelect={handleShowSelect}
          onPlay={handlePlayShow}
          cardSize="md"
        />
      </section>
      
      {/* Join the Community */}
      <section className="mb-16 bg-neutral-800/50 border border-white/10 rounded-2xl p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-2/3">
            <h2 className="text-3xl font-bold mb-4">Join the Community</h2>
            <p className="text-white/80 mb-6">
              Connect with listeners and creators who share your interests. Follow your favorite shows, 
              join live chats, and discover new content curated just for you.
            </p>
            
            <div className="flex gap-4">
              <Button 
                variant="primary" 
                size="md"
                href="/signup"
              >
                Sign Up Free
              </Button>
              <Button 
                variant="outline" 
                size="md"
                href="/about"
              >
                Learn More
              </Button>
            </div>
          </div>
          
          <div className="md:w-1/3 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80" 
              alt="Community" 
              className="w-full max-w-sm rounded-lg"
            />
          </div>
        </div>
      </section>
      
      {/* Recommended for You */}
      <section className="mb-16">
        <ShowGrid 
          title="Recommended for You"
          shows={RECOMMENDED_SHOWS}
          onShowSelect={handleShowSelect}
          onPlay={handlePlayShow}
          cardSize="md"
        />
      </section>
      
      {/* How It Works section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">How Wavecaster Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Create Your Station</h3>
            <p className="text-white/70">
              Set up your profile, customize your station, and upload your first episode or schedule a live broadcast.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                <path d="M12 8V16M8 12H16M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Go Live or Upload</h3>
            <p className="text-white/70">
              Stream live with our simple broadcasting tools or upload pre-recorded episodes to build your library.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                <path d="M6 18L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12 22L12 2M12 2L6 8M12 2L18 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Grow Your Audience</h3>
            <p className="text-white/70">
              Connect with listeners, engage through live chat, and build a community around your content.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
