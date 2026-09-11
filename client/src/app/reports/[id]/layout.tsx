import type { ReactNode } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function ReportDetailLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">{children}</div>
    </ProtectedRoute>
  );
}
