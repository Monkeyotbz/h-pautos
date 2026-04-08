import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
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
  Calendar,
  Gauge,
} from 'lucide-react';
import { supabase, Vehicle, Testimonial, VehicleImage, normalizeStorageUrl } from '../lib/supabase';
import Footer from '../components/Footer';

type HomeProps = {
  onNavigate: (page: string, vehicleId?: string) => void;
};

type VehicleWithImages = Vehicle & { vehicle_images?: VehicleImage[] };

export default function Home({ onNavigate }: HomeProps) {
  const [featuredVehicles, setFeaturedVehicles] = useState<VehicleWithImages[]>([]);
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
          .select('id, title, brand, model, year, price, km, condition, transmission, fuel, location, description, status, created_at, rating, vehicle_images (url, sort_order)')
          .eq('status', 'activo')
          .order('created_at', { ascending: false })
          .limit(8),
        supabase
          .from('testimonials')
          .select('*')
          .eq('approved', true)
          .order('created_at', { ascending: false })
          .limit(3),
      ]);

      if (vehiclesResponse.data) setFeaturedVehicles(vehiclesResponse.data as VehicleWithImages[]);
      if (testimonialsResponse.data) setTestimonials(testimonialsResponse.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLeadSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLeadSending(true);
    setLeadSent(false);
    try {
      await supabase.from('contact_messages').insert([
        {
          name: leadForm.name,
          email: leadForm.email,
          phone: leadForm.phone || null,
          message: leadForm.interest || 'Interes general (Home)',
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

  const getVehicleImage = (vehicle: VehicleWithImages) => {
    const cover = normalizeStorageUrl(vehicle.cover_image_url);
    if (cover) return cover;
    const images = vehicle.vehicle_images || [];
    const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
    return normalizeStorageUrl(sorted[0]?.url) || null;
  };

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-slate-100">
      {/* HERO */}
      <section
        className="relative overflow-hidden home-hero-bg"
      >
        <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_top_left,rgba(255,0,0,0.35),transparent_35%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16 md:py-24 grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Compra y vende tu auto usado
              <span className="text-red-500 block">Facil y Rapido</span>
            </h1>
            <p className="text-lg text-slate-200/80 max-w-2xl">
              Compra y venta de vehiculos usados con evaluacion gratuita, pago inmediato y autos verificados.
            </p>
            <div className="space-y-3">
              {[
                'Evaluacion gratuita',
                'Pago inmediato',
                'Autos certificados',
                'Tramites sencillos',
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
              <p className="text-sm text-slate-300">Dejanos tus datos y te contactamos de inmediato.</p>
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
                  placeholder="Telefono"
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
                  placeholder="¿Que te interesa?"
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
              <span className="font-semibold">324 579 9091</span>
            </div>
          </div>
        </div>
      </section>

      {/* POR QUE ELEGIRNOS */}
      <section className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-slate-900 mb-10">
            ¿Por que elegir H & P Autos?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: DollarSign, title: 'Pago Inmediato', desc: 'Recibe el dinero en el acto por tu auto.' },
              { icon: ShieldCheck, title: 'Transaccion Segura', desc: 'Nos encargamos de todo el papeleo.' },
              { icon: BadgeCheck, title: 'Autos Revisados', desc: 'Vehiculos verificados y certificados.' },
              { icon: Headset, title: 'Atencion Personalizada', desc: 'Asesoramiento experto en todo momento.' },
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
            <p className="text-center text-slate-300">Aun no hay vehiculos disponibles.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredVehicles.map((vehicle) => {
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
                    <div className="relative h-48 overflow-hidden">
                      {imageUrl ? (
                        <img 
                          src={imageUrl} 
                          alt={vehicle.title} 
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
                    <div className="p-4 space-y-3">
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
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {vehicle.year}
                        </span>
                        <span className="flex items-center gap-1">
                          <Gauge className="h-3.5 w-3.5" />
                          {vehicle.km.toLocaleString()} km
                        </span>
                      </div>
                      
                      {/* Precio y botón */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                        <div>
                          <p className="text-xs text-slate-500 font-medium">Precio</p>
                          <p className="text-xl font-extrabold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                            ${Number(vehicle.price).toLocaleString()}
                          </p>
                        </div>
                        <button className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-bold rounded-lg shadow-lg shadow-red-900/50 transition-all">
                          Ver más
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

      {/* COMO FUNCIONA */}
      <section className="bg-slate-100 py-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,0,0,0.08),transparent_30%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-slate-900 mb-10">¿Como funciona?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '1', title: 'Envianos los datos', desc: 'Comparte la info de tu auto en segundos.' },
              { step: '2', title: 'Evaluamos gratis', desc: 'Tasamos tu auto y certificamos su estado.' },
              { step: '3', title: 'Recibe una oferta justa', desc: 'Pago inmediato sin tramites complicados.' },
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
                <div key={testimonial.id} className="bg-white border border-slate-100 rounded-xl p-6 shadow-md">
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
            <p className="text-slate-200 mt-2 drop-shadow">Obten la mejor oferta con atencion inmediata.</p>
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
        href="https://wa.me/573245799091?text=Hola%20quiero%20cotizar%20mi%20auto"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-[0_12px_28px_-10px_rgba(0,0,0,0.55)] flex items-center justify-center bg-transparent"
        aria-label="Escribenos por WhatsApp"
      >
        <img src="/whatsapp.png" alt="WhatsApp" className="h-14 w-14 object-contain" />
      </a>

      <Footer />
    </div>
  );
}



