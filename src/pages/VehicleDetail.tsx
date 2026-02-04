import { useEffect, useState } from 'react';
import {
  Car,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  Palette,
  CheckCircle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { supabase, Vehicle } from '../lib/supabase';

type VehicleDetailProps = {
  vehicleId: string;
  onNavigate: (page: string) => void;
};

export default function VehicleDetail({ vehicleId, onNavigate }: VehicleDetailProps) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadVehicle();
  }, [vehicleId]);

  const loadVehicle = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', vehicleId)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setVehicle(data);
      }
    } catch (error) {
      console.error('Error loading vehicle:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Vehículo no encontrado</h2>
          <button
            onClick={() => onNavigate('catalog')}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Ver Catálogo
          </button>
        </div>
      </div>
    );
  }

  const images = vehicle.images && vehicle.images.length > 0 ? vehicle.images : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => onNavigate('catalog')}
          className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Volver al catálogo</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            {images.length > 0 ? (
              <div className="relative">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-4">
                  <img
                    src={images[currentImageIndex]}
                    alt={vehicle.title}
                    className="w-full h-96 object-cover"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                      >
                        <ChevronLeft className="h-6 w-6 text-gray-800" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                      >
                        <ChevronRight className="h-6 w-6 text-gray-800" />
                      </button>
                    </>
                  )}
                </div>
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex
                            ? 'border-orange-600'
                            : 'border-transparent'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${vehicle.title} ${index + 1}`}
                          className="w-full h-20 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg h-96 flex items-center justify-center">
                <Car className="h-32 w-32 text-gray-300" />
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-4">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  vehicle.condition === 'new'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {vehicle.condition === 'new' ? 'Nuevo' : 'Usado'}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-slate-900 mb-2">{vehicle.title}</h1>
            <p className="text-xl text-gray-600 mb-6">
              {vehicle.brand} {vehicle.model}
            </p>

            <div className="mb-8">
              <span className="text-5xl font-bold text-orange-600">
                ${vehicle.price.toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Año</p>
                  <p className="font-semibold text-slate-900">{vehicle.year}</p>
                </div>
              </div>

              {vehicle.mileage && (
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Gauge className="h-6 w-6 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Kilometraje</p>
                    <p className="font-semibold text-slate-900">
                      {vehicle.mileage.toLocaleString()} km
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <Fuel className="h-6 w-6 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Combustible</p>
                  <p className="font-semibold text-slate-900">{vehicle.fuel_type}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <Settings className="h-6 w-6 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Transmisión</p>
                  <p className="font-semibold text-slate-900">{vehicle.transmission}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <Car className="h-6 w-6 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Tipo</p>
                  <p className="font-semibold text-slate-900">{vehicle.type}</p>
                </div>
              </div>

              {vehicle.color && (
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Palette className="h-6 w-6 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Color</p>
                    <p className="font-semibold text-slate-900">{vehicle.color}</p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigate('contact')}
              className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors text-lg"
            >
              Solicitar Información
            </button>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Descripción</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {vehicle.description || 'Sin descripción disponible.'}
          </p>
        </div>

        {vehicle.features && vehicle.features.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Características y Equipamiento
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehicle.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 bg-gradient-to-br from-orange-600 to-red-600 text-white rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Interesado en este vehículo?</h2>
          <p className="text-xl text-orange-100 mb-6">
            Contáctanos para más información o para agendar una prueba de manejo
          </p>
          <button
            onClick={() => onNavigate('contact')}
            className="px-8 py-4 bg-white text-orange-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors transform hover:scale-105"
          >
            Contactar Ahora
          </button>
        </div>
      </div>
    </div>
  );
}
