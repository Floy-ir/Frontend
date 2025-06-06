'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function TripPlannerPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [activeView, setActiveView] = useState<'chat' | 'itinerary'>('chat');

  // Check for mobile view on mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  return (
    // Full screen main container with trip-planner-main class for custom styling
    <main className="trip-planner-main">
      {isMobile && (
        <div className="px-4 py-2 flex justify-center">
          <Button
            onClick={() => setActiveView(activeView === 'chat' ? 'itinerary' : 'chat')}
            className="w-full max-w-sm"
          >
            Switch to {activeView === 'chat' ? 'Itinerary' : 'Chat'}
          </Button>
        </div>
      )}
      
      <div className={`flex flex-col md:flex-row gap-4 p-4 h-full`}>
        {/* Chat Pane - Left Column (2/5 width on desktop, full width on mobile when active) */}
        <div 
          className={`
            ${isMobile ? (activeView === 'chat' ? 'flex' : 'hidden') : 'flex'} 
            flex-col w-full md:w-2/5 bg-slate-100 rounded-lg p-4 overflow-y-auto
          `}
        >
          <h2 className="text-xl font-semibold mb-4">Chat</h2>
          <div className="flex-1 bg-white rounded p-3 shadow-inner">
            {/* Chat content will go here */}
            <p className="text-gray-500">Chat messages will appear here...</p>
          </div>
        </div>
        
        {/* Itinerary Pane - Right Column (3/5 width on desktop, full width on mobile when active) */}
        <div 
          className={`
            ${isMobile ? (activeView === 'itinerary' ? 'flex' : 'hidden') : 'flex'}
            flex-col w-full md:w-3/5 bg-slate-100 rounded-lg p-4 overflow-y-auto
          `}
        >
          <h2 className="text-xl font-semibold mb-4">Itinerary</h2>
          <div className="flex-1 bg-white rounded p-3 shadow-inner">
            {/* Itinerary content will go here */}
            <p className="text-gray-500">Your trip itinerary will appear here...</p>
          </div>
        </div>
      </div>
    </main>
  );
} 