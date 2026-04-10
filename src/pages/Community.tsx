import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Star, MessageCircle, PhoneCall, X } from 'lucide-react';
import { supabase, Testimonial } from '../lib/supabase';

type CommunityProps = {
  onNavigate?: (page: string, vehicleId?: string) => void;
};

export default function Community({ onNavigate }: CommunityProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal de opinión
  const [modalOpen, setModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formComment, setFormComment] = useState('');
  const [formHoverRating, setFormHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    loadData();
    document.title = 'Opiniones de clientes | P & H Autos';
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

  const openModal = () => {
    setFormName('');
    setFormRating(5);
    setFormComment('');
    setFormHoverRating(0);
    setSubmitStatus('idle');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formComment.trim()) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from('testimonials').insert({
        customer_name: formName.trim(),
        rating: formRating,
        comment: formComment.trim(),
        approved: false,
      });
      if (error) throw error;
      setSubmitStatus('success');
    } catch {
      setSubmitStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-slate-100">
      <Helmet>
        <title>Opiniones de clientes | P &amp; H Autos</title>
        <meta name="description" content="Lee las opiniones reales de nuestros clientes sobre P &amp; H Autos. Comparte tu experiencia con nuestra comunidad de Antioquia." />
        <meta property="og:title" content="Comunidad P &amp; H Autos | Opiniones de clientes" />
        <meta property="og:description" content="Opiniones reales de clientes que confiaron en P &amp; H Autos para comprar o vender su vehículo." />
        <meta property="og:url" content="https://h-pautos.vercel.app/community" />
      </Helmet>
      <main>
      {/* Hero */}
      <section
        className="relative overflow-hidden community-hero-bg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-14 md:py-20 relative z-10">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-red-400">Comunidad</p>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Comunidad de P &amp; H Autos
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
              href="https://wa.me/573245799091?text=Hola%20quiero%20dejar%20mi%20opinión"
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
            Nuestros clientes confían en P &amp; H Autos. Lee sus opiniones y descubre por qué somos la mejor opción en compra y venta de vehículos usados.
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
            Compártenos tu experiencia con P &amp; H Autos y ayuda a más personas a confiar en nosotros.
          </p>
          <button
            onClick={openModal}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-[0_10px_30px_rgba(239,68,68,0.35)]"
          >
            Dejar Opinión
          </button>
          <div className="mt-6 flex items-center justify-center gap-2 text-slate-300">
            <PhoneCall className="h-4 w-4 text-red-500" />
            <span>324 579 9091</span>
          </div>
        </div>
      </section>
      </main>

      {/* Modal Dejar Opinión */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#151518] border border-white/10 rounded-2xl shadow-2xl p-6">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>

            {submitStatus === 'success' ? (
              <div className="text-center py-6">
                <div className="flex items-center justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">¡Gracias por tu opinión!</h3>
                <p className="text-slate-300 text-sm mb-6">
                  Tu comentario fue enviado y estará visible una vez que sea revisado por nuestro equipo.
                </p>
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-white mb-1">Dejar una opinión</h2>
                <p className="text-slate-400 text-sm mb-5">
                  Tu opinión será publicada tras ser aprobada por el equipo.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Nombre *</label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      required
                      maxLength={80}
                      placeholder="Tu nombre"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Calificación *</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          aria-label={`${star} estrellas`}
                          onClick={() => setFormRating(star)}
                          onMouseEnter={() => setFormHoverRating(star)}
                          onMouseLeave={() => setFormHoverRating(0)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-7 w-7 transition-colors ${
                              star <= (formHoverRating || formRating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-slate-700 text-slate-700'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Comentario *</label>
                    <textarea
                      value={formComment}
                      onChange={(e) => setFormComment(e.target.value)}
                      required
                      maxLength={500}
                      rows={4}
                      placeholder="Cuéntanos tu experiencia con P &amp; H Autos..."
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors resize-none"
                    />
                    <p className="text-xs text-slate-500 text-right mt-1">{formComment.length}/500</p>
                  </div>

                  {submitStatus === 'error' && (
                    <p className="text-red-400 text-sm">Ocurrió un error. Intenta de nuevo.</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting || !formName.trim() || !formComment.trim()}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                  >
                    {submitting ? 'Enviando...' : 'Enviar opinión'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
