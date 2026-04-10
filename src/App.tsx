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
          <img src="/botonwhatsapp.png" alt="WhatsApp" className="w-16 h-16 object-contain" />
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
