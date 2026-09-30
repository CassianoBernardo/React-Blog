import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = await login(identifier, password);
    setLoading(false);
    if (ok) {
      navigate('/dashboard', { replace: true });
    } else {
      setError('Usuário ou e-mail não encontrado. Tente um dos usuários do JSONPlaceholder (ex: Bret, Antonette).');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-foreground)' }}>
            Entrar
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-muted-fg)' }}>
            Acesse o painel de autor
          </p>
        </div>

        <div className="rounded-lg p-8" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="text-sm px-4 py-3 rounded leading-relaxed" style={{ backgroundColor: '#FEF2F2', color: '#991B1B' }}>
                {error}
              </div>
            )}

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-muted-fg)' }}>
                Usuário ou e-mail
              </span>
              <input
                type="text"
                placeholder="ex: Bret ou Sincere@april.biz"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
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
                Senha
              </span>
              <input
                type="password"
                placeholder="Qualquer senha"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded text-sm outline-none"
                style={{
                  backgroundColor: 'var(--color-muted)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-foreground)',
                }}
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded text-sm font-semibold transition-opacity hover:opacity-80 disabled:opacity-50 mt-2"
              style={{ backgroundColor: 'var(--color-foreground)', color: 'var(--color-primary-fg)' }}
            >
              {loading ? 'Entrando…' : 'Entrar'}
            </button>
          </form>

          <p className="mt-6 text-xs text-center" style={{ color: 'var(--color-muted-fg)' }}>
            Use um usuário do{' '}
            <a
              href="https://jsonplaceholder.typicode.com/users"
              target="_blank"
              rel="noreferrer"
              className="underline hover:opacity-70"
              style={{ color: 'var(--color-accent)' }}
            >
              JSONPlaceholder
            </a>{' '}
            (qualquer senha).
          </p>
        </div>

        <p className="text-center text-sm mt-6" style={{ color: 'var(--color-muted-fg)' }}>
          <Link to="/" className="hover:opacity-70 transition-opacity" style={{ color: 'var(--color-foreground)' }}>
            ← Voltar aos posts
          </Link>
        </p>
      </div>
    </div>
  );
}
