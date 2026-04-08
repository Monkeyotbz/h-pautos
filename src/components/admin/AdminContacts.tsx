import { useEffect, useState } from 'react';
import { Mail, Phone, Calendar, Trash2 } from 'lucide-react';
import { supabase, ContactMessage } from '../../lib/supabase';

export default function AdminContacts() {
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setContacts(data);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string, read: boolean) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ read })
        .eq('id', id);

      if (error) throw error;
      loadContacts();
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Estas seguro de eliminar este mensaje?')) return;

    try {
      const { error } = await supabase.from('contact_messages').delete().eq('id', id);
      if (error) throw error;
      loadContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Error al eliminar el mensaje');
    }
  };

  return (
    <div className="text-slate-100">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white">Mensajes de Contacto</h2>
        <p className="text-slate-300 text-sm">Responde rapido y gestiona nuevas consultas.</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-12 bg-white/5 border border-white/10 rounded-2xl shadow-md">
          <Mail className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No hay mensajes</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`bg-black/60 border border-white/10 rounded-2xl shadow-2xl p-6 hover:shadow-2xl transition-shadow ${
                !contact.read ? 'border-l-4 border-red-500' : ''
              }`}
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <h3 className="text-lg font-semibold text-white">{contact.name}</h3>
                    {!contact.read && (
                      <span className="ml-3 px-2 py-1 text-xs font-semibold rounded-full bg-red-500/15 text-red-300">
                        Nuevo
                      </span>
                    )}
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-slate-300">
                      <Mail className="h-4 w-4 mr-2" />
                      <a href={`mailto:${contact.email}`} className="hover:text-red-300">
                        {contact.email}
                      </a>
                    </div>
                    {contact.phone && (
                      <div className="flex items-center text-slate-300">
                        <Phone className="h-4 w-4 mr-2" />
                        <a href={`tel:${contact.phone}`} className="hover:text-red-300">
                          {contact.phone}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center text-slate-400 text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(contact.created_at).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                    <p className="text-slate-200 whitespace-pre-wrap">{contact.message}</p>
                  </div>
                </div>
                <div className="flex md:flex-col gap-2">
                  <button
                    onClick={() => handleMarkAsRead(contact.id, !contact.read)}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                      contact.read
                        ? 'bg-white/10 text-slate-200 hover:bg-white/20'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    {contact.read ? 'Marcar como no leido' : 'Marcar como leido'}
                  </button>
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="p-2 bg-red-500/15 text-red-300 rounded-lg hover:bg-red-500/25 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="h-5 w-5" />
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
