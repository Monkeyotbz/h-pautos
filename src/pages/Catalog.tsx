import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Car, Search, Filter, ChevronRight, ChevronLeft, MessageCircle, Star, Calendar, Gauge, Settings, Fuel } from 'lucide-react';
import { supabase, Vehicle, VehicleImage, normalizeStorageUrl } from '../lib/supabase';

type CatalogProps = {
  onNavigate: (page: string, vehicleId?: string) => void;
};

type VehicleWithImages = Vehicle & { vehicle_images?: VehicleImage[] };

const ITEMS_PER_PAGE = 9;

export default function Catalog({ onNavigate }: CatalogProps) {
  const [vehicles, setVehicles] = useState<VehicleWithImages[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<VehicleWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    condition: 'all',
    brand: 'all',
    minPrice: '',
    maxPrice: '',
    minYear: '',
    maxYear: '',
    transmission: 'all',
    fuelType: 'all',
  });

  const loadVehicles = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('id, title, brand, model, year, price, km, condition, transmission, fuel, location, description, status, created_at, vehicle_images (url, sort_order)')
        .eq('status', 'activo')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setVehicles(data as VehicleWithImages[]);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const applyFilters = useCallback(() => {
    let result = [...vehicles];

    if (searchTerm) {
      result = result.filter((v) =>
        v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.condition !== 'all') result = result.filter((v) => v.condition === filters.condition);
    if (filters.brand !== 'all') result = result.filter((v) => v.brand === filters.brand);
    if (filters.minPrice) result = result.filter((v) => Number(v.price) >= Number(filters.minPrice));
    if (filters.maxPrice) result = result.filter((v) => Number(v.price) <= Number(filters.maxPrice));
    if (filters.minYear) result = result.filter((v) => v.year >= Number(filters.minYear));
    if (filters.maxYear) result = result.filter((v) => v.year <= Number(filters.maxYear));
    if (filters.transmission !== 'all') result = result.filter((v) => v.transmission === filters.transmission);
    if (filters.fuelType !== 'all') result = result.filter((v) => v.fuel === filters.fuelType);

    setFilteredVehicles(result);
    setCurrentPage(1);
  }, [vehicles, filters, searchTerm]);

  useEffect(() => {
    loadVehicles();
    document.title = 'Catálogo de vehículos usados | P & H Autos';
  }, [loadVehicles]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const resetFilters = () => {
    setFilters({
      condition: 'all',
      brand: 'all',
      minPrice: '',
      maxPrice: '',
      minYear: '',
      maxYear: '',
      transmission: 'all',
      fuelType: 'all',
    });
    setSearchTerm('');
  };

  const brands = [...new Set(vehicles.map((v) => v.brand))].sort();

  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentVehicles = filteredVehicles.slice(startIndex, endIndex);

  const getVehicleImage = (vehicle: VehicleWithImages) => {
    const cover = normalizeStorageUrl(vehicle.cover_image_url);
    if (cover) return cover;
    const images = vehicle.vehicle_images || [];
    const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
    return normalizeStorageUrl(sorted[0]?.url) || null;
  };

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-slate-100">
      <Helmet>
        <title>Catálogo de vehículos usados | P &amp; H Autos</title>
        <meta name="description" content="Explora nuestro catálogo de vehículos usados verificados en Antioquia. Filtra por marca, precio, año y mucho más." />
        <meta property="og:title" content="Catálogo de vehículos | P &amp; H Autos" />
        <meta property="og:description" content="Vehículos usados verificados en el Área Metropolitana de Antioquia. Encuentra tu próximo auto." />
        <meta property="og:url" content="https://h-pautos.vercel.app/catalog" />
      </Helmet>
      <main>
      {/* Hero */}
      <section
        className="relative overflow-hidden catalog-hero-bg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-14 md:py-20 relative z-10">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-red-400">Catalogo de</p>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Vehiculos Usados</h1>
            <p className="text-lg text-slate-200/80">
              Descubre autos inspeccionados y verificados. Compra con seguridad, pago inmediato y asesoria personalizada.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-[0_10px_30px_rgba(239,68,68,0.35)]"
              >
                Vender mi Auto
              </button>
              <a
                href="https://wa.me/573245799091?text=Hola%20quiero%20comprar%20un%20auto"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-[0_10px_30px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-5 w-5" />
                Contactar por WhatsApp
              </a>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-[#0b0b0f]" />
      </section>

      {/* Filtros */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 -mt-10">
        <div className="bg-gradient-to-r from-black/70 via-[#141418]/80 to-black/60 border border-red-600/40 rounded-2xl shadow-2xl p-4 md:p-5 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(255,0,0,0.15),transparent_30%)]" />
          <div className="relative flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar por marca, modelo o titulo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 shadow-[0_8px_22px_rgba(239,68,68,0.35)]"
            >
              <Filter className="h-5 w-5" />
              <span>Filtros</span>
            </button>
          </div>

          {showFilters && (
            <div className="relative mt-6 pt-6 border-t border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <SelectBox
                  label="Condicion"
                  value={filters.condition}
                  onChange={(v) => setFilters({ ...filters, condition: v })}
                  options={[
                    { value: 'all', label: 'Todos' },
                    { value: 'nuevo', label: 'Nuevo' },
                    { value: 'usado', label: 'Usado' },
                  ]}
                />
                <SelectBox
                  label="Marca"
                  value={filters.brand}
                  onChange={(v) => setFilters({ ...filters, brand: v })}
                  options={[{ value: 'all', label: 'Todas' }, ...brands.map((b) => ({ value: b, label: b }))]}
                />
                <SelectBox
                  label="Transmision"
                  value={filters.transmission}
                  onChange={(v) => setFilters({ ...filters, transmission: v })}
                  options={[
                    { value: 'all', label: 'Todas' },
                    { value: 'manual', label: 'Manual' },
                    { value: 'automatico', label: 'Automatico' },
                  ]}
                />
                <SelectBox
                  label="Combustible"
                  value={filters.fuelType}
                  onChange={(v) => setFilters({ ...filters, fuelType: v })}
                  options={[
                    { value: 'all', label: 'Todos' },
                    { value: 'Gasolina', label: 'Gasolina' },
                    { value: 'Diesel', label: 'Diesel' },
                    { value: 'Electrico', label: 'Electrico' },
                    { value: 'Hibrido', label: 'Hibrido' },
                  ]}
                />
                <InputBox
                  label="Precio Minimo"
                  value={filters.minPrice}
                  placeholder=""
                  onChange={(v) => setFilters({ ...filters, minPrice: v })}
                />
                <InputBox
                  label="Precio Maximo"
                  value={filters.maxPrice}
                  placeholder=",999"
                  onChange={(v) => setFilters({ ...filters, maxPrice: v })}
                />
                <InputBox
                  label="Ano Minimo"
                  value={filters.minYear}
                  placeholder="2000"
                  onChange={(v) => setFilters({ ...filters, minYear: v })}
                />
                <InputBox
                  label="Ano Maximo"
                  value={filters.maxYear}
                  placeholder="2026"
                  onChange={(v) => setFilters({ ...filters, maxYear: v })}
                />
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={resetFilters}
                  className="px-6 py-2 text-red-400 hover:text-red-300 font-semibold"
                >
                  Limpiar Filtros
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <div className="mb-6 text-slate-200">
          <p>
            Mostrando {startIndex + 1}-{Math.min(endIndex, filteredVehicles.length)} de {filteredVehicles.length} vehiculos
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : currentVehicles.length === 0 ? (
          <div className="text-center py-12 bg-black/40 border border-white/10 rounded-2xl shadow-lg">
            <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No se encontraron vehiculos</h3>
            <p className="text-slate-300">Intenta ajustar los filtros de busqueda</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentVehicles.map((vehicle) => {
                const imageUrl = getVehicleImage(vehicle);
                
                // Usar rating de la base de datos
                const stars = vehicle.rating || 5;
                const fullStars = Math.floor(stars);
                const hasHalfStar = stars % 1 !== 0;
                
                return (
                  <div
                    key={vehicle.id}
                    className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 border border-slate-700/50 shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_50px_rgba(220,38,38,0.3)] hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                    onClick={() => onNavigate('vehicle-detail', vehicle.id)}
                  >
                    {/* Imagen del vehículo */}
                    <div className="relative h-56 overflow-hidden">
                      {imageUrl ? (
                        <img 
                          src={imageUrl} 
                          alt={`${vehicle.brand} ${vehicle.model} ${vehicle.year} ${vehicle.condition === 'nuevo' ? 'nuevo' : 'usado'} - ${vehicle.title}`} 
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                          <Car className="h-20 w-20 text-slate-600" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      {/* Badge de condición */}
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1.5 text-xs font-bold rounded-full shadow-lg ${
                          vehicle.condition === 'nuevo' 
                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white' 
                            : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                        }`}>
                          {vehicle.condition === 'nuevo' ? '✨ NUEVO' : '🚗 USADO'}
                        </span>
                      </div>
                      
                      {/* Estrellas de reconocimiento */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2.5 py-1.5 rounded-full">
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
                    
                    {/* Contenido */}
                    <div className="p-5 space-y-3">
                      {/* Título */}
                      <div>
                        <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-red-400 transition-colors">
                          {vehicle.title}
                        </h3>
                        <p className="text-sm text-slate-400 font-medium">
                          {vehicle.brand} {vehicle.model}
                        </p>
                      </div>
                      
                      {/* Detalles */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Calendar className="h-3.5 w-3.5 text-slate-500" />
                          <span>{vehicle.year}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Gauge className="h-3.5 w-3.5 text-slate-500" />
                          <span>{vehicle.km.toLocaleString()} km</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Settings className="h-3.5 w-3.5 text-slate-500" />
                          <span className="capitalize">{vehicle.transmission}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Fuel className="h-3.5 w-3.5 text-slate-500" />
                          <span>{vehicle.fuel}</span>
                        </div>
                      </div>
                      
                      {/* Precio y botón */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                        <div>
                          <p className="text-xs text-slate-500 font-medium">Precio</p>
                          <p className="text-2xl font-extrabold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                            ${Number(vehicle.price).toLocaleString()}
                          </p>
                        </div>
                        <button className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-sm font-bold rounded-lg shadow-lg shadow-red-900/50 transition-all">
                          Ver detalles
                        </button>
                      </div>
                    </div>
                    
                    {/* Efecto de brillo en hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-tr from-red-600/10 via-transparent to-transparent" />
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="mt-10 flex justify-center items-center space-x-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  aria-label="Página anterior"
                  title="Página anterior"
                  className="w-10 h-10 rounded-md bg-white/10 border border-white/15 text-white hover:bg-white/20 disabled:opacity-40"
                >
                  <ChevronLeft className="h-5 w-5 mx-auto" />
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-md border ${
                      currentPage === i + 1
                        ? 'bg-red-600 border-red-500 text-white'
                        : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="Página siguiente"
                  title="Página siguiente"
                  className="w-10 h-10 rounded-md bg-white/10 border border-white/15 text-white hover:bg-white/20 disabled:opacity-40"
                >
                  <ChevronRight className="h-5 w-5 mx-auto" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
      </main>
    </div>
  );
}

function SelectBox({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-white mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        title={label}
        aria-label={label}
        className="w-full px-3 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="text-black">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function InputBox({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-white mb-2">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
      />
    </div>
  );
}
