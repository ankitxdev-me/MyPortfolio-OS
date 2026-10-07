import React from 'react';
import { AuthProvider, useAuth, type AuthUser } from '@/lib/auth/AuthContext';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

// ─── Inner Shell (consumes AuthContext) ──────────────────────────────────────

interface InnerShellProps {
  currentPath: string;
  title: string;
  children?: React.ReactNode;
  userName: string;
}

const InnerShell: React.FC<InnerShellProps> = ({ currentPath, title, children, userName }) => {
  const { logout } = useAuth();

  return (
    <>
      {/* Sidebar Shell — receives logout from AuthContext */}
      <DashboardSidebar currentPath={currentPath} onLogout={logout} />

      {/* Main CMS Shell */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <DashboardHeader title={title} userName={userName} />
        <main
          id="main-content"
          className="flex-1 p-6 md:p-8 overflow-y-auto focus:outline-none bg-background/50"
        >
          {children}
        </main>
      </div>
    </>
  );
};

// ─── Auth Shell (provides AuthContext) ────────────────────────────────────────

export interface DashboardAuthShellProps {
  /** Pre-hydrated user from SSR — eliminates loading flash */
  initialUser: AuthUser;
  /** Pre-resolved permissions from SSR */
  initialPermissions: string[];
  /** Current URL pathname for sidebar active state */
  currentPath: string;
  /** Page title for header breadcrumb */
  title: string;
  /** Slot content from Astro (static HTML) */
  children?: React.ReactNode;
}

/**
 * DashboardAuthShell
 *
 * Top-level React client island for all dashboard pages.
 * Mounts AuthProvider pre-hydrated with SSR user data (no loading flash),
 * then renders sidebar + header + page content.
 *
 * All child React components can call useAuth() to access auth state.
 */
export const DashboardAuthShell: React.FC<DashboardAuthShellProps> = ({
  initialUser,
  initialPermissions,
  currentPath,
  title,
  children,
}) => {
  return (
    <AuthProvider initialUser={initialUser} initialPermissions={initialPermissions}>
      <InnerShell
        currentPath={currentPath}
        title={title}
        userName={initialUser?.name ?? 'Ankit Gupta'}
      >
        {children}
      </InnerShell>
    </AuthProvider>
  );
};
