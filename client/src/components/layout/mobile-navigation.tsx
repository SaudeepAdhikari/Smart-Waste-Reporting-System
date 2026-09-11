'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  onLogout: () => void;
}

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/report', label: 'Report Waste' },
  { href: '/reports', label: 'My Reports' },
  { href: '/map', label: 'Map' },
];

export function MobileNavigation({ isOpen, onClose, isAuthenticated, isLoading, onLogout }: MobileNavigationProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <div className="md:hidden border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      <nav className="container mx-auto px-4 py-4" aria-label="Mobile navigation">
        <ul className="flex flex-col gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    isActive
                      ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
          {!isLoading && isAuthenticated ? (
            <>
              <li className="pt-4 border-t border-zinc-200 dark:border-zinc-800 mt-2">
                <Link
                  href="/profile"
                  onClick={onClose}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="block w-full text-left rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="pt-4 border-t border-zinc-200 dark:border-zinc-800 mt-2">
                <Link
                  href="/login"
                  onClick={onClose}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  onClick={onClose}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}
