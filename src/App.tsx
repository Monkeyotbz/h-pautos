import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Navbar from './components/Navbar';
import Community from './pages/Community';
import Contact from './pages/Contact';
const CommunityAny: any = Community;

// Simple vehicle detail usando params
function VehicleDetail() {
  const { id } = useParams();
  return (
    <div className="min-h-screen p-8">
      <button onClick={() => window.history.back()} className="mb-4 text-sm text-blue-600">← Volver</button>
      <h1 className="text-2xl font-bold">Detalle vehículo {id}</h1>
      <p>Información del vehículo ...</p>
    </div>
  );
}

/*
 InnerApp usa hooks de router para construir handleNavigate que esperan tus componentes.
 Pasa onNavigate a Home, Catalog y Navbar — así los botones existentes seguirán llamando onNavigate.
*/
function InnerApp() {
  const navigate = useNavigate();
  const location = useLocation();

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

  // determina pestaña activa para el navbar
  const pathname = location.pathname;
  const current =
    pathname === '/' ? 'home' :
    pathname.startsWith('/catalog') ? 'catalog' :
    pathname.startsWith('/contact') ? 'contact' :
    pathname.startsWith('/community') ? 'community' : 'home';

  return (
    <>
      <Navbar onNavigate={handleNavigate} current={current} />
      <Routes>
        <Route path="/" element={<Home onNavigate={handleNavigate} />} />
        <Route path="/catalog" element={<Catalog onNavigate={handleNavigate} />} />
        <Route path="/vehicle/:id" element={<VehicleDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/community" element={<CommunityAny onNavigate={handleNavigate} />} />
      </Routes>
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
