import React, { useState } from 'react';

type NavbarProps = {
  onNavigate: (page: string, vehicleId?: string) => void;
  current?: string;
};

export default function Navbar({ onNavigate, current }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass = (name: string) =>
    `px-3 py-2 rounded-md font-medium ${
      current === name ? 'bg-red-600 text-white' : 'text-slate-200 hover:bg-red-600 hover:text-white'
    }`;

  return (
    <nav className="bg-black shadow relative">
      <div className="max-w-10xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Left spacer to balance layout */}
          <div className="w-24" />

          {/* Center: nav links (desktop) */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-center space-x-4">
              <button className={linkClass('home')} onClick={() => onNavigate('home')}>
                Inicio
              </button>
              <button className={linkClass('catalog')} onClick={() => onNavigate('catalog')}>
                Catálogo
              </button>
              {/* Logo centrado en el menú */}
              <button
                onClick={() => { setMobileOpen(false); onNavigate('home'); }}
                className="px-3 py-2 rounded-md hover:bg-white/10 transition"
                aria-label="H & P AUTOS"
              >
                <img src="/hp-autos-logo.png" alt="H & P AUTOS" className="h-16 w-auto object-contain drop-shadow-lg" />
              </button>
              <button className={linkClass('community')} onClick={() => onNavigate('community')}>
                Comunidad
              </button>
              <button className={linkClass('contact')} onClick={() => onNavigate('contact')}>
                Contacto
              </button>
            </div>
          </div>

          {/* Right: mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileOpen((s) => !s)}
              aria-expanded={mobileOpen}
              aria-label="Abrir menú"
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-200 hover:text-white hover:bg-red-600 focus:outline-none"
            >
              {mobileOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Empty placeholder to keep spacing on desktop so center stays centered */}
          <div className="hidden md:block w-24" />
        </div>
      </div>

      {/* Mobile menu: lista vertical */}
      {mobileOpen && (
        <div className="md:hidden bg-black border-t border-gray-800">
          <div className="max-w-10xl mx-auto px-6 sm:px-8 lg:px-10">
            <ul className="flex flex-col py-2">
              <li>
                <button
                  onClick={() => { setMobileOpen(false); onNavigate('home'); }}
                  className="w-full text-left px-4 py-3 text-slate-200 hover:bg-red-600 hover:text-white border-b border-gray-800"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setMobileOpen(false); onNavigate('catalog'); }}
                  className="w-full text-left px-4 py-3 text-slate-200 hover:bg-red-600 hover:text-white border-b border-gray-800"
                >
                  Catálogo
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setMobileOpen(false); onNavigate('community'); }}
                  className="w-full text-left px-4 py-3 text-slate-200 hover:bg-red-600 hover:text-white border-b border-gray-800"
                >
                  Comunidad
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setMobileOpen(false); onNavigate('contact'); }}
                  className="w-full text-left px-4 py-3 text-slate-200 hover:bg-red-600 hover:text-white"
                >
                  Contacto
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
}
