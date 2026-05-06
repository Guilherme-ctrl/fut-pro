import { useId, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, setToken } from '../services/api';

export function PersonalLogin() {
  const navigate = useNavigate();
  const tabId = useId();
  const [email, setEmail] = useState('personal@demo.com');
  const [password, setPassword] = useState('demo123');
  const [name, setName] = useState('Novo Personal');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'register') {
        const res = await api.post<{
          accessToken: string;
        }>('/api/auth/register', { email, password, name });
        setToken(res.accessToken);
      } else {
        const res = await api.post<{
          accessToken: string;
        }>('/api/auth/login', { email, password });
        setToken(res.accessToken);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="welcome">
      <div className="welcome__card" style={{ maxWidth: 440 }}>
        <p className="welcome__brand">Área do treinador</p>
        <h1 className="welcome__title" style={{ fontSize: '1.35rem' }}>
          Entrar ou criar conta
        </h1>
        <p className="welcome__lead" style={{ marginBottom: '1.25rem' }}>
          Prescreva protocolos, acompanhe aderência e alertas dos seus atletas.
        </p>
        <div
          className="segmented"
          role="tablist"
          aria-label="Modo de acesso"
        >
          <button
            type="button"
            role="tab"
            id={`${tabId}-login`}
            aria-selected={mode === 'login'}
            aria-controls={`${tabId}-panel`}
            onClick={() => setMode('login')}
          >
            Entrar
          </button>
          <button
            type="button"
            role="tab"
            id={`${tabId}-register`}
            aria-selected={mode === 'register'}
            aria-controls={`${tabId}-panel`}
            onClick={() => setMode('register')}
          >
            Criar conta
          </button>
        </div>
        <div
          id={`${tabId}-panel`}
          role="tabpanel"
          aria-labelledby={
            mode === 'login' ? `${tabId}-login` : `${tabId}-register`
          }
        >
          <form onSubmit={onSubmit}>
            {mode === 'register' && (
              <div className="field">
                <label htmlFor="name">Nome</label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                type="password"
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
              {loading ? '…' : mode === 'login' ? 'Entrar' : 'Registrar'}
            </button>
          </form>
        </div>
        <p className="welcome__hint" style={{ marginTop: '1.25rem' }}>
          <Link to="/athlete/login" className="link-subtle">
            Sou atleta
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
