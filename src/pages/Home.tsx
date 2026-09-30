import { useState, useEffect } from 'react';
import { Link } from 'react-router';

interface Post { id: number; userId: number; title: string; body: string; }
interface User { id: number; name: string; }

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<Record<number, User>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('https://jsonplaceholder.typicode.com/posts').then(r => r.json()),
      fetch('https://jsonplaceholder.typicode.com/users').then(r => r.json()),
    ]).then(([postsData, usersData]: [Post[], User[]]) => {
      setPosts(postsData);
      const map: Record<number, User> = {};
      usersData.forEach(u => (map[u.id] = u));
      setUsers(map);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingState />;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1
          className="text-4xl font-bold leading-tight mb-2"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-foreground)' }}
        >
          Artigos Recentes
        </h1>
        <p className="text-base" style={{ color: 'var(--color-muted-fg)' }}>
          {posts.length} publicações de {Object.keys(users).length} autores
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {posts.map(post => (
          <PostCard key={post.id} post={post} author={users[post.userId]} />
        ))}
      </div>
    </div>
  );
}

function PostCard({ post, author }: { post: Post; author: User | undefined }) {
  const summary = post.body.length > 120 ? post.body.slice(0, 120) + '…' : post.body;

  return (
    <article
      className="rounded-lg p-6 flex flex-col gap-3 transition-shadow hover:shadow-md"
      style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}
    >
      <Link to={`/post/${post.id}`} className="group">
        <h2
          className="text-lg font-semibold leading-snug capitalize group-hover:opacity-70 transition-opacity"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-foreground)' }}
        >
          {post.title}
        </h2>
      </Link>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted-fg)' }}>
        {summary}
      </p>
      <div className="flex items-center justify-between mt-auto pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
        {author && (
          <Link
            to={`/autor/${author.id}`}
            className="text-xs font-medium hover:opacity-70 transition-opacity"
            style={{ color: 'var(--color-accent)' }}
          >
            {author.name}
          </Link>
        )}
        <Link
          to={`/post/${post.id}`}
          className="text-xs font-medium hover:opacity-70 transition-opacity ml-auto"
          style={{ color: 'var(--color-foreground)' }}
        >
          Ler →
        </Link>
      </div>
    </article>
  );
}

function LoadingState() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-10">
        <div className="h-10 w-64 rounded animate-pulse" style={{ backgroundColor: 'var(--color-muted)' }} />
        <div className="h-4 w-40 rounded mt-2 animate-pulse" style={{ backgroundColor: 'var(--color-muted)' }} />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="rounded-lg p-6 animate-pulse" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <div className="h-5 rounded w-3/4 mb-3" style={{ backgroundColor: 'var(--color-muted)' }} />
            <div className="h-4 rounded w-full mb-2" style={{ backgroundColor: 'var(--color-muted)' }} />
            <div className="h-4 rounded w-2/3" style={{ backgroundColor: 'var(--color-muted)' }} />
          </div>
        ))}
      </div>
    </div>
  );
}
