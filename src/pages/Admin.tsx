import { useState } from 'react';
import { LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AdminVehicles from '../components/admin/AdminVehicles';
import AdminArticles from '../components/admin/AdminArticles';
import AdminTestimonials from '../components/admin/AdminTestimonials';
import AdminContacts from '../components/admin/AdminContacts';

export default function Admin() {
  const { user, signIn, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'vehicles' | 'articles' | 'testimonials' | 'contacts'>('vehicles');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setError('');

    try {
      await signIn(email, password);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoggingIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 text-orange-600 rounded-full mb-4">
              <LogIn className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Panel de Administración</h1>
            <p className="text-gray-600">Inicia sesión para continuar</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="admin@hpautos.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loggingIn ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <p className="text-gray-300 mt-2">Gestiona tu catálogo de vehículos y contenido</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex overflow-x-auto border-b border-gray-200">
            <button
              onClick={() => setActiveTab('vehicles')}
              className={`px-6 py-4 font-semibold whitespace-nowrap ${
                activeTab === 'vehicles'
                  ? 'border-b-2 border-orange-600 text-orange-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Vehículos
            </button>
            <button
              onClick={() => setActiveTab('articles')}
              className={`px-6 py-4 font-semibold whitespace-nowrap ${
                activeTab === 'articles'
                  ? 'border-b-2 border-orange-600 text-orange-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Artículos
            </button>
            <button
              onClick={() => setActiveTab('testimonials')}
              className={`px-6 py-4 font-semibold whitespace-nowrap ${
                activeTab === 'testimonials'
                  ? 'border-b-2 border-orange-600 text-orange-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Testimonios
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`px-6 py-4 font-semibold whitespace-nowrap ${
                activeTab === 'contacts'
                  ? 'border-b-2 border-orange-600 text-orange-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Contactos
            </button>
          </div>
        </div>

        {activeTab === 'vehicles' && <AdminVehicles />}
        {activeTab === 'articles' && <AdminArticles />}
        {activeTab === 'testimonials' && <AdminTestimonials />}
        {activeTab === 'contacts' && <AdminContacts />}
      </div>
    </div>
  );
}
