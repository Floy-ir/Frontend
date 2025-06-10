'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react'; // Import icons
import { englishToFarsiNumber } from '@/utils/numbers';

export default function TripPlannerPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [activeView, setActiveView] = useState<'chat' | 'itinerary'>('chat');
  const [showMoreDetails, setShowMoreDetails] = useState(false);

  // Sample trip data (in a real app, this would come from an API or context)
  const tripData = {
    destination: 'تهران به مشهد',
    startDate: '۱۵ مهر',
    endDate: '۲۵ مهر',
    travelers: 2,
    budget: '۳,۰۰۰,۰۰۰ تومان',
    style: 'سفر طبیعتی',
    pace: 'متوسط',
    accessibility: 'متوسط',
  };

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

  const toggleMoreDetails = () => {
    setShowMoreDetails(!showMoreDetails);
  };

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
          <div className="flex-1 bg-white rounded p-3">
            {/* Chat content will go here */}
            <p className="text-gray-500">Chat messages will appear here...</p>
          </div>
        </div>
        
        {/* Itinerary Pane - Right Column (3/5 width on desktop, full width on mobile when active) */}
        <div 
          className={`
            ${isMobile ? (activeView === 'itinerary' ? 'flex' : 'hidden') : 'flex'}
            flex-col w-full md:w-3/5 bg-slate-100 rounded-lg p-4 overflow-y-auto relative
          `}
        >
          {/* Sticky header with trip details */}
          <div className="sticky top-0 z-10 bg-white rounded-lg mb-4 overflow-hidden">
            {/* Core trip information */}
            <div className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex flex-row gap-4 items-center">
                  <h2 className="text-xl font-bold text-gray-800">{tripData.destination}</h2>
                  <div className="text-sm text-gray-600">
                    {tripData.startDate} - {tripData.endDate}
                  </div>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                    {englishToFarsiNumber(tripData.travelers.toString())} مسافر
                  </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleMoreDetails}
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors text-xs"
                >
                  {showMoreDetails ? (
                    <>جزئیات کمتر <ChevronUp className="ml-1 h-4 w-4" /></>
                  ) : (
                    <> جزئیات بیشتر<ChevronDown className="ml-1 h-4 w-4" /></>
                  )}
                </Button>
                </div>
              </div>
          
            </div>
            
            {/* Expandable trip details panel */}
            <div 
              className={`
                overflow-hidden transition-all duration-300 ease-in-out
                ${showMoreDetails ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}
              `}
            >
              <div className="p-4 pt-0 bg-gray-50 border-t border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-xs text-gray-500">بودجه</span>
                    <p className="font-medium">{tripData.budget}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">سبک</span>
                    <p className="font-medium">{tripData.style}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">سرعت</span>
                    <p className="font-medium">{tripData.pace}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">دسترسی</span>
                    <p className="font-medium">{tripData.accessibility}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Itinerary</h2>
          <div className="flex-1 bg-white rounded p-3">
            {/* Itinerary content will go here */}
            <p className="text-gray-500">Your trip itinerary will appear here...</p>
          </div>
        </div>
      </div>
    </main>
  );
} 