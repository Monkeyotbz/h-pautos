import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Plus, Edit2, Trash2, FileText } from 'lucide-react';
import { supabase, Article } from '../../lib/supabase';

export default function AdminArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    image_url: '',
    published: false,
  });

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setArticles(data);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Estas seguro de eliminar este articulo?')) return;

    try {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) throw error;
      loadArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Error al eliminar el articulo');
    }
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      slug: article.slug,
      content: article.content,
      excerpt: article.excerpt || '',
      image_url: article.image_url || '',
      published: article.published,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingArticle) {
        const { error } = await supabase
          .from('articles')
          .update(formData)
          .eq('id', editingArticle.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('articles').insert([formData]);
        if (error) throw error;
      }

      setShowForm(false);
      setEditingArticle(null);
      setFormData({ title: '', slug: '', content: '', excerpt: '', image_url: '', published: false });
      loadArticles();
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Error al guardar el articulo');
    } finally {
      setLoading(false);
    }
  };

  if (showForm) {
    return (
      <div className="bg-black/60 border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8 text-slate-100">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-6">
          {editingArticle ? 'Editar Articulo' : 'Nuevo Articulo'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">Titulo *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">Slug (URL) *</label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="mi-articulo-ejemplo"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">Resumen</label>
            <textarea
              rows={2}
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">Contenido *</label>
            <textarea
              rows={12}
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">Imagen de portada (URL)</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="https://images.pexels.com/..."
            />
          </div>

          <div>
            <label className="flex items-center space-x-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="rounded text-red-600 focus:ring-red-500"
              />
              <span className="text-sm font-semibold text-slate-200">Publicar</span>
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 shadow-[0_10px_25px_rgba(239,68,68,0.35)]"
            >
              {loading ? 'Guardando...' : editingArticle ? 'Actualizar' : 'Crear'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingArticle(null);
                setFormData({ title: '', slug: '', content: '', excerpt: '', image_url: '', published: false });
              }}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">Gestion de Articulos</h2>
          <p className="text-slate-300 text-sm">Publica novedades y contenido del blog.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 shadow-[0_10px_25px_rgba(239,68,68,0.35)]"
        >
          <Plus className="h-5 w-5" />
          <span>Nuevo Articulo</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12 bg-white/5 border border-white/10 rounded-2xl shadow-md">
          <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No hay articulos</h3>
          <p className="text-slate-300">Crea tu primer articulo</p>
        </div>
      ) : (
        <div className="bg-black/60 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Titulo</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Publicado</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-300 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-white/5">
                  <td className="px-6 py-4 text-sm font-semibold text-white">{article.title}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{article.slug}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        article.published
                          ? 'bg-green-500/15 text-green-300'
                          : 'bg-white/10 text-slate-300'
                      }`}
                    >
                      {article.published ? 'Si' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleEdit(article)}
                      className="text-blue-300 hover:text-blue-100 mr-4"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="text-red-300 hover:text-red-100"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


