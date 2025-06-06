'use client';

import type { Metadata } from 'next';
import { useEffect } from 'react';
import { ActiveMenuProvider } from "@/components/ActiveMenuProvider/ActiveMenuProvider";

export default function TripPlannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Add custom styles for trip planner page
  useEffect(() => {
    // Create style element
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      /* Hide footer on trip planner page */
      footer {
        display: none !important;
      }
      
      /* Prevent header from disappearing and fix its position */
      header {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        z-index: 50 !important;
        height: 60px !important; /* Reduced height */
        min-height: 60px !important;
        display: flex !important;
        align-items: center !important;
        background-color: white !important;
        transform: none !important; /* Prevent transform-based hiding */
        opacity: 1 !important; /* Ensure it's visible */
        visibility: visible !important; /* Ensure it's visible */
      }
      
      /* Disable any scroll event handlers that might affect header visibility */
      body {
        overflow: hidden !important; /* Prevent main body scrolling */
      }
      
      /* Adjust container for header spacing */
      main.trip-planner-main {
        position: fixed !important;
        top: 60px !important; /* Equal to header height */
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        overflow: hidden !important;
        height: calc(100vh - 60px) !important; /* Viewport height minus header */
        max-height: calc(100vh - 60px) !important;
        width: 100vw !important;
        padding: 0 !important;
      }
    `;
    
    // Add to head
    document.head.appendChild(styleElement);
    
    // Override any scroll events that might affect header visibility
    const preventHeaderChange = () => {
      const header = document.querySelector('header');
      if (header) {
        header.style.transform = 'none';
        header.style.opacity = '1';
        header.style.visibility = 'visible';
      }
    };
    
    window.addEventListener('scroll', preventHeaderChange);
    
    // Cleanup on unmount
    return () => {
      document.head.removeChild(styleElement);
      window.removeEventListener('scroll', preventHeaderChange);
    };
  }, []);

  return (
    <>
      {/* Custom header for this page only */}
      <ActiveMenuProvider />
      
      {/* Full width container */}
      <div className="w-full h-full">
        {children}
      </div>
    </>
  );
} 