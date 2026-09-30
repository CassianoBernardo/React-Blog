import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router';

interface Post { id: number; userId: number; title: string; body: string; }
interface User { id: number; name: string; username: string; email: string; }

export default function AuthorPage() {
  const { id } = useParams<{ id: string }>();
  const [author, setAuthor] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      fetch(`https://jsonplaceholder.typicode.com/users/${id}`).then(r => r.json()),
      fetch(`https://jsonplaceholder.typicode.com/users/${id}/posts`).then(r => r.json()),
    ]).then(([userData, postsData]: [User, Post[]]) => {
      setAuthor(userData);
      setPosts(postsData);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <AuthorSkeleton />;
  if (!author) return <div className="max-w-3xl mx-auto px-6 py-16 text-center" style={{ color: 'var(--color-muted-fg)' }}>Autor não encontrado.</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link to="/" className="inline-flex items-center gap-1 text-sm mb-8 hover:opacity-70 transition-opacity" style={{ color: 'var(--color-muted-fg)' }}>
        ← Todos os posts
      </Link>

      <div
        className="rounded-lg p-8 mb-10 flex items-center gap-6"
        style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0"
          style={{ backgroundColor: 'var(--color-muted)', color: 'var(--color-foreground)', fontFamily: 'var(--font-display)' }}
        >
          {author.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-foreground)' }}>
            {author.name}
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-muted-fg)' }}>@{author.username} · {author.email}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-5" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-foreground)' }}>
        {posts.length} Publicações
      </h2>

      <div className="flex flex-col gap-4">
        {posts.map(post => (
          <Link
            key={post.id}
            to={`/post/${post.id}`}
            className="group rounded-lg p-5 transition-shadow hover:shadow-md flex flex-col gap-2"
            style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}
          >
            <h3
              className="font-semibold capitalize group-hover:opacity-70 transition-opacity"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-foreground)' }}
            >
              {post.title}
            </h3>
            <p className="text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--color-muted-fg)' }}>
              {post.body}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function AuthorSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 animate-pulse">
      <div className="h-4 w-32 rounded mb-8" style={{ backgroundColor: 'var(--color-muted)' }} />
      <div className="rounded-lg p-8 mb-10 flex gap-6 items-center" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
        <div className="w-16 h-16 rounded-full" style={{ backgroundColor: 'var(--color-muted)' }} />
        <div className="flex-1">
          <div className="h-6 w-40 rounded mb-2" style={{ backgroundColor: 'var(--color-muted)' }} />
          <div className="h-4 w-56 rounded" style={{ backgroundColor: 'var(--color-muted)' }} />
        </div>
      </div>
    </div>
  );
}
