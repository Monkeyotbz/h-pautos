import { useState } from 'react';
import { Car, Menu, X, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type HeaderProps = {
  currentPage: string;
  onNavigate: (page: string) => void;
};

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const navItems = [
    { label: 'Inicio', value: 'home' },
    { label: 'Catálogo', value: 'catalog' },
    { label: 'Comunidad', value: 'community' },
    { label: 'Contacto', value: 'contact' },
  ];

  if (user) {
    navItems.push({ label: 'Admin', value: 'admin' });
  }

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <Car className="h-8 w-8 text-orange-500" />
            <span className="text-xl font-bold">H &amp; P AUTOS</span>
          </button>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => onNavigate(item.value)}
                className={`transition-colors hover:text-orange-500 ${
                  currentPage === item.value ? 'text-orange-500 font-semibold' : ''
                }`}
              >
                {item.label}
              </button>
            ))}
            {user && (
              <button
                onClick={() => signOut()}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Salir</span>
              </button>
            )}
          </nav>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700">
          <nav className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => {
                  onNavigate(item.value);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  currentPage === item.value
                    ? 'bg-orange-500 text-white'
                    : 'hover:bg-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}
            {user && (
              <button
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Salir
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
