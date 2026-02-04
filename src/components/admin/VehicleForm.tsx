import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { supabase, Vehicle } from '../../lib/supabase';

type VehicleFormProps = {
  vehicle: Vehicle | null;
  onClose: () => void;
};

export default function VehicleForm({ vehicle, onClose }: VehicleFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    condition: 'new' as 'new' | 'used',
    mileage: 0,
    fuel_type: 'Gasolina',
    transmission: 'automatic',
    type: 'Sedán',
    color: '',
    description: '',
    status: 'available' as 'available' | 'sold' | 'reserved',
    is_featured: false,
  });
  const [features, setFeatures] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [newImage, setNewImage] = useState('');

  useEffect(() => {
    if (vehicle) {
      setFormData({
        title: vehicle.title,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        price: vehicle.price,
        condition: vehicle.condition,
        mileage: vehicle.mileage || 0,
        fuel_type: vehicle.fuel_type,
        transmission: vehicle.transmission,
        type: vehicle.type,
        color: vehicle.color || '',
        description: vehicle.description || '',
        status: vehicle.status,
        is_featured: vehicle.is_featured,
      });
      setFeatures(vehicle.features || []);
      setImages(vehicle.images || []);
    }
  }, [vehicle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const vehicleData = {
        ...formData,
        features,
        images,
        mileage: formData.condition === 'used' ? formData.mileage : null,
      };

      if (vehicle) {
        const { error } = await supabase
          .from('vehicles')
          .update(vehicleData)
          .eq('id', vehicle.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('vehicles').insert([vehicleData]);
        if (error) throw error;
      }

      onClose();
    } catch (error) {
      console.error('Error saving vehicle:', error);
      alert('Error al guardar el vehículo');
    } finally {
      setLoading(false);
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const addImage = () => {
    if (newImage.trim()) {
      setImages([...images, newImage.trim()]);
      setNewImage('');
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          {vehicle ? 'Editar Vehículo' : 'Nuevo Vehículo'}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marca *
            </label>
            <input
              type="text"
              required
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Modelo *
            </label>
            <input
              type="text"
              required
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Año *
            </label>
            <input
              type="number"
              required
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio *
            </label>
            <input
              type="number"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condición *
            </label>
            <select
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value as 'new' | 'used' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="new">Nuevo</option>
              <option value="used">Usado</option>
            </select>
          </div>

          {formData.condition === 'used' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kilometraje
              </label>
              <input
                type="number"
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Combustible *
            </label>
            <select
              value={formData.fuel_type}
              onChange={(e) => setFormData({ ...formData, fuel_type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="Gasolina">Gasolina</option>
              <option value="Diesel">Diesel</option>
              <option value="Eléctrico">Eléctrico</option>
              <option value="Híbrido">Híbrido</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transmisión *
            </label>
            <select
              value={formData.transmission}
              onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="manual">Manual</option>
              <option value="automatic">Automática</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo *
            </label>
            <input
              type="text"
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="Sedán, SUV, Pickup, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <input
              type="text"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado *
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="available">Disponible</option>
              <option value="reserved">Reservado</option>
              <option value="sold">Vendido</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="rounded text-orange-600 focus:ring-orange-500"
            />
            <span className="text-sm font-medium text-gray-700">Destacar en página principal</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imágenes (URLs de Pexels u otras fuentes)
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="url"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              placeholder="https://images.pexels.com/..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="button"
              onClick={addImage}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-2">
            {images.map((image, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <img src={image} alt="" className="w-16 h-16 object-cover rounded" />
                <span className="flex-1 text-sm text-gray-600 truncate">{image}</span>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Características
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Ej: Sistema de navegación GPS"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="button"
              onClick={addFeature}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-700">{feature}</span>
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Guardando...' : vehicle ? 'Actualizar' : 'Crear'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
