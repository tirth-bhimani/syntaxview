"use client"

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const Breadcrumb = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(segment => segment);

  return (
    <nav className="flex items-center text-sm text-gray-400  p-3 rounded-lg bg-transparent">
      <Link href="/" className="hover:text-white">
        Home
      </Link>
      {pathSegments.map((segment, index) => {
        const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
        const isLast = index === pathSegments.length - 1;
        return (
          <React.Fragment key={href}>
            <ChevronRight className="h-4 w-4 mx-1" />
            {isLast ? (
              <span className="font-semibold text-white">{segment.charAt(0).toUpperCase() + segment.slice(1)}</span>
            ) : (
              <Link href={href} className="hover:text-white">
                {segment.charAt(0).toUpperCase() + segment.slice(1)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
