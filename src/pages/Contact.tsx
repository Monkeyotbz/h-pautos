import { useState } from 'react';
import type { FormEvent } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

type ContactProps = {
  onNavigate?: (page: string, vehicleId?: string) => void;
};

export default function Contact({ onNavigate }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: submitError } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
            message: formData.message,
          },
        ]);

      if (submitError) throw submitError;

      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });

      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Hubo un error al enviar tu mensaje. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-slate-100">
      {/* Hero */}
      <section className="relative overflow-hidden contact-hero-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 md:py-16 relative z-10">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-red-400">Contacto</p>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              H &amp; P Autos
            </h1>
            <p className="text-lg text-slate-200/80">
              Estamos listos para ayudarte.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => onNavigate?.('home')}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-[0_10px_30px_rgba(239,68,68,0.35)] flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" />
                Enviar mensaje
              </button>
              <button
                onClick={() => onNavigate?.('catalog')}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/15"
              >
                Ver temas
              </button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-[#0b0b0f]" />
      </section>

      {/* Form + Contact */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-b from-black/70 via-black/60 to-black/40 border border-white/10 rounded-2xl shadow-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-8 tracking-wide mt-4">Envíanos un mensaje</h2>

              {success && (
                <div className="mb-6 p-4 bg-green-900/60 border border-green-700 rounded-lg flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-green-200 font-semibold">¡Mensaje enviado con éxito!</p>
                    <p className="text-green-100">Nos pondremos en contacto contigo lo antes posible.</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-900/60 border border-red-700 rounded-lg">
                  <p className="text-red-200">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-slate-100 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent placeholder-slate-400"
                    placeholder="Nombre"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-slate-100 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent placeholder-slate-400"
                    placeholder="Email"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-slate-100 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent placeholder-slate-400"
                    placeholder="Teléfono"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-slate-100 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent resize-none placeholder-slate-400"
                    placeholder="Mensaje"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Enviar mensaje</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-b from-black/70 via-black/60 to-black/40 border border-white/10 rounded-2xl shadow-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-5 tracking-wide mt-4">Contáctanos</h3>
              <a
                href="https://wa.me/573245799091?text=Hola%20quiero%20contactar"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 mb-4"
              >
                <MessageCircle className="h-5 w-5" />
                Hablar por WhatsApp
              </a>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <Phone className="h-4 w-4 text-red-500 mt-1" />
                  <div>
                    <p className="text-slate-200">324 579 9091</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Mail className="h-4 w-4 text-red-500 mt-1" />
                  <div>
                    <p className="text-slate-200">phautos2025@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-red-500 mt-1" />
                  <div>
                    <p className="text-slate-200">Antioquia</p>
                    <p className="text-slate-300">Área Metropolitana</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="h-4 w-4 text-red-500 mt-1" />
                  <div>
                    <p className="text-slate-200">Horario</p>
                    <p className="text-slate-300">Lun - Vie: 9:00 - 18:00</p>
                    <p className="text-slate-300">Sáb: 9:00 - 13:00</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="mt-10 bg-gradient-to-b from-black/70 via-black/60 to-black/40 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-5 text-center text-slate-200 font-semibold tracking-wide">MAP AQUÍ</div>
          <div className="h-56 bg-slate-900">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126916.73961650311!2d-75.5812115!3d6.2442034500000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e4428dfb80fad05%3A0x42137cfcc7b53b56!2sMedell%C3%ADn%2C%20Antioquia!5e0!3m2!1ses-419!2sco!4v1760637142819!5m2!1ses-419!2sco"
              width="100%"
              height="100%"
              className="map-iframe"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa H & P AUTOS"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}


