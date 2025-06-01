'use client';

import { ReactNode, useEffect, useState } from 'react';
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

  // Use the same structure for both server and client rendering
  // but only attach the click handler on the client
  return (
    <a 
      href={href}
      onClick={isClient ? handleClick : undefined}
      className={className}
      suppressHydrationWarning
    >
      {children}
    </a>
  );
};

export default EitaaLink; 