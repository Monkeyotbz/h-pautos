import { useEffect, useMemo, useState } from 'react';
import { Star, MessageCircle, PhoneCall } from 'lucide-react';
import { supabase, Testimonial } from '../lib/supabase';

type CommunityProps = {
  onNavigate?: (page: string, vehicleId?: string) => void;
};

export default function Community({ onNavigate }: CommunityProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (data) setTestimonials(data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const ratingAvg = useMemo(() => {
    if (testimonials.length === 0) return 4.9;
    const total = testimonials.reduce((acc, t) => acc + (t.rating || 0), 0);
    return Math.round((total / testimonials.length) * 10) / 10;
  }, [testimonials]);

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
            <p className="text-sm uppercase tracking-[0.3em] text-red-400">Comunidad</p>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Comunidad de H &amp; P Autos
            </h1>
            <p className="text-lg text-slate-200/80">
              Lo que dicen nuestros clientes sobre nosotros. Opiniones reales que respaldan nuestro servicio.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => onNavigate?.('contact')}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-[0_10px_30px_rgba(239,68,68,0.35)]"
              >
                Vender mi Auto
              </button>
            <a
              href="https://wa.me/541112345678?text=Hola%20quiero%20dejar%20mi%20opinión"
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

      {/* Rating */}
      <section className="py-8 bg-gradient-to-r from-black/80 via-[#151518] to-black/80 border-y border-red-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex flex-col md:flex-row items-center justify-center gap-4">
          <div className="flex items-center gap-1 text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-current" />
            ))}
          </div>
          <div className="text-lg font-semibold text-white">
            {ratingAvg} / 5 Opiniones
          </div>
          <p className="text-sm text-slate-300 text-center md:text-left max-w-2xl">
            Nuestros clientes confían en H &amp; P Autos. Lee sus opiniones y descubre por qué somos la mejor opción en compra y venta de vehículos usados.
          </p>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Lo que opinan nuestros clientes
            </h2>
            <div className="mt-4 h-[2px] w-32 bg-red-600/70 mx-auto" />
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-12 bg-black/40 border border-white/10 rounded-2xl shadow-lg">
              <Star className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Aún no hay opiniones</h3>
              <p className="text-slate-300">Sé el primero en compartir tu experiencia.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="rounded-2xl overflow-hidden bg-gradient-to-b from-black/80 via-black/70 to-black/50 border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.45)]"
                >
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-1 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < testimonial.rating ? 'fill-current' : ''}`}
                        />
                      ))}
                    </div>
                    <h3 className="text-lg font-bold text-white">{testimonial.customer_name}</h3>
                    <p className="text-sm text-slate-300 italic">"{testimonial.comment}"</p>
                  </div>
                  <div className="px-5 pb-5">
                    <button
                      onClick={() => onNavigate?.('contact')}
                      className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg"
                    >
                      Me interesa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-12 bg-gradient-to-r from-black/80 via-[#1b1b1b] to-black/80 border-t border-red-600/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            ¿Ya eres parte de nuestra comunidad?
          </h2>
          <p className="text-slate-300 mb-6">
            Compártenos tu experiencia con H &amp; P Autos y ayuda a más personas a confiar en nosotros.
          </p>
          <button
            onClick={() => onNavigate?.('contact')}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-[0_10px_30px_rgba(239,68,68,0.35)]"
          >
            Dejar Opinión
          </button>
          <div className="mt-6 flex items-center justify-center gap-2 text-slate-300">
            <PhoneCall className="h-4 w-4 text-red-500" />
            <span>+54 11 1234 5678</span>
          </div>
        </div>
      </section>
    </div>
  );
}
