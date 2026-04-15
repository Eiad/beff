import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Leaf } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-serif text-xl font-semibold text-gray-900">
          <Leaf className="text-primary-brand" size={20} />
          B-eff
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {!user && (
            <>
              <a href="/#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="/#about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                About
              </a>
            </>
          )}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <Link to="/profile">
                <Button variant="ghost" size="sm">Profile</Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-primary-brand hover:bg-primary-brand-dark text-white">
                  Join Early Access
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-3">
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
              </Link>
              <Link to="/profile" onClick={() => setMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">Profile</Button>
              </Link>
              <Button variant="outline" className="w-full" onClick={handleLogout}>Log out</Button>
            </>
          ) : (
            <>
              <a href="/#features" onClick={() => setMenuOpen(false)} className="text-sm text-gray-600 py-1">Features</a>
              <a href="/#about" onClick={() => setMenuOpen(false)} className="text-sm text-gray-600 py-1">About</a>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">Login</Button>
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>
                <Button className="w-full bg-primary-brand hover:bg-primary-brand-dark text-white">
                  Join Early Access
                </Button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
