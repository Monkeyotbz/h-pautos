import { useEffect, useState } from 'react';
import { Star, Check, X } from 'lucide-react';
import { supabase, Testimonial } from '../../lib/supabase';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setTestimonials(data);
    } catch (error) {
      console.error('Error loading testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string, approved: boolean) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ approved })
        .eq('id', id);

      if (error) throw error;
      loadTestimonials();
    } catch (error) {
      console.error('Error updating testimonial:', error);
      alert('Error al actualizar el testimonio');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Estas seguro de eliminar este testimonio?')) return;

    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
      loadTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('Error al eliminar el testimonio');
    }
  };

  return (
    <div className="text-slate-100">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white">Gestion de Testimonios</h2>
        <p className="text-slate-300 text-sm">Aprueba y organiza opiniones de clientes.</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-12 bg-white/5 border border-white/10 rounded-2xl shadow-md">
          <Star className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No hay testimonios</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-black/60 border border-white/10 rounded-2xl shadow-2xl p-6 hover:shadow-2xl transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < testimonial.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-slate-600'
                        }`}
                      />
                    ))}
                    <span
                      className={`ml-3 px-2 py-1 text-xs font-semibold rounded-full ${
                        testimonial.approved
                          ? 'bg-green-500/15 text-green-300'
                          : 'bg-yellow-500/15 text-yellow-300'
                      }`}
                    >
                      {testimonial.approved ? 'Aprobado' : 'Pendiente'}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {testimonial.customer_name}
                  </h3>
                  <p className="text-slate-200 mb-4 italic">"{testimonial.comment}"</p>
                  <p className="text-sm text-slate-400">
                    Fecha: {new Date(testimonial.created_at).toLocaleDateString('es-MX')}
                  </p>
                </div>
                <div className="flex md:flex-col gap-2">
                  {!testimonial.approved && (
                    <button
                      onClick={() => handleApprove(testimonial.id, true)}
                      className="p-2 bg-green-500/15 text-green-300 rounded-lg hover:bg-green-500/25 transition-colors"
                      title="Aprobar"
                    >
                      <Check className="h-5 w-5" />
                    </button>
                  )}
                  {testimonial.approved && (
                    <button
                      onClick={() => handleApprove(testimonial.id, false)}
                      className="p-2 bg-yellow-500/15 text-yellow-300 rounded-lg hover:bg-yellow-500/25 transition-colors"
                      title="Desaprobar"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    className="p-2 bg-red-500/15 text-red-300 rounded-lg hover:bg-red-500/25 transition-colors"
                    title="Eliminar"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
