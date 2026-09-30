import { useState, useEffect, type FormEvent } from 'react';
import { Link, useParams } from 'react-router';

interface Post { id: number; userId: number; title: string; body: string; }
interface User { id: number; name: string; }
interface Comment { id: number; postId: number; name: string; email: string; body: string; }

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [author, setAuthor] = useState<User | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ name: '', email: '', body: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setSent(false);
    Promise.all([
      fetch(`https://jsonplaceholder.typicode.com/posts/${id}`).then(r => r.json()),
      fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`).then(r => r.json()),
    ]).then(async ([postData, commentsData]: [Post, Comment[]]) => {
      setPost(postData);
      setComments(commentsData);
      const userData: User = await fetch(`https://jsonplaceholder.typicode.com/users/${postData.userId}`).then(r => r.json());
      setAuthor(userData);
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    await fetch('https://jsonplaceholder.typicode.com/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId: Number(id), ...form }),
    });
    setComments(prev => [
      { id: Date.now(), postId: Number(id), ...form },
      ...prev,
    ]);
    setForm({ name: '', email: '', body: '' });
    setSending(false);
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  if (loading) return <PostSkeleton />;
  if (!post) return <div className="max-w-3xl mx-auto px-6 py-16 text-center" style={{ color: 'var(--color-muted-fg)' }}>Post não encontrado.</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link to="/" className="inline-flex items-center gap-1 text-sm mb-8 hover:opacity-70 transition-opacity" style={{ color: 'var(--color-muted-fg)' }}>
        ← Todos os posts
      </Link>

      <article className="mb-12">
        <h1
          className="text-3xl sm:text-4xl font-bold leading-tight capitalize mb-4"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-foreground)' }}
        >
          {post.title}
        </h1>
        {author && (
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: 'var(--color-muted)', color: 'var(--color-foreground)' }}>
              {author.name.charAt(0)}
            </div>
            <Link to={`/autor/${author.id}`} className="text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: 'var(--color-accent)' }}>
              {author.name}
            </Link>
          </div>
        )}
        <div
          className="rounded-lg p-8"
          style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}
        >
          <p className="leading-relaxed text-base whitespace-pre-line" style={{ color: 'var(--color-foreground)' }}>
            {post.body}
          </p>
        </div>
      </article>

      {/* Comment form */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-5" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-foreground)' }}>
          Deixe um comentário
        </h2>
        <form
          onSubmit={handleSubmit}
          className="rounded-lg p-6 flex flex-col gap-4"
          style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}
        >
          {sent && (
            <div className="text-sm px-4 py-2 rounded" style={{ backgroundColor: '#ECFDF5', color: '#065F46' }}>
              Comentário enviado com sucesso!
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-muted-fg)' }}>Nome *</span>
              <input
                type="text"
                placeholder="Seu nome"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
                className="w-full px-3 py-2 rounded text-sm outline-none"
                style={{ backgroundColor: 'var(--color-muted)', border: '1px solid var(--color-border)', color: 'var(--color-foreground)' }}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-muted-fg)' }}>E-mail *</span>
              <input
                type="email"
                placeholder="seu@email.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
                className="w-full px-3 py-2 rounded text-sm outline-none"
                style={{ backgroundColor: 'var(--color-muted)', border: '1px solid var(--color-border)', color: 'var(--color-foreground)' }}
              />
            </label>
          </div>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-muted-fg)' }}>Comentário *</span>
            <textarea
              placeholder="Escreva seu comentário…"
              rows={4}
              value={form.body}
              onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
              required
              className="w-full px-3 py-2 rounded text-sm outline-none resize-y"
              style={{ backgroundColor: 'var(--color-muted)', border: '1px solid var(--color-border)', color: 'var(--color-foreground)' }}
            />
          </label>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={sending}
              className="px-6 py-2.5 rounded text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
              style={{ backgroundColor: 'var(--color-foreground)', color: 'var(--color-primary-fg)' }}
            >
              {sending ? 'Enviando…' : 'Enviar comentário'}
            </button>
          </div>
        </form>
      </section>

      {/* Comments list */}
      <section>
        <h2 className="text-xl font-semibold mb-5" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-foreground)' }}>
          {comments.length} Comentários
        </h2>
        <div className="flex flex-col gap-4">
          {comments.map(c => (
            <div key={c.id} className="rounded-lg p-5" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: 'var(--color-muted)', color: 'var(--color-foreground)' }}>
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold capitalize" style={{ color: 'var(--color-foreground)' }}>{c.name}</p>
                  <p className="text-xs" style={{ color: 'var(--color-muted-fg)' }}>{c.email}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-foreground)' }}>{c.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function PostSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 animate-pulse">
      <div className="h-4 w-32 rounded mb-8" style={{ backgroundColor: 'var(--color-muted)' }} />
      <div className="h-10 w-3/4 rounded mb-4" style={{ backgroundColor: 'var(--color-muted)' }} />
      <div className="h-4 w-40 rounded mb-8" style={{ backgroundColor: 'var(--color-muted)' }} />
      <div className="rounded-lg p-8 h-48" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }} />
    </div>
  );
}
