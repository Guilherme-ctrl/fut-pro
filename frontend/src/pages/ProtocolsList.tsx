import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ErrorRetry, ListSkeleton } from '../components/PageLoading';
import { PageHeader } from '../components/PageHeader';
import { PersonalNav } from '../components/PersonalNav';
import { api, getToken } from '../services/api';

type Protocol = {
  id: string;
  name: string;
  trainingCount: number;
  cycleCount: number;
  isActive: boolean;
};

export function ProtocolsList() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Protocol[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    if (!getToken()) {
      navigate('/login');
      return Promise.resolve();
    }
    setError(null);
    setLoading(true);
    return api
      .get<Protocol[]>('/api/protocols')
      .then(setRows)
      .catch((e) => setError(e instanceof Error ? e.message : 'Erro ao carregar'))
      .finally(() => setLoading(false));
  }, [navigate]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="app-shell">
      <PersonalNav />
      <PageHeader
        title="Protocolos"
        subtitle="Modelos de treino com sessões e exercícios."
        actions={
          <Link className="btn btn-primary" to="/protocols/new">
            Novo protocolo
          </Link>
        }
      />
      {loading && <ListSkeleton rows={4} />}
      {error && <ErrorRetry message={error} onRetry={() => void load()} />}
      {!loading &&
        !error &&
        rows.map((p) => (
          <div key={p.id} className="card card--interactive">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '1rem',
                flexWrap: 'wrap',
                alignItems: 'flex-start',
              }}
            >
              <div>
                <strong style={{ fontSize: '1.05rem' }}>{p.name}</strong>
                <p className="muted" style={{ margin: '0.35rem 0' }}>
                  {p.trainingCount} treinos · {p.cycleCount} ciclos
                </p>
                <span className={p.isActive ? 'badge badge--ok' : 'badge'}>
                  {p.isActive ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <Link className="btn btn-secondary" to={`/protocols/${p.id}/edit`}>
                Editar
              </Link>
            </div>
          </div>
        ))}
      {!loading && !error && rows.length === 0 && (
        <div className="empty-state">
          <p className="empty-state__title">Nenhum protocolo</p>
          <p>Crie um protocolo ou rode o seed do backend para carregar o exemplo.</p>
          <Link
            to="/protocols/new"
            className="btn btn-primary"
            style={{ marginTop: '1rem', display: 'inline-flex' }}
          >
            Criar protocolo
          </Link>
        </div>
      )}
    </div>
  );
}
