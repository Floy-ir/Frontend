/**
 * Utility functions for Eitaa Mini App integration
 */

// Type definition for the Eitaa WebApp object
interface EitaaWebApp {
  ready: () => void;
  expand: () => void;
  openLink: (url: string, options?: any) => void;
  openEitaaLink: (url: string) => void;
  // Add other methods as needed
}

// Type definition for the Eitaa global object
interface EitaaGlobal {
  WebApp?: EitaaWebApp;
}

// Global Eitaa object
declare global {
  interface Window {
    Eitaa?: EitaaGlobal;
  }
}

/**
 * Check if the app is running inside Eitaa
 */
export const isRunningInEitaa = (): boolean => {
  return typeof window !== 'undefined' && !!window.Eitaa?.WebApp;
};

/**
 * Notify Eitaa that the app is ready to be displayed
 */
export const notifyEitaaReady = (): void => {
  if (isRunningInEitaa()) {
    window.Eitaa?.WebApp?.ready();
  }
};

/**
 * Expand the mini app to maximum available height
 */
export const expandEitaaApp = (): void => {
  if (isRunningInEitaa()) {
    window.Eitaa?.WebApp?.expand();
  }
};

/**
 * Open a link in an external browser
 * @param url URL to open
 * @param options Additional options
 */
export const openExternalLink = (url: string, options?: any): void => {
  if (isRunningInEitaa()) {
    window.Eitaa?.WebApp?.openLink(url, options);
  } else {
    // Fallback for when not running in Eitaa
    window.open(url, '_blank');
  }
};

/**
 * Open an Eitaa link within the Eitaa app
 * @param url Eitaa URL to open
 */
export const openEitaaLink = (url: string): void => {
  if (isRunningInEitaa()) {
    window.Eitaa?.WebApp?.openEitaaLink(url);
  } else {
    // Fallback for when not running in Eitaa
    window.open(url, '_blank');
  }
}; 