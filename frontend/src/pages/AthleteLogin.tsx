import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, setToken } from '../services/api';

export function AthleteLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('atleta@demo.com');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post<{
        accessToken: string;
        user: { role: string };
      }>('/api/auth/login', { email, password });
      if (res.user.role !== 'ATHLETE') {
        setError('Esta conta é de treinador. Acesse a área do personal.');
        return;
      }
      setToken(res.accessToken);
      navigate('/athlete/home');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Credenciais inválidas. Verifique email e senha.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="welcome">
      <div className="welcome__card" style={{ maxWidth: 400 }}>
        <p className="welcome__brand">Área do atleta</p>
        <h1 className="welcome__title" style={{ fontSize: '1.35rem' }}>
          Meu treino
        </h1>
        <p className="welcome__lead" style={{ marginBottom: '1.25rem' }}>
          Entre para ver o treino prescrito, executar com timer e registrar
          feedback.
        </p>
        <div className="card" style={{ marginBottom: 0, background: 'var(--color-bg-sunken)' }}>
          <form onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="a-email">Email</label>
              <input
                id="a-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="a-pass">Senha</label>
              <input
                id="a-pass"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error ? <p className="form-error">{error}</p> : null}
            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              disabled={loading}
            >
              {loading ? 'Entrando…' : 'Entrar'}
            </button>
          </form>
        </div>
        <p className="welcome__hint" style={{ marginTop: '1.25rem' }}>
          <Link to="/login" className="link-subtle">
            Sou treinador(a)
          </Link>
          {' · '}
          <Link to="/" className="link-subtle">
            Início
          </Link>
        </p>
      </div>
    </div>
  );
}
