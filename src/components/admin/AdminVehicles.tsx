import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Car } from 'lucide-react';
import { supabase, Vehicle, normalizeStorageUrl } from '../../lib/supabase';
import VehicleForm from './VehicleForm';

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*, vehicle_images (url, sort_order)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setVehicles(data as Vehicle[]);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Estas seguro de eliminar este vehiculo?')) return;

    try {
      const { error } = await supabase.from('vehicles').delete().eq('id', id);
      if (error) throw error;
      loadVehicles();
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      alert('Error al eliminar el vehiculo');
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingVehicle(null);
    loadVehicles();
  };

  const getVehicleImage = (vehicle: Vehicle) => {
    const cover = normalizeStorageUrl(vehicle.cover_image_url);
    if (cover) return cover;
    const images = vehicle.vehicle_images || [];
    const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
    return normalizeStorageUrl(sorted[0]?.url) || null;
  };

  if (showForm) {
    return <VehicleForm vehicle={editingVehicle} onClose={handleCloseForm} />;
  }

  return (
    <div className="text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">Gestion de Vehiculos</h2>
          <p className="text-slate-300 text-sm">Administra tu inventario y tus publicaciones.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 shadow-[0_10px_25px_rgba(239,68,68,0.35)]"
        >
          <Plus className="h-5 w-5" />
          <span>Nuevo Vehiculo</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-12 bg-white/5 border border-white/10 rounded-2xl shadow-md">
          <Car className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No hay vehiculos</h3>
          <p className="text-slate-300">Agrega tu primer vehiculo al catalogo</p>
        </div>
      ) : (
        <>
          {/* Vista tarjetas — móvil */}
          <div className="flex flex-col gap-4 md:hidden">
            {vehicles.map((vehicle) => {
              const imageUrl = getVehicleImage(vehicle);
              return (
                <div key={vehicle.id} className="bg-black/60 border border-white/10 rounded-2xl p-4 flex gap-4 items-start">
                  <div className="w-20 h-20 flex-shrink-0">
                    {imageUrl ? (
                      <img src={imageUrl} alt={vehicle.title} className="w-20 h-20 rounded-xl object-cover" />
                    ) : (
                      <div className="w-20 h-20 bg-white/5 rounded-xl flex items-center justify-center">
                        <Car className="h-8 w-8 text-slate-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white leading-tight line-clamp-2">{vehicle.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{vehicle.brand} · {vehicle.year}</p>
                    <p className="text-sm font-semibold text-white mt-1">${Number(vehicle.price).toLocaleString()}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        vehicle.status === 'activo'
                          ? 'bg-green-500/15 text-green-300'
                          : vehicle.status === 'vendido'
                          ? 'bg-red-500/15 text-red-300'
                          : 'bg-yellow-500/15 text-yellow-300'
                      }`}>
                        {vehicle.status === 'activo' ? 'Activo' : vehicle.status === 'vendido' ? 'Vendido' : 'Reservado'}
                      </span>
                      <button
                        onClick={() => handleEdit(vehicle)}
                        aria-label={`Editar ${vehicle.title}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 text-blue-300 hover:bg-blue-600/40 rounded-lg text-xs font-semibold transition-colors"
                      >
                        <Edit2 className="h-3.5 w-3.5" /> Editar
                      </button>
                      <button
                        onClick={() => handleDelete(vehicle.id)}
                        aria-label={`Eliminar ${vehicle.title}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600/20 text-red-300 hover:bg-red-600/40 rounded-lg text-xs font-semibold transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Vista tabla — desktop */}
          <div className="hidden md:block bg-black/60 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Vehiculo</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Año</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Precio</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {vehicles.map((vehicle) => {
                    const imageUrl = getVehicleImage(vehicle);
                    return (
                      <tr key={vehicle.id} className="hover:bg-white/5">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-16 h-16 flex-shrink-0 mr-4">
                              {imageUrl ? (
                                <img src={imageUrl} alt={vehicle.title} className="w-16 h-16 rounded-lg object-cover" />
                              ) : (
                                <div className="w-16 h-16 bg-white/5 rounded-lg flex items-center justify-center">
                                  <Car className="h-8 w-8 text-slate-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-white">{vehicle.title}</div>
                              <div className="text-sm text-slate-300">{vehicle.brand} {vehicle.model}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">{vehicle.year}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">
                          ${Number(vehicle.price).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            vehicle.status === 'activo'
                              ? 'bg-green-500/15 text-green-300'
                              : vehicle.status === 'vendido'
                              ? 'bg-red-500/15 text-red-300'
                              : 'bg-yellow-500/15 text-yellow-300'
                          }`}>
                            {vehicle.status === 'activo' ? 'Activo' : vehicle.status === 'vendido' ? 'Vendido' : 'Reservado'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={() => handleEdit(vehicle)} aria-label={`Editar ${vehicle.title}`} className="text-blue-300 hover:text-blue-100 mr-4">
                            <Edit2 className="h-5 w-5" />
                          </button>
                          <button onClick={() => handleDelete(vehicle.id)} aria-label={`Eliminar ${vehicle.title}`} className="text-red-300 hover:text-red-100">
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
