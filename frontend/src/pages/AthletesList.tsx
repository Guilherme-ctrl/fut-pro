import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ErrorRetry, ListSkeleton } from '../components/PageLoading';
import { PageHeader } from '../components/PageHeader';
import { PersonalNav } from '../components/PersonalNav';
import { api, getToken } from '../services/api';

type Row = {
  id: string;
  name: string;
  protocolName: string | null;
  nextTraining: string | null;
  adherencePercent: number | null;
  status: string | null;
};

export function AthletesList() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
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
      .get<Row[]>('/api/dashboard/athletes-status')
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
        title="Atletas"
        subtitle="Lista com protocolo, próximo treino e aderência."
        actions={
          <Link className="btn btn-primary" to="/athletes/new">
            Novo atleta
          </Link>
        }
      />
      {loading && <ListSkeleton rows={5} />}
      {error && <ErrorRetry message={error} onRetry={() => void load()} />}
      {!loading &&
        !error &&
        rows.map((r) => (
          <Link
            key={r.id}
            to={`/athletes/${r.id}`}
            className="card card--interactive"
            style={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'block',
            }}
          >
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
                <strong style={{ fontSize: '1.05rem' }}>{r.name}</strong>
                <p className="muted" style={{ margin: '0.35rem 0' }}>
                  {r.protocolName ?? 'Sem protocolo ativo'}
                </p>
                <p className="muted" style={{ margin: 0, fontSize: '0.85rem' }}>
                  Próximo: {r.nextTraining ?? '—'}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                {r.adherencePercent != null && (
                  <span className="badge badge--ok">
                    {r.adherencePercent}% aderência
                  </span>
                )}
                {r.status && (
                  <p className="muted" style={{ margin: '0.5rem 0 0', fontSize: '0.8rem' }}>
                    {r.status}
                  </p>
                )}
                <span className="muted" style={{ fontSize: '0.8rem', display: 'block', marginTop: '0.35rem' }}>
                  Ver perfil →
                </span>
              </div>
            </div>
          </Link>
        ))}
      {!loading && !error && rows.length === 0 && (
        <div className="empty-state">
          <p className="empty-state__title">Nenhum atleta cadastrado</p>
          <p>Adicione atletas para acompanhar aderência e prescrições.</p>
          <Link
            to="/athletes/new"
            className="btn btn-primary"
            style={{ marginTop: '1rem', display: 'inline-flex' }}
          >
            Cadastrar atleta
          </Link>
        </div>
      )}
    </div>
  );
}
