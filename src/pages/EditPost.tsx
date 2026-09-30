import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router';

interface Post { id: number; userId: number; title: string; body: string; }

export default function EditPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then(r => r.json())
      .then((data: Post) => {
        setTitle(data.title);
        setBody(data.body);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: Number(id), title, body }),
    });
    setSaving(false);
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12 animate-pulse">
        <div className="h-4 w-32 rounded mb-8" style={{ backgroundColor: 'var(--color-muted)' }} />
        <div className="h-8 w-48 rounded mb-8" style={{ backgroundColor: 'var(--color-muted)' }} />
        <div className="rounded-lg p-8 h-64" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm mb-8 hover:opacity-70 transition-opacity" style={{ color: 'var(--color-muted-fg)' }}>
        ← Voltar ao Dashboard
      </Link>

      <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-foreground)' }}>
        Editar Post
      </h1>

      <form
        onSubmit={handleSubmit}
        className="rounded-lg p-8 flex flex-col gap-5"
        style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}
      >
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-muted-fg)' }}>
            Título *
          </span>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2.5 rounded text-sm outline-none"
            style={{
              backgroundColor: 'var(--color-muted)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-foreground)',
            }}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-muted-fg)' }}>
            Conteúdo *
          </span>
          <textarea
            rows={10}
            value={body}
            onChange={e => setBody(e.target.value)}
            required
            className="w-full px-3 py-2.5 rounded text-sm outline-none resize-y"
            style={{
              backgroundColor: 'var(--color-muted)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-foreground)',
            }}
          />
        </label>

        <div className="flex gap-3 justify-end pt-2">
          <Link
            to="/dashboard"
            className="px-5 py-2.5 rounded text-sm font-medium"
            style={{ backgroundColor: 'var(--color-muted)', color: 'var(--color-foreground)', border: '1px solid var(--color-border)' }}
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded text-sm font-semibold transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{ backgroundColor: 'var(--color-foreground)', color: 'var(--color-primary-fg)' }}
          >
            {saving ? 'Salvando…' : 'Salvar alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}
