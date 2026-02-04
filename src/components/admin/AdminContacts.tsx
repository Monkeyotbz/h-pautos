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
    if (!confirm('¿Estás seguro de eliminar este mensaje?')) return;

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
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Mensajes de Contacto</h2>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Mail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay mensajes</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${
                !contact.read ? 'border-l-4 border-orange-600' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <h3 className="text-lg font-semibold text-slate-900">{contact.name}</h3>
                    {!contact.read && (
                      <span className="ml-3 px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                        Nuevo
                      </span>
                    )}
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      <a href={`mailto:${contact.email}`} className="hover:text-orange-600">
                        {contact.email}
                      </a>
                    </div>
                    {contact.phone && (
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        <a href={`tel:${contact.phone}`} className="hover:text-orange-600">
                          {contact.phone}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center text-gray-600 text-sm">
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
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">{contact.message}</p>
                  </div>
                </div>
                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={() => handleMarkAsRead(contact.id, !contact.read)}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                      contact.read
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        : 'bg-orange-600 text-white hover:bg-orange-700'
                    }`}
                  >
                    {contact.read ? 'Marcar como no leído' : 'Marcar como leído'}
                  </button>
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
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
