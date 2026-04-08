import { useState } from 'react';
import type { ComponentType, FormEvent } from 'react';
import { ShieldCheck, Car, FileText, Star, Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AdminVehicles from '../components/admin/AdminVehicles';
import AdminArticles from '../components/admin/AdminArticles';
import AdminTestimonials from '../components/admin/AdminTestimonials';
import AdminContacts from '../components/admin/AdminContacts';

type TabKey = 'vehicles' | 'articles' | 'testimonials' | 'contacts';

export default function Admin() {
  const { user, signIn, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('vehicles');

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setError('');

    try {
      await signIn(email, password);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesion';
      setError(message);
    } finally {
      setLoggingIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0b0b0f] text-slate-100 flex items-center justify-center p-4">
        <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_top_left,rgba(255,0,0,0.35),transparent_35%)]" />
        <div className="relative w-full max-w-md bg-black/60 border border-white/10 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-white/10 flex items-center justify-center">
              <img src="/hp-autos-logo.png" alt="H & P AUTOS" className="h-16 w-auto object-contain" />
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-2">Panel de Administracion</h1>
            <p className="text-slate-300">Inicia sesion para continuar</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-200 mb-2">
                Correo electronico
              </label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="admin@hpautos.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-200 mb-2">
                Contrasena
              </label>
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 shadow-[0_10px_25px_rgba(239,68,68,0.35)]"
            >
              {loggingIn ? 'Iniciando sesion...' : 'Iniciar Sesion'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-slate-100">
      <header className="bg-black/70 border-b border-white/10 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src="/hp-autos-logo.png" alt="H & P AUTOS" className="h-12 w-auto object-contain" />
            <div>
              <h1 className="text-2xl font-extrabold text-white">Panel de Administracion</h1>
              <p className="text-slate-300 text-sm flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-red-400" />
                Gestion general del negocio
              </p>
            </div>
          </div>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al sitio
          </a>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
        <div className="bg-black/60 border border-white/10 rounded-2xl shadow-2xl mb-8">
          <div className="flex flex-wrap items-center gap-2 border-b border-white/10 p-3">
            <TabButton
              label="Vehiculos"
              icon={Car}
              active={activeTab === 'vehicles'}
              onClick={() => setActiveTab('vehicles')}
            />
            <TabButton
              label="Articulos"
              icon={FileText}
              active={activeTab === 'articles'}
              onClick={() => setActiveTab('articles')}
            />
            <TabButton
              label="Testimonios"
              icon={Star}
              active={activeTab === 'testimonials'}
              onClick={() => setActiveTab('testimonials')}
            />
            <TabButton
              label="Contactos"
              icon={Mail}
              active={activeTab === 'contacts'}
              onClick={() => setActiveTab('contacts')}
            />
          </div>
          <div className="p-6">
            {activeTab === 'vehicles' && <AdminVehicles />}
            {activeTab === 'articles' && <AdminArticles />}
            {activeTab === 'testimonials' && <AdminTestimonials />}
            {activeTab === 'contacts' && <AdminContacts />}
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  icon: ComponentType<{ className?: string }>;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
        active
          ? 'bg-red-600 text-white shadow-[0_8px_20px_rgba(239,68,68,0.35)]'
          : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}



