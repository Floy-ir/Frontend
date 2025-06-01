'use client';

import { useEffect } from 'react';
import { isRunningInEitaa, notifyEitaaReady } from '@/utils/eitaa';

interface EitaaInitializerProps {
  autoReady?: boolean;
}

/**
 * Component to initialize the Eitaa mini app
 * This should be placed high in the component tree
 */
export const EitaaInitializer: React.FC<EitaaInitializerProps> = ({ 
  autoReady = true 
}) => {
  useEffect(() => {
    // Check if running in Eitaa and notify it's ready
    if (autoReady && isRunningInEitaa()) {
      notifyEitaaReady();
    }
  }, [autoReady]);

  // This is a utility component that doesn't render anything
  return null;
};

export default EitaaInitializer; 