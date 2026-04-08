import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#2b2b2b] via-[#3a3a3a] to-white text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & description - centered on mobile, left on desktop */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <button
              onClick={() => (window.location.href = '/')}
              aria-label="Inicio"
              className="mb-4"
            >
              {/* logo más pequeño en móvil, más grande en desktop */}
              <img
                src="/hp-autos-logo.png"
                alt="H & P AUTOS"
                className="h-40 md:h-50 w-auto object-contain"
              />
            </button>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-white font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-red-600 transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="/catalog" className="hover:text-red-600 transition-colors">
                  Catálogo
                </a>
              </li>
              <li>
                <a href="/community" className="hover:text-red-600 transition-colors">
                  Comunidad
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-red-600 transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto - centrado en móvil */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-semibold mb-4">Contacto</h3>
            <ul className="space-y-5 text-sm">
              <li className="flex items-center justify-center md:justify-start space-x-2">
                <Phone className="h-4 w-4 text-red-600" />
                <span>324 579 9091</span>
              </li>
              <li className="flex items-center justify-center md:justify-start space-x-2">
                <Mail className="h-4 w-4 text-red-600" />
                <span>phautos2025@gmail.com</span>
              </li>
              <li className="flex items-start justify-center md:justify-start space-x-2">
                <MapPin className="h-4 w-4 text-red-600 mt-1" />
                <span className="leading-tight">Antioquia<br />Area Metropolitana </span>
              </li>
            </ul>
          </div>

          {/* Redes & horario - centrado en móvil */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-semibold mb-4">Síguenos</h3>
            <div className="flex justify-center md:justify-start space-x-3 mb-4">
              <a
                href="https://www.facebook.com/share/14brdddxfii/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 p-2 rounded-lg hover:bg-red-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://www.instagram.com/phautos_compra_venta?igsh=aDlkdW8waHZoem1t"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 p-2 rounded-lg hover:bg-red-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-2 text-sm">Horario</h4>
              <p className="text-sm">Lun - Vie: 9:00 - 19:00</p>
              <p className="text-sm">Sábado: 10:00 - 15:00</p>
            </div>
          </div>
        </div>

        {/* copyright - centrado en móvil */}
        <div className="border-t border-slate-800 mt-8 pt-6 text-sm text-center">
          <p className="text-black">&copy; {new Date().getFullYear()} H &amp; P AUTOS. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
