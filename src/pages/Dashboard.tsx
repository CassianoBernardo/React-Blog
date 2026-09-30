import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

interface Post { id: number; userId: number; title: string; body: string; }

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetch(`https://jsonplaceholder.typicode.com/users/${user.id}/posts`)
      .then(r => r.json())
      .then((data: Post[]) => {
        setPosts(data);
        setLoading(false);
      });
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const confirmDelete = (id: number) => setDeleteId(id);
  const cancelDelete = () => setDeleteId(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    await fetch(`https://jsonplaceholder.typicode.com/posts/${deleteId}`, { method: 'DELETE' });
    setPosts(prev => prev.filter(p => p.id !== deleteId));
    setDeleteId(null);
    setDeleting(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-start justify-between mb-10 gap-4 flex-wrap">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--color-muted-fg)' }}>
            Painel do Autor
          </p>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-foreground)' }}>
            {user?.name}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-muted-fg)' }}>Meus Posts</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/novo"
            className="px-5 py-2.5 rounded text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-fg)' }}
          >
            + Novo Post
          </Link>
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 rounded text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ backgroundColor: 'var(--color-muted)', color: 'var(--color-foreground)', border: '1px solid var(--color-border)' }}
          >
            Sair
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-lg p-5 animate-pulse" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
              <div className="h-5 w-2/3 rounded" style={{ backgroundColor: 'var(--color-muted)' }} />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16" style={{ color: 'var(--color-muted-fg)' }}>
          <p className="text-lg mb-4">Nenhum post publicado ainda.</p>
          <Link to="/dashboard/novo" className="text-sm font-medium underline" style={{ color: 'var(--color-accent)' }}>
            Criar primeiro post →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map(post => (
            <div
              key={post.id}
              className="rounded-lg p-5 flex items-center gap-4 group"
              style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}
            >
              <div className="flex-1 min-w-0">
                <Link
                  to={`/post/${post.id}`}
                  className="font-medium capitalize hover:opacity-70 transition-opacity block truncate"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--color-foreground)' }}
                >
                  {post.title}
                </Link>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  to={`/dashboard/editar/${post.id}`}
                  className="px-3 py-1.5 rounded text-xs font-medium transition-colors hover:opacity-80"
                  style={{ backgroundColor: 'var(--color-muted)', color: 'var(--color-foreground)', border: '1px solid var(--color-border)' }}
                >
                  Editar
                </Link>
                <button
                  onClick={() => confirmDelete(post.id)}
                  className="px-3 py-1.5 rounded text-xs font-medium transition-opacity hover:opacity-80"
                  style={{ backgroundColor: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA' }}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="w-full max-w-sm rounded-xl p-8 shadow-xl" style={{ backgroundColor: 'var(--color-card)' }}>
            <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-foreground)' }}>
              Confirmar exclusão
            </h3>
            <p className="text-sm mb-6" style={{ color: 'var(--color-muted-fg)' }}>
              Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded text-sm font-medium"
                style={{ backgroundColor: 'var(--color-muted)', color: 'var(--color-foreground)', border: '1px solid var(--color-border)' }}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 rounded text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
                style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}
              >
                {deleting ? 'Excluindo…' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
