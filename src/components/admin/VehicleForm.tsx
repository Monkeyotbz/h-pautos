import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { X, UploadCloud, Trash2, ImagePlus } from 'lucide-react';
import { supabase, Vehicle, VehicleImage } from '../../lib/supabase';

type VehicleFormProps = {
  vehicle: Vehicle | null;
  onClose: () => void;
};

type VehicleFormState = {
  title: string;
  brand: string;
  model: string;
  year: number;
  price: string;
  km: string;
  fuel: string;
  transmission: string;
  condition: 'nuevo' | 'usado';
  description: string;
  status: 'activo' | 'reservado' | 'vendido';
  location: string;
  cover_image_url: string | null;
  rating: number;
};

const BUCKET_NAME = 'vehiculos';

export default function VehicleForm({ vehicle, onClose }: VehicleFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [existingImages, setExistingImages] = useState<VehicleImage[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedPreviews, setSelectedPreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState<VehicleFormState>({
    title: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    km: '',
    fuel: 'Gasolina',
    transmission: 'manual',
    condition: 'usado',
    description: '',
    status: 'activo',
    location: '',
    cover_image_url: null,
    rating: 5,
  });

  useEffect(() => {
    if (vehicle) {
      setFormData({
        title: vehicle.title,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        price: String(vehicle.price),
        km: String(vehicle.km),
        fuel: vehicle.fuel,
        transmission: vehicle.transmission,
        condition: vehicle.condition,
        description: vehicle.description || '',
        status: vehicle.status,
        location: vehicle.location || '',
        cover_image_url: vehicle.cover_image_url || null,
        rating: vehicle.rating || 5,
      });
      void loadExistingImages(vehicle.id);
    }
  }, [vehicle]);

  useEffect(() => {
    const previews = selectedFiles.map((file) => URL.createObjectURL(file));
    setSelectedPreviews(previews);

    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

  const loadExistingImages = async (vehicleId: string) => {
    const { data, error } = await supabase
      .from('vehicle_images')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .order('sort_order', { ascending: true });

    if (!error && data) {
      setExistingImages(data);
    }
  };

  const handleFileChange = (files: FileList | null) => {
    if (!files) {
      setSelectedFiles([]);
      return;
    }
    setSelectedFiles(Array.from(files));
  };

  const uploadImages = async (vehicleId: string) => {
    if (selectedFiles.length === 0) return [] as VehicleImage[];

    setUploading(true);
    try {
      const startOrder = existingImages.length;
      const uploads: VehicleImage[] = [];

      for (let i = 0; i < selectedFiles.length; i += 1) {
        const file = selectedFiles[i];
        const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const filePath = `${vehicleId}/${crypto.randomUUID()}.${ext}`;

        console.log(`Subiendo imagen ${i + 1}/${selectedFiles.length}: ${file.name}`);

        const { error: uploadError } = await supabase
          .storage
          .from(BUCKET_NAME)
          .upload(filePath, file, { cacheControl: '3600', upsert: false, contentType: file.type });

        if (uploadError) {
          console.error('Error al subir imagen:', uploadError);
          throw new Error(`Error al subir ${file.name}: ${uploadError.message}`);
        }

        const { data: publicData } = supabase
          .storage
          .from(BUCKET_NAME)
          .getPublicUrl(filePath);

        console.log(`URL pública generada: ${publicData.publicUrl}`);

        uploads.push({
          id: crypto.randomUUID(),
          vehicle_id: vehicleId,
          url: publicData.publicUrl,
          sort_order: startOrder + i,
          created_at: new Date().toISOString(),
        });
      }

      const { data: inserted, error: insertError } = await supabase
        .from('vehicle_images')
        .insert(
          uploads.map((img) => ({
            vehicle_id: img.vehicle_id,
            url: img.url,
            sort_order: img.sort_order,
          }))
        )
        .select('*');

      if (insertError) throw insertError;

      if (inserted && inserted.length > 0 && !formData.cover_image_url) {
        const coverUrl = inserted[0].url;
        await supabase
          .from('vehicles')
          .update({ cover_image_url: coverUrl })
          .eq('id', vehicleId);
        setFormData((prev) => ({ ...prev, cover_image_url: coverUrl }));
      }

      setSelectedFiles([]);
      setExistingImages((prev) => [...prev, ...(inserted || [])]);
      return inserted || [];
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (image: VehicleImage) => {
    if (!vehicle) return;

    const { error } = await supabase
      .from('vehicle_images')
      .delete()
      .eq('id', image.id);

    if (error) {
      alert('No se pudo eliminar la imagen');
      return;
    }

    const remaining = existingImages.filter((img) => img.id !== image.id);
    setExistingImages(remaining);

    if (formData.cover_image_url === image.url) {
      const nextCover = remaining[0]?.url || null;
      await supabase
        .from('vehicles')
        .update({ cover_image_url: nextCover })
        .eq('id', vehicle.id);
      setFormData((prev) => ({ ...prev, cover_image_url: nextCover }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const vehicleData = {
        title: formData.title,
        brand: formData.brand,
        model: formData.model,
        year: formData.year,
        price: Number(formData.price),
        km: Number(formData.km),
        fuel: formData.fuel,
        transmission: formData.transmission,
        condition: formData.condition,
        description: formData.description || null,
        status: formData.status,
        location: formData.location || null,
        cover_image_url: formData.cover_image_url || null,
        rating: formData.rating,
      };

      if (vehicle) {
        const { error } = await supabase
          .from('vehicles')
          .update(vehicleData)
          .eq('id', vehicle.id);
        if (error) throw error;
        await uploadImages(vehicle.id);
      } else {
        const { data, error } = await supabase
          .from('vehicles')
          .insert([vehicleData])
          .select('*')
          .single();
        if (error) throw error;
        if (data) {
          await uploadImages(data.id);
        }
      }

      onClose();
    } catch (error) {
      console.error('Error saving vehicle:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      alert(`Error al guardar el vehículo: ${errorMessage}\n\nRevisa la consola (F12) para más detalles.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black/60 border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8 text-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white">
          {vehicle ? 'Editar Vehiculo' : 'Nuevo Vehiculo'}
        </h2>
        <button onClick={onClose} className="text-slate-400 hover:text-white">
          <X className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">Titulo *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">Marca *</label>
            <input
              type="text"
              required
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">Modelo *</label>
            <input
              type="text"
              required
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">Ano *</label>
            <input
              type="number"
              required
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">Precio *</label>
            <input
              type="number"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">Kilometraje *</label>
            <input
              type="number"
              required
              value={formData.km}
              onChange={(e) => setFormData({ ...formData, km: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">Condicion *</label>
            <select
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value as 'nuevo' | 'usado' })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="nuevo">Nuevo</option>
              <option value="usado">Usado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">Combustible *</label>
            <select
              value={formData.fuel}
              onChange={(e) => setFormData({ ...formData, fuel: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="Gasolina">Gasolina</option>
              <option value="Diesel">Diesel</option>
              <option value="Electrico">Electrico</option>
              <option value="Hibrido">Hibrido</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">Transmision *</label>
            <select
              value={formData.transmission}
              onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="manual">Manual</option>
              <option value="automatico">Automatico</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">Estado *</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'activo' | 'reservado' | 'vendido' })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="activo">Activo</option>
              <option value="reservado">Reservado</option>
              <option value="vendido">Vendido</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">Calificación (Estrellas) *</label>
            <select
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value={5}>⭐⭐⭐⭐⭐ (5 Estrellas - Excelente)</option>
              <option value={4.5}>⭐⭐⭐⭐✨ (4.5 Estrellas)</option>
              <option value={4}>⭐⭐⭐⭐ (4 Estrellas - Muy Bueno)</option>
              <option value={3.5}>⭐⭐⭐✨ (3.5 Estrellas)</option>
              <option value={3}>⭐⭐⭐ (3 Estrellas - Bueno)</option>
              <option value={2.5}>⭐⭐✨ (2.5 Estrellas)</option>
              <option value={2}>⭐⭐ (2 Estrellas - Regular)</option>
              <option value={1.5}>⭐✨ (1.5 Estrellas)</option>
              <option value={1}>⭐ (1 Estrella - Básico)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">Ubicacion</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2">Descripcion</label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Aqui puedes usar emojis 🙂🚗"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <ImagePlus className="h-5 w-5 text-red-400" />
              Imagenes del vehiculo
            </h3>
            {formData.cover_image_url && (
              <span className="text-xs text-slate-300">Portada definida</span>
            )}
          </div>

          {existingImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {existingImages.map((img) => (
                <div key={img.id} className="relative group">
                  <img src={img.url} alt="" className="w-full h-28 object-cover rounded-lg border border-white/10" />
                  {formData.cover_image_url === img.url && (
                    <span className="absolute top-2 left-2 text-xs bg-red-600 text-white px-2 py-1 rounded">Portada</span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(img)}
                    className="absolute top-2 right-2 p-1 bg-black/70 text-red-300 rounded opacity-0 group-hover:opacity-100 transition"
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <label className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-200">Subir imagenes</p>
                <p className="text-xs text-slate-400">Selecciona multiples archivos desde tu carpeta.</p>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileChange(e.target.files)}
                className="block w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-red-600 file:text-white file:font-semibold hover:file:bg-red-700"
              />
            </label>

            {selectedFiles.length > 0 && (
              <>
                <div className="mt-3 text-sm text-slate-300 space-y-1">
                  {selectedFiles.map((file) => (
                    <div key={file.name} className="flex items-center gap-2">
                      <UploadCloud className="h-4 w-4 text-red-400" />
                      <span>{file.name}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                  {selectedPreviews.map((previewUrl, index) => (
                    <img
                      key={previewUrl}
                      src={previewUrl}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-white/10"
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading || uploading}
            className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 shadow-[0_10px_25px_rgba(239,68,68,0.35)]"
          >
            {loading || uploading ? 'Guardando...' : vehicle ? 'Actualizar' : 'Crear'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
