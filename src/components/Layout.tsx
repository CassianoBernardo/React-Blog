import { Link, Outlet, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-background)' }}>
      <header style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-card)' }}>
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="text-xl font-bold tracking-tight hover:opacity-70 transition-opacity"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-foreground)' }}
          >
            The Blog
          </Link>
          <nav className="flex items-center gap-5 text-sm font-medium" style={{ color: 'var(--color-muted-fg)' }}>
            <Link to="/" className="hover:text-current transition-colors" style={{ color: 'inherit' }}>Posts</Link>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--color-foreground)' }}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-1.5 rounded text-sm font-medium transition-opacity hover:opacity-80"
                  style={{ backgroundColor: 'var(--color-foreground)', color: 'var(--color-primary-fg)' }}
                >
                  Sair
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-1.5 rounded text-sm font-medium transition-opacity hover:opacity-80"
                style={{ backgroundColor: 'var(--color-foreground)', color: 'var(--color-primary-fg)' }}
              >
                Entrar
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="py-8 text-center text-sm" style={{ borderTop: '1px solid var(--color-border)', color: 'var(--color-muted-fg)' }}>
        © {new Date().getFullYear()} The Blog — Powered by JSONPlaceholder
      </footer>
    </div>
  );
}
