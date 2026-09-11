'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationProps {
  className?: string;
}

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/report', label: 'Report Waste' },
  { href: '/reports', label: 'My Reports' },
  { href: '/map', label: 'Map' },
];

export function Navigation({ className = '' }: NavigationProps) {
  const pathname = usePathname();

  return (
    <nav className={className} aria-label="Main navigation">
      <ul className="flex items-center gap-6">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-md px-2 py-1 ${
                  isActive
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
