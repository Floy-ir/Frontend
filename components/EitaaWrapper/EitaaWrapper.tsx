'use client';

import { useEffect, useState, ReactNode } from 'react';
import { isRunningInEitaa, notifyEitaaReady, expandEitaaApp } from '@/utils/eitaa';

interface EitaaWrapperProps {
  children: ReactNode;
  autoReady?: boolean;
  autoExpand?: boolean;
}

/**
 * A wrapper component that properly initializes the Eitaa mini app
 * and handles client-side only rendering to prevent hydration mismatches
 */
const EitaaWrapper: React.FC<EitaaWrapperProps> = ({
  children,
  autoReady = true,
  autoExpand = false
}) => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    // Mark as client-side rendered
    setIsClient(true);
    
    // Initialize Eitaa app
    if (isRunningInEitaa()) {
      if (autoReady) {
        notifyEitaaReady();
      }
      
      if (autoExpand) {
        expandEitaaApp();
      }
    }
  }, [autoReady, autoExpand]);
  
  return (
    <>
      {isClient ? children : null}
    </>
  );
};

export default EitaaWrapper; 