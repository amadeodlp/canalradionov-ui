'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@components/atoms/Button/Button';

export const MainNavigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') {
      return false;
    }
    return pathname?.startsWith(path);
  };
  
  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Live', path: '/live' },
    { label: 'Discover', path: '/discover' },
    { label: 'Library', path: '/library' },
  ];
  
  // Auth nav items
  const authNavItems = isLoggedIn 
    ? [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Profile', path: '/profile' },
      ]
    : [
        { label: 'Sign In', path: '/login' },
        { label: 'Sign Up', path: '/signup' },
      ];
  
  return (
    <nav className="bg-neutral-800/90 backdrop-blur-sm sticky top-0 z-50 border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-white">
              Wave<span className="text-primary">caster</span>
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Main navigation links */}
            <div className="flex space-x-8">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`text-sm font-medium transition ${
                    isActive(item.path) 
                      ? 'text-primary' 
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            
            {/* Auth navigation */}
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  <Link href="/broadcast">
                    <Button 
                      variant="primary" 
                      size="sm"
                      leftIcon={
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="3" fill="currentColor" />
                          <path d="M19.4 10C19.7 10.6 20 11.3 20 12C20 12.7 19.8 13.4 19.4 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path d="M16.7 7.70001C17.6 8.00001 18.5 8.90001 19.2 9.90001" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path d="M4.6 10C4.3 10.6 4 11.3 4 12C4 12.7 4.2 13.4 4.6 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path d="M7.3 7.70001C6.4 8.00001 5.5 8.90001 4.8 9.90001" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path d="M7 16.7C8.2 17.5 10 18 12 18C14 18 15.8 17.5 17 16.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      }
                    >
                      Broadcast
                    </Button>
                  </Link>
                  
                  {/* User menu (simplified) */}
                  <div className="relative">
                    <Link href="/dashboard" className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-white border border-white/20">
                        DJ
                      </div>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-medium text-white/80 hover:text-white transition">
                    Sign In
                  </Link>
                  <Link href="/signup">
                    <Button variant="primary" size="sm">
                      Sign Up Free
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              className="text-white p-2"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/10">
          <div className="px-4 py-3 space-y-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                href={item.path}
                className={`block py-2 px-3 rounded-md text-base font-medium ${
                  isActive(item.path) 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-white/80 hover:bg-white/5 hover:text-white'
                }`}
                onClick={closeMobileMenu}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="border-t border-white/10 pt-2 mt-2">
              {authNavItems.map(item => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`block py-2 px-3 rounded-md text-base font-medium ${
                    isActive(item.path) 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-white/80 hover:bg-white/5 hover:text-white'
                  }`}
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
              ))}
              
              {isLoggedIn && (
                <Link
                  href="/broadcast"
                  className="block py-2 px-3 rounded-md text-base font-medium bg-primary/10 text-primary mt-2"
                  onClick={closeMobileMenu}
                >
                  Start Broadcasting
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default MainNavigation;
