import { BrowserRouter, Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Navbar from './components/Navbar';
import Community from './pages/Community';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import VehicleDetailPage from './pages/VehicleDetail';

type NavigateFn = (page: string, vehicleId?: string) => void;

function VehicleDetailRoute({ onNavigate }: { onNavigate: NavigateFn }) {
  const { id } = useParams();

  if (!id) {
    return (
      <div className="min-h-screen p-8">
        <button onClick={() => window.history.back()} className="mb-4 text-sm text-blue-600">â† Volver</button>
        <h1 className="text-2xl font-bold">VehÃ­culo no encontrado</h1>
      </div>
    );
  }

  return <VehicleDetailPage vehicleId={id} onNavigate={(page) => onNavigate(page)} />;
}

/*
 InnerApp usa hooks de router para construir handleNavigate que esperan tus componentes.
 Pasa onNavigate a Home, Catalog y Navbar â€” asÃ­ los botones existentes seguirÃ¡n llamando onNavigate.
*/
function InnerApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/panel-admin');

  const handleNavigate = (page: string, vehicleId?: string) => {
    switch (page) {
      case 'home':
        navigate('/');
        break;
      case 'catalog':
        navigate('/catalog');
        break;
      case 'contact':
        navigate('/contact');
        break;
      case 'vehicle-detail':
        if (vehicleId) navigate(`/vehicle/${vehicleId}`);
        break;
      case 'community':
        navigate('/community');
        break;
      default:
        navigate('/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // determina pestaÃ±a activa para el navbar
  const pathname = location.pathname;
  const current =
    pathname === '/' ? 'home' :
    pathname.startsWith('/catalog') ? 'catalog' :
    pathname.startsWith('/contact') ? 'contact' :
    pathname.startsWith('/community') ? 'community' : 'home';

  return (
    <>
      {!isAdminRoute && <Navbar onNavigate={handleNavigate} current={current} />}
      <Routes>
        <Route path="/" element={<Home onNavigate={handleNavigate} />} />
        <Route path="/catalog" element={<Catalog onNavigate={handleNavigate} />} />
        <Route path="/vehicle/:id" element={<VehicleDetailRoute onNavigate={handleNavigate} />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/community" element={<Community onNavigate={handleNavigate} />} />
        <Route path="/panel-admin" element={<Admin />} />
      </Routes>
      {!isAdminRoute && (
        <a
          href="https://wa.me/573245799091?text=Hola%20quiero%20m%C3%A1s%20informaci%C3%B3n"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 w-16 h-16 flex items-center justify-center drop-shadow-2xl hover:scale-110 transition-transform duration-200"
          aria-label="Escribenos por WhatsApp"
        >
          <svg viewBox="0 0 48 48" className="w-16 h-16" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="24" fill="#25D366"/>
            <path fill="#fff" d="M24 10.5C16.55 10.5 10.5 16.55 10.5 24c0 2.38.65 4.7 1.87 6.73L10.5 37.5l6.97-1.83A13.44 13.44 0 0 0 24 37.5c7.45 0 13.5-6.05 13.5-13.5S31.45 10.5 24 10.5Zm7.53 18.86c-.31.87-1.8 1.66-2.48 1.72-.63.06-1.23.28-4.14-.86-3.49-1.36-5.73-4.93-5.9-5.16-.17-.23-1.38-1.84-1.38-3.51s.87-2.49 1.2-2.84c.31-.33.68-.41.9-.41.23 0 .45.01.65.02.21.01.49-.08.77.59.31.7 1.04 2.55 1.13 2.74.1.18.16.4.03.64-.13.24-.2.39-.38.6-.18.21-.38.47-.54.63-.18.18-.37.38-.16.74.21.35.94 1.55 2.02 2.51 1.39 1.24 2.56 1.62 2.92 1.8.35.18.56.15.77-.09.21-.24.9-1.05 1.14-1.41.24-.35.48-.29.81-.17.33.12 2.1 .99 2.46 1.17.35.18.59.27.67.42.09.15.09.86-.22 1.73Z"/>
          </svg>
        </a>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <InnerApp />
    </BrowserRouter>
  );
}
