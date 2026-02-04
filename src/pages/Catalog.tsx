import { useEffect, useState } from 'react';
import { Car, Search, Filter, ChevronRight, ChevronLeft, MessageCircle } from 'lucide-react';
import { supabase, Vehicle } from '../lib/supabase';

type CatalogProps = {
  onNavigate: (page: string, vehicleId?: string) => void;
};

const ITEMS_PER_PAGE = 9;

export default function Catalog({ onNavigate }: CatalogProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
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

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [vehicles, filters, searchTerm]);

  const loadVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setVehicles(data);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
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
    if (filters.minPrice) result = result.filter((v) => v.price >= Number(filters.minPrice));
    if (filters.maxPrice) result = result.filter((v) => v.price <= Number(filters.maxPrice));
    if (filters.minYear) result = result.filter((v) => v.year >= Number(filters.minYear));
    if (filters.maxYear) result = result.filter((v) => v.year <= Number(filters.maxYear));
    if (filters.transmission !== 'all') result = result.filter((v) => v.transmission === filters.transmission);
    if (filters.fuelType !== 'all') result = result.filter((v) => v.fuel_type === filters.fuelType);

    setFilteredVehicles(result);
    setCurrentPage(1);
  };

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

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-slate-100">
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(120deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.65) 40%, rgba(0,0,0,0.45) 100%), url('https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-14 md:py-20 relative z-10">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-red-400">Catálogo de</p>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Vehículos Usados
            </h1>
            <p className="text-lg text-slate-200/80">
              Descubre autos inspeccionados y verificados. Compra con seguridad, pago inmediato y asesoría personalizada.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-[0_10px_30px_rgba(239,68,68,0.35)]"
              >
                Vender mi Auto
              </button>
            <a
              href="https://wa.me/541112345678?text=Hola%20quiero%20comprar%20un%20auto"
              target="_blank"
              rel="noreferrer"
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
                placeholder="Buscar por marca, modelo o título..."
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
                  label="Condición"
                  value={filters.condition}
                  onChange={(v) => setFilters({ ...filters, condition: v })}
                  options={[
                    { value: 'all', label: 'Todos' },
                    { value: 'new', label: 'Nuevo' },
                    { value: 'used', label: 'Usado' },
                  ]}
                />
                <SelectBox
                  label="Marca"
                  value={filters.brand}
                  onChange={(v) => setFilters({ ...filters, brand: v })}
                  options={[{ value: 'all', label: 'Todas' }, ...brands.map((b) => ({ value: b, label: b }))]}
                />
                <SelectBox
                  label="Transmisión"
                  value={filters.transmission}
                  onChange={(v) => setFilters({ ...filters, transmission: v })}
                  options={[
                    { value: 'all', label: 'Todas' },
                    { value: 'manual', label: 'Manual' },
                    { value: 'automatic', label: 'Automática' },
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
                    { value: 'Eléctrico', label: 'Eléctrico' },
                    { value: 'Híbrido', label: 'Híbrido' },
                  ]}
                />
                <InputBox
                  label="Precio Mínimo"
                  value={filters.minPrice}
                  placeholder=""
                  onChange={(v) => setFilters({ ...filters, minPrice: v })}
                />
                <InputBox
                  label="Precio Máximo"
                  value={filters.maxPrice}
                  placeholder=",999"
                  onChange={(v) => setFilters({ ...filters, maxPrice: v })}
                />
                <InputBox
                  label="Año Mínimo"
                  value={filters.minYear}
                  placeholder="2000"
                  onChange={(v) => setFilters({ ...filters, minYear: v })}
                />
                <InputBox
                  label="Año Máximo"
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
            Mostrando {startIndex + 1}-{Math.min(endIndex, filteredVehicles.length)} de {filteredVehicles.length} vehículos
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : currentVehicles.length === 0 ? (
          <div className="text-center py-12 bg-black/40 border border-white/10 rounded-2xl shadow-lg">
            <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No se encontraron vehículos</h3>
            <p className="text-slate-300">Intenta ajustar los filtros de búsqueda</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-black/70 via-black/60 to-black/30 border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.45)] hover:-translate-y-1 transition cursor-pointer"
                  onClick={() => onNavigate('vehicle-detail', vehicle.id)}
                >
                  <div className="relative h-52">
                    {vehicle.images && vehicle.images.length > 0 ? (
                      <img src={vehicle.images[0]} alt={vehicle.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-800">
                        <Car className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-full">
                        {vehicle.condition === 'new' ? 'Nuevo' : 'Usado'}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <div>
                      <h3 className="text-lg font-bold text-white">{vehicle.title}</h3>
                      <p className="text-sm text-slate-300">
                        {vehicle.brand} {vehicle.model} • {vehicle.year}
                      </p>
                      <p className="text-xs text-slate-400">
                        {vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km • ` : ''}{vehicle.transmission}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-2xl font-extrabold text-white">
                        ${vehicle.price.toLocaleString()}
                      </span>
                      <button className="text-sm font-semibold text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg">
                        Me interesa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-10 flex justify-center items-center space-x-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
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
                  className="w-10 h-10 rounded-md bg-white/10 border border-white/15 text-white hover:bg-white/20 disabled:opacity-40"
                >
                  <ChevronRight className="h-5 w-5 mx-auto" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Subcomponentes simples para inputs/selects estilizados
function SelectBox({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-white mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
