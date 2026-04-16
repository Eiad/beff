import { type ReactNode } from 'react';
import Sidebar from './Sidebar';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Sidebar />
      <div className="lg:ml-[250px] transition-all duration-300">
        {children}
      </div>
    </div>
  );
}
