'use client';

import { ReactNode, useState, useEffect } from 'react';
import { openExternalLink } from '@/utils/eitaa';

interface EitaaLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  options?: any;
}

/**
 * A link component that uses Eitaa's openLink method when running inside Eitaa
 * and falls back to regular links otherwise
 */
export const EitaaLink: React.FC<EitaaLinkProps> = ({
  href,
  children,
  className = '',
  options,
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    openExternalLink(href, options);
  };

  // When rendering on the server or during initial hydration, render a placeholder
  if (!isClient) {
    return (
      <span className={className}>
        {children}
      </span>
    );
  }

  // On the client, after hydration, render the actual link
  return (
    <a 
      href={href}
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
};

export default EitaaLink; 