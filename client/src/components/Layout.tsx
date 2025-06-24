import type { ReactNode } from 'react';
import NavegacionUsuario from './NavegacionUsuario';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavegacionUsuario />
      <main className="py-6">
        {children}
      </main>
    </div>
  );
}

export default Layout;