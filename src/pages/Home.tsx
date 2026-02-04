import { useEffect, useState } from 'react';
import {
  Car,
  ShieldCheck,
  BadgeCheck,
  Headset,
  DollarSign,
  CheckCircle2,
  ChevronRight,
  Star,
  PhoneCall,
} from 'lucide-react';
import { supabase, Vehicle, Testimonial } from '../lib/supabase';
import Footer from '../components/Footer';

type HomeProps = {
  onNavigate: (page: string, vehicleId?: string) => void;
};

export default function Home({ onNavigate }: HomeProps) {
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const [leadForm, setLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
    interest: '',
  });
  const [leadSending, setLeadSending] = useState(false);
  const [leadSent, setLeadSent] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [vehiclesResponse, testimonialsResponse] = await Promise.all([
        supabase
          .from('vehicles')
          .select('*')
          .eq('is_featured', true)
          .eq('status', 'available')
          .limit(8),
        supabase
          .from('testimonials')
          .select('*')
          .eq('approved', true)
          .order('created_at', { ascending: false })
          .limit(3),
      ]);

      if (vehiclesResponse.data) setFeaturedVehicles(vehiclesResponse.data);
      if (testimonialsResponse.data) setTestimonials(testimonialsResponse.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadSending(true);
    setLeadSent(false);
    try {
      await supabase.from('contact_messages').insert([
        {
          name: leadForm.name,
          email: leadForm.email,
          phone: leadForm.phone || null,
          message: leadForm.interest || 'Interés general (Home)',
        },
      ]);
      setLeadSent(true);
      setLeadForm({ name: '', phone: '', email: '', interest: '' });
    } catch (error) {
      console.error('Error enviando lead:', error);
    } finally {
      setLeadSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-slate-100">
      {/* HERO */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(0,0,0,0.92), rgba(13,13,17,0.82)), url('/Banner_prado.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_top_left,rgba(255,0,0,0.35),transparent_35%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16 md:py-24 grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Compra y vende tu auto usado
              <span className="text-red-500 block">Fácil y Rápido</span>
            </h1>
            <p className="text-lg text-slate-200/80 max-w-2xl">
              Compra y venta de vehículos usados con evaluación gratuita, pago inmediato y autos verificados.
            </p>
            <div className="space-y-3">
              {[
                'Evaluación gratuita',
                'Pago inmediato',
                'Autos certificados',
                'Trámites sencillos',
              ].map((item) => (
                <div key={item} className="flex items-center space-x-3 text-slate-100">
                  <CheckCircle2 className="h-5 w-5 text-red-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => onNavigate('contact')}
                className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg shadow-red-600/30 transition-transform hover:-translate-y-0.5"
              >
                Vender mi Auto
              </button>
              <button
                onClick={() => onNavigate('catalog')}
                className="px-8 py-4 bg-white text-slate-900 hover:bg-slate-100 font-semibold rounded-lg transition-transform hover:-translate-y-0.5"
              >
                Ver Autos Disponibles
              </button>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/40">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-white">¿Quieres vender o comprar un auto?</h3>
              <p className="text-sm text-slate-300">Déjanos tus datos y te contactamos de inmediato.</p>
            </div>
            <form className="space-y-4" onSubmit={handleLeadSubmit}>
              <div>
                <input
                  type="text"
                  required
                  placeholder="Nombre"
                  value={leadForm.name}
                  onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <input
                  type="tel"
                  required
                  placeholder="Teléfono"
                  value={leadForm.phone}
                  onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={leadForm.email}
                  onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="¿Qué te interesa?"
                  value={leadForm.interest}
                  onChange={(e) => setLeadForm({ ...leadForm, interest: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <button
                type="submit"
                disabled={leadSending}
                className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 font-semibold text-white shadow-lg shadow-red-600/30 disabled:opacity-60"
              >
                {leadSending ? 'Enviando...' : 'Enviar'}
              </button>
              {leadSent && (
                <p className="text-green-400 text-sm font-semibold">¡Datos enviados! Te contactaremos pronto.</p>
              )}
            </form>
            <div className="mt-6 flex items-center space-x-2 text-slate-200">
              <PhoneCall className="h-5 w-5 text-red-500" />
              <span className="font-semibold">+54 11 1234 5678</span>
            </div>
          </div>
        </div>
      </section>

      {/* POR QUÉ ELEGIRNOS */}
      <section className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-slate-900 mb-10">
            ¿Por qué elegir H &amp; P Autos?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: DollarSign, title: 'Pago Inmediato', desc: 'Recibe el dinero en el acto por tu auto.' },
              { icon: ShieldCheck, title: 'Transacción Segura', desc: 'Nos encargamos de todo el papeleo.' },
              { icon: BadgeCheck, title: 'Autos Revisados', desc: 'Vehículos verificados y certificados.' },
              { icon: Headset, title: 'Atención Personalizada', desc: 'Asesoramiento experto en todo momento.' },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-gradient-to-b from-slate-50 to-white border border-slate-100 rounded-xl p-6 text-center shadow-sm"
              >
                <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="text-sm text-slate-600 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INVENTARIO DESTACADO */}
      <section className="bg-[#0f1116] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">Autos Destacados</h2>
              <p className="text-slate-300">Un vistazo a nuestras mejores oportunidades</p>
            </div>
            <button
              onClick={() => onNavigate('catalog')}
              className="hidden md:inline-flex items-center px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-red-600/30 shadow-lg"
            >
              Ver todo el inventario <ChevronRight className="h-5 w-5 ml-2" />
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : featuredVehicles.length === 0 ? (
            <p className="text-center text-slate-300">Aún no hay vehículos destacados.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-1 transition transform cursor-pointer"
                  onClick={() => onNavigate('vehicle-detail', vehicle.id)}
                >
                  <div className="relative h-44 bg-slate-800">
                    {vehicle.images && vehicle.images.length > 0 ? (
                      <img src={vehicle.images[0]} alt={vehicle.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Car className="h-16 w-16 text-slate-400" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-full">
                        {vehicle.condition === 'new' ? 'Nuevo' : 'Usado'}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="text-lg font-bold text-white">{vehicle.title}</h3>
                    <p className="text-sm text-slate-300">
                      {vehicle.brand} {vehicle.model} • {vehicle.year}
                    </p>
                    <p className="text-sm text-slate-400">
                      {vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km • ` : ''}{vehicle.transmission}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-2xl font-extrabold text-red-500">
                        ${vehicle.price.toLocaleString()}
                      </span>
                      <button className="text-sm font-semibold text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg">
                        Me interesa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 text-center md:hidden">
            <button
              onClick={() => onNavigate('catalog')}
              className="inline-flex items-center px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-red-600/30 shadow-lg"
            >
              Ver todo el inventario <ChevronRight className="h-5 w-5 ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="bg-slate-100 py-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,0,0,0.08),transparent_30%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-slate-900 mb-10">¿Cómo funciona?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '1', title: 'Envíanos los datos', desc: 'Comparte la info de tu auto en segundos.' },
              { step: '2', title: 'Evaluamos gratis', desc: 'Tasamos tu auto y certificamos su estado.' },
              { step: '3', title: 'Recibe una oferta justa', desc: 'Pago inmediato sin trámites complicados.' },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-xl p-6 shadow-md border border-slate-100 flex items-start space-x-4"
              >
                <div className="h-10 w-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      {testimonials.length > 0 && (
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Opiniones de nuestros clientes</h2>
              <p className="text-slate-600 mt-2">Experiencias reales de personas que confiaron en nosotros.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white border border-slate-100 rounded-xl p-6 shadow-md"
                >
                  <div className="flex items-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-slate-300'}`}
                      />
                    ))}
                  </div>
                  <p className="text-slate-700 italic mb-4">"{testimonial.comment}"</p>
                  <p className="font-bold text-slate-900">{testimonial.customer_name}</p>
                  <p className="text-xs text-slate-500 mt-1">{new Date(testimonial.created_at).toLocaleDateString('es-MX')}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA FINAL */}
      <section className="bg-gradient-to-b from-black via-[#1a1a1a] to-[#2b2b2b] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-3xl font-extrabold text-white drop-shadow">Cotiza tu auto hoy</h3>
            <p className="text-slate-200 mt-2 drop-shadow">Obtén la mejor oferta con atención inmediata.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 h-12 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-red-600/30 shadow-lg"
            >
              Cotizar mi Auto
            </button>
          </div>
        </div>
      </section>

      {/* WhatsApp flotante */}
      <a
        href="https://wa.me/541112345678?text=Hola%20quiero%20cotizar%20mi%20auto"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-[0_12px_28px_-10px_rgba(0,0,0,0.55)] flex items-center justify-center bg-transparent"
        aria-label="Escríbenos por WhatsApp"
      >
        <img src="/whatsapp.png" alt="WhatsApp" className="h-14 w-14 object-contain" />
      </a>

      <Footer />
    </div>
  );
}
