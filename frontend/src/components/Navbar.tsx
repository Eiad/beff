import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Leaf } from 'lucide-react';
import { Button } from './ui/button';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-serif text-xl font-semibold text-gray-900">
          <Leaf className="text-emerald-600" size={20} />
          Beff
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <a href="/#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Features
          </a>
          <a href="/#about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            About
          </a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm">Login</Button>
          </Link>
          <Link to="/register">
            <Button size="sm" className="btn-primary">
              Join Early Access
            </Button>
          </Link>
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-3">
          <a href="/#features" onClick={() => setMenuOpen(false)} className="text-sm text-gray-600 py-1">Features</a>
          <a href="/#about" onClick={() => setMenuOpen(false)} className="text-sm text-gray-600 py-1">About</a>
          <Link to="/login" onClick={() => setMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start">Login</Button>
          </Link>
          <Link to="/register" onClick={() => setMenuOpen(false)}>
            <Button className="w-full btn-primary">
              Join Early Access
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
