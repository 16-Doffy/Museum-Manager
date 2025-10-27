import { cn } from '@/lib/cn';
import { createContext, useContext, useState } from 'react';

interface SidebarContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  variant: 'sidebar' | 'floating' | 'inset';
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function SidebarProvider({ children, defaultOpen = true }: SidebarProviderProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <SidebarContext.Provider value={{ open, setOpen, variant: 'inset' }}>
      <div className="flex min-h-screen w-full bg-background">{children}</div>
    </SidebarContext.Provider>
  );
}

export function SidebarInset({ className, children, ...props }: React.ComponentProps<'main'>) {
  return (
    <main className={cn('flex flex-1 flex-col bg-background', className)} {...props}>
      {children}
    </main>
  );
}

export function SidebarTrigger({ className, ...props }: React.ComponentProps<'button'>) {
  const { open, setOpen } = useSidebar();

  return (
    <button
      onClick={() => setOpen(!open)}
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        'h-9 w-9',
        className
      )}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M9 3v18" />
      </svg>
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  );
}

