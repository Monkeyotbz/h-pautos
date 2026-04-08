import { useCallback, useEffect, useState } from 'react';
import {
  Car,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  MapPin,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Star,
  MessageCircle,
} from 'lucide-react';
import { supabase, Vehicle, VehicleImage, normalizeStorageUrl } from '../lib/supabase';

type VehicleDetailProps = {
  vehicleId: string;
  onNavigate: (page: string) => void;
};

type VehicleWithImages = Vehicle & { vehicle_images?: VehicleImage[] };

export default function VehicleDetail({ vehicleId, onNavigate }: VehicleDetailProps) {
  const [vehicle, setVehicle] = useState<VehicleWithImages | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const loadVehicle = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*, vehicle_images (url, sort_order)')
        .eq('id', vehicleId)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setVehicle(data as VehicleWithImages);
      }
    } catch (error) {
      console.error('Error loading vehicle:', error);
    } finally {
      setLoading(false);
    }
  }, [vehicleId]);

  useEffect(() => {
    loadVehicle();
  }, [loadVehicle]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center">
        <div className="text-center">
          <Car className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Vehículo no encontrado</h2>
          <button
            onClick={() => onNavigate('catalog')}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Ver Catálogo
          </button>
        </div>
      </div>
    );
  }

  const images = (() => {
    const list = vehicle.vehicle_images ? [...vehicle.vehicle_images] : [];
    list.sort((a, b) => a.sort_order - b.sort_order);
    const urls = list.map((img) => normalizeStorageUrl(img.url)).filter(Boolean) as string[];
    const cover = normalizeStorageUrl(vehicle.cover_image_url);
    if (cover && !urls.includes(cover)) {
      urls.unshift(cover);
    }
    return urls;
  })();

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Calcular estrellas de reconocimiento
  const calculateStars = () => {
    let stars = 0;
    const currentYear = new Date().getFullYear();
    const age = currentYear - vehicle.year;
    
    if (vehicle.condition === 'nuevo') return 5;
    
    if (age <= 1) stars += 2.5;
    else if (age <= 3) stars += 2;
    else if (age <= 5) stars += 1.5;
    else if (age <= 8) stars += 1;
    else stars += 0.5;
    
    if (vehicle.km < 20000) stars += 2.5;
    else if (vehicle.km < 50000) stars += 2;
    else if (vehicle.km < 100000) stars += 1.5;
    else if (vehicle.km < 150000) stars += 1;
    else stars += 0.5;
    
    return Math.min(5, Math.round(stars * 2) / 2);
  };

  const stars = calculateStars();
  const fullStars = Math.floor(stars);
  const hasHalfStar = stars % 1 !== 0;

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-slate-100">
      {/* Header con botón de volver */}
      <div className="bg-gradient-to-b from-black/60 to-transparent border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => onNavigate('catalog')}
            className="group flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Volver al catálogo</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Galería de imágenes */}
          <div className="space-y-4">
            {images.length > 0 ? (
              <>
                <div className="relative group rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl">
                  <img
                    src={images[currentImageIndex]}
                    alt={vehicle.title}
                    className="w-full h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  
                  {/* Controles de navegación */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        aria-label="Imagen anterior"
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 backdrop-blur-sm p-3 rounded-full shadow-xl transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft className="h-6 w-6 text-white" />
                      </button>
                      <button
                        onClick={nextImage}
                        aria-label="Siguiente imagen"
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 backdrop-blur-sm p-3 rounded-full shadow-xl transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight className="h-6 w-6 text-white" />
                      </button>
                      
                      {/* Contador de imágenes */}
                      <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    </>
                  )}
                </div>
                
                {/* Miniaturas */}
                {images.length > 1 && (
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                    {images.map((img, index) => (
                      <button
                        key={img}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`rounded-lg overflow-hidden border-2 transition-all transform hover:scale-105 ${
                          index === currentImageIndex
                            ? 'border-red-600 ring-2 ring-red-600/50'
                            : 'border-slate-700 hover:border-red-500'
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
              </>
            ) : (
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl h-[500px] flex items-center justify-center">
                <Car className="h-32 w-32 text-slate-700" />
              </div>
            )}
          </div>

          {/* Información del vehículo */}
          <div className="space-y-6">
            {/* Tarjeta principal */}
            <div className="bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 border border-slate-700/50 rounded-2xl shadow-2xl p-8">
              {/* Badge y Estrellas */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                    vehicle.condition === 'nuevo'
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                  }`}
                >
                  {vehicle.condition === 'nuevo' ? '✨ NUEVO' : '🚗 USADO'}
                </span>
                
                {/* Estrellas */}
                <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-3 py-2 rounded-full">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < fullStars
                          ? 'fill-yellow-400 text-yellow-400'
                          : i === fullStars && hasHalfStar
                          ? 'fill-yellow-400 text-yellow-400 opacity-50'
                          : 'fill-slate-600 text-slate-600'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Título */}
              <h1 className="text-4xl font-extrabold text-white mb-2 leading-tight">
                {vehicle.title}
              </h1>
              <p className="text-xl text-slate-300 font-medium mb-6">
                {vehicle.brand} {vehicle.model}
              </p>

              {/* Precio */}
              <div className="bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-700/30 rounded-xl p-6 mb-6">
                <p className="text-sm text-slate-400 font-medium mb-1">Precio</p>
                <p className="text-5xl font-black bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                  ${Number(vehicle.price).toLocaleString()}
                </p>
              </div>

              {/* Especificaciones */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-600/20 p-2.5 rounded-lg">
                      <Calendar className="h-5 w-5 text-red-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Año</p>
                      <p className="text-lg font-bold text-white">{vehicle.year}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-600/20 p-2.5 rounded-lg">
                      <Gauge className="h-5 w-5 text-red-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Kilometraje</p>
                      <p className="text-lg font-bold text-white">
                        {vehicle.km.toLocaleString()} km
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-600/20 p-2.5 rounded-lg">
                      <Fuel className="h-5 w-5 text-red-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Combustible</p>
                      <p className="text-lg font-bold text-white">{vehicle.fuel}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-600/20 p-2.5 rounded-lg">
                      <Settings className="h-5 w-5 text-red-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Transmisión</p>
                      <p className="text-lg font-bold text-white capitalize">{vehicle.transmission}</p>
                    </div>
                  </div>
                </div>

                {vehicle.location && (
                  <div className="col-span-2 bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="bg-red-600/20 p-2.5 rounded-lg">
                        <MapPin className="h-5 w-5 text-red-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium">Ubicación</p>
                        <p className="text-lg font-bold text-white">{vehicle.location}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Botones de acción */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onNavigate('contact')}
                  className="py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-base rounded-xl shadow-lg shadow-red-900/50 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  Solicitar Info
                </button>
                <button
                  onClick={() => window.open('https://wa.me/573245799091?text=Hola%2C%20me%20interesa%20el%20veh%C3%ADculo%20' + encodeURIComponent(vehicle.title), '_blank', 'noopener,noreferrer')}
                  className="py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold text-base rounded-xl shadow-lg shadow-green-900/50 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Descripción y Características Detalladas */}
        <div className="mt-8 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="h-1 w-12 bg-gradient-to-r from-red-600 to-red-400 rounded-full"></div>
              Información Detallada
            </h2>
            
            {vehicle.description && (
              <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                  Descripción
                </h3>
                <div className="text-slate-300 leading-relaxed space-y-3">
                  {vehicle.description.split('\n').map((paragraph, idx) => (
                    paragraph.trim() && (
                      <p key={idx} className="text-base">
                        {paragraph.includes('▶') || paragraph.includes('🚩') || paragraph.includes('❗') ? (
                          <span className="flex items-start gap-2">
                            <span className="text-red-400 mt-1 flex-shrink-0">{paragraph.match(/[▶🚩❗]/u)?.[0]}</span>
                            <span>{paragraph.replace(/[▶🚩❗]/gu, '').trim()}</span>
                          </span>
                        ) : paragraph.includes(':') ? (
                          <span>
                            <span className="font-semibold text-white">{paragraph.split(':')[0]}:</span>
                            <span className="ml-1">{paragraph.split(':').slice(1).join(':')}</span>
                          </span>
                        ) : (
                          paragraph
                        )}
                      </p>
                    )
                  ))}
                </div>
              </div>
            )}
            
            {/* Detalles organizados */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Características principales */}
              <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                  Características Principales
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                    <span className="text-slate-400">Estado</span>
                    <span className={`font-semibold px-3 py-1 rounded-full text-sm ${
                      vehicle.condition === 'nuevo' 
                        ? 'bg-emerald-500/20 text-emerald-300' 
                        : 'bg-blue-500/20 text-blue-300'
                    }`}>
                      {vehicle.condition === 'nuevo' ? 'Nuevo' : 'Usado'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                    <span className="text-slate-400">Marca</span>
                    <span className="font-semibold text-white">{vehicle.brand}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                    <span className="text-slate-400">Modelo</span>
                    <span className="font-semibold text-white">{vehicle.model}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                    <span className="text-slate-400">Año</span>
                    <span className="font-semibold text-white">{vehicle.year}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-400">Kilometraje</span>
                    <span className="font-semibold text-white">{vehicle.km.toLocaleString()} km</span>
                  </div>
                </div>
              </div>
              
              {/* Especificaciones técnicas */}
              <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                  Especificaciones Técnicas
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                    <span className="text-slate-400">Combustible</span>
                    <span className="font-semibold text-white">{vehicle.fuel}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                    <span className="text-slate-400">Transmisión</span>
                    <span className="font-semibold text-white capitalize">{vehicle.transmission}</span>
                  </div>
                  {vehicle.location && (
                    <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                      <span className="text-slate-400">Ubicación</span>
                      <span className="font-semibold text-white">{vehicle.location}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                    <span className="text-slate-400">Estado del Vehículo</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < fullStars
                              ? 'fill-yellow-400 text-yellow-400'
                              : i === fullStars && hasHalfStar
                              ? 'fill-yellow-400 text-yellow-400 opacity-50'
                              : 'fill-slate-600 text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-400">Precio</span>
                    <span className="text-2xl font-black bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                      ${Number(vehicle.price).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="mt-8 bg-gradient-to-r from-red-600 via-red-700 to-red-800 rounded-2xl p-10 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-black text-white mb-3">
              ¿Interesado en este vehículo?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Contáctanos para más información o para agendar una prueba de manejo
            </p>
            <button
              onClick={() => onNavigate('contact')}
              className="px-10 py-4 bg-white text-red-600 font-bold text-lg rounded-xl hover:bg-slate-100 transition-all transform hover:scale-105 shadow-2xl"
            >
              Contactar Ahora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
