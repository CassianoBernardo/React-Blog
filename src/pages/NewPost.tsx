import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function NewPost() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, userId: user?.id }),
    });
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm mb-8 hover:opacity-70 transition-opacity" style={{ color: 'var(--color-muted-fg)' }}>
        ← Voltar ao Dashboard
      </Link>

      <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-foreground)' }}>
        Novo Post
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
            placeholder="Título do post"
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
            placeholder="Escreva o conteúdo do seu post…"
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
            disabled={loading}
            className="px-6 py-2.5 rounded text-sm font-semibold transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{ backgroundColor: 'var(--color-foreground)', color: 'var(--color-primary-fg)' }}
          >
            {loading ? 'Publicando…' : 'Publicar'}
          </button>
        </div>
      </form>
    </div>
  );
}
