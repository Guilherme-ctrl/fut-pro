import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { PersonalNav } from '../components/PersonalNav';
import { api, getToken } from '../services/api';

export function ProtocolNew() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [objective, setObjective] = useState('');
  const [cycleCount, setCycleCount] = useState(3);
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
      const p = await api.post<{ id: string }>('/api/protocols', {
        name,
        description: description || undefined,
        objective: objective || undefined,
        cycleCount,
        isActive: true,
      });
      navigate(`/protocols/${p.id}/edit`);
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
        title="Novo protocolo"
        subtitle="Metadados primeiro; em seguida você adiciona sessões e exercícios."
        breadcrumbs={
          <Link to="/protocols" className="link-subtle">
            ← Protocolos
          </Link>
        }
      />
      <div className="card" style={{ maxWidth: 520 }}>
        <form onSubmit={onSubmit}>
          <div className="form-section">
            <h3 className="form-section__title">Identificação</h3>
            <div className="field">
              <label htmlFor="p-name">Nome</label>
              <input
                id="p-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="p-desc">Descrição</label>
              <textarea
                id="p-desc"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="p-obj">Objetivo</label>
              <input
                id="p-obj"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="p-cycles">Ciclos</label>
              <input
                id="p-cycles"
                type="number"
                min={1}
                value={cycleCount}
                onChange={(e) => setCycleCount(Number(e.target.value))}
              />
            </div>
          </div>
          {error ? <p className="form-error">{error}</p> : null}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '…' : 'Criar e editar treinos'}
          </button>
        </form>
      </div>
    </div>
  );
}
