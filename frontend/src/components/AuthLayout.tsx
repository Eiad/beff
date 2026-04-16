import type { ReactNode } from 'react';
import AuthVisualPanel from './AuthVisualPanel';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: form */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[400px]">{children}</div>
      </div>
      {/* Right: branded visual */}
      <AuthVisualPanel />
    </div>
  );
}
