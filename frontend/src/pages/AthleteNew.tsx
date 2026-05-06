import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { PersonalNav } from '../components/PersonalNav';
import { api, getToken } from '../services/api';

export function AthleteNew() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [objective, setObjective] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!getToken()) navigate('/login');
  }, [navigate]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const a = await api.post<{ id: string }>('/api/athletes', {
        name,
        email,
        password,
        phone: phone || undefined,
        position: position || undefined,
        objective: objective || undefined,
      });
      navigate(`/athletes/${a.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <PersonalNav />
      <PageHeader
        title="Novo atleta"
        subtitle="Dados e credenciais para acesso à área do atleta."
        breadcrumbs={
          <Link to="/athletes" className="link-subtle">
            ← Atletas
          </Link>
        }
      />
      <div className="card" style={{ maxWidth: 520 }}>
        <form onSubmit={onSubmit}>
          <div className="form-section">
            <h3 className="form-section__title">Identificação</h3>
            <div className="field">
              <label htmlFor="an-name">Nome completo</label>
              <input
                id="an-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="an-email">Email</label>
              <input
                id="an-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-section">
            <h3 className="form-section__title">Acesso ao app</h3>
            <div className="field">
              <label htmlFor="an-pass">Senha para o atleta</label>
              <input
                id="an-pass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="Mínimo 6 caracteres"
              />
              <span className="muted" style={{ fontSize: '0.8rem' }}>
                Obrigatória: o atleta entra em “Sou atleta” com este email e
                senha. Você pode alterar depois no perfil dele.
              </span>
            </div>
          </div>
          <div className="form-section">
            <h3 className="form-section__title">Perfil esportivo</h3>
            <div className="field">
              <label htmlFor="an-phone">Telefone</label>
              <input
                id="an-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="an-pos">Posição</label>
              <input
                id="an-pos"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="an-obj">Objetivo</label>
              <input
                id="an-obj"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
              />
            </div>
          </div>
          {error ? <p className="form-error">{error}</p> : null}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '…' : 'Cadastrar atleta'}
          </button>
        </form>
      </div>
    </div>
  );
}
