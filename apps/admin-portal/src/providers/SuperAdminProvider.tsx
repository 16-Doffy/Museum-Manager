import { ReactNode } from 'react';

interface SuperAdminProviderProps {
  children: ReactNode;
}

/**
 * SuperAdminProvider - Provides context for SuperAdmin role checking
 * 
 * Note: This provider does NOT handle redirects directly.
 * Redirect logic is handled in DefaultLayout component.
 * This keeps the provider simple and allows it to be used outside of Router context.
 */
export default function SuperAdminProvider({ children }: SuperAdminProviderProps) {
  // Simply pass through children
  // Role checking and redirects are handled in DefaultLayout
  return <>{children}</>;
}

