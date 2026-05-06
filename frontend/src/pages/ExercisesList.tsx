import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ErrorRetry, ListSkeleton } from '../components/PageLoading';
import { PageHeader } from '../components/PageHeader';
import { PersonalNav } from '../components/PersonalNav';
import { api, getToken } from '../services/api';

type Exercise = {
  id: string;
  name: string;
  category: string | null;
  videoUrl: string | null;
};

export function ExercisesList() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Exercise[]>([]);
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
      .get<Exercise[]>('/api/exercises')
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
        title="Exercícios"
        subtitle="Biblioteca usada ao montar sessões nos protocolos."
        actions={
          <Link className="btn btn-primary" to="/exercises/new">
            Novo exercício
          </Link>
        }
      />
      {loading && <ListSkeleton rows={5} />}
      {error && <ErrorRetry message={error} onRetry={() => void load()} />}
      {!loading &&
        !error &&
        rows.map((x) => (
          <div key={x.id} className="card card--interactive">
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
                <strong style={{ fontSize: '1.05rem' }}>{x.name}</strong>
                <p className="muted" style={{ margin: '0.35rem 0' }}>
                  {x.category ?? 'Sem categoria'}
                  {x.videoUrl ? (
                    <>
                      {' '}
                      ·{' '}
                      <a href={x.videoUrl} target="_blank" rel="noreferrer">
                        Abrir vídeo
                      </a>
                    </>
                  ) : null}
                </p>
              </div>
              <Link className="btn btn-secondary" to={`/exercises/${x.id}/edit`}>
                Editar
              </Link>
            </div>
          </div>
        ))}
      {!loading && !error && rows.length === 0 && (
        <div className="empty-state">
          <p className="empty-state__title">Nenhum exercício</p>
          <p>Cadastre exercícios para montar treinos nos protocolos.</p>
          <Link
            to="/exercises/new"
            className="btn btn-primary"
            style={{ marginTop: '1rem', display: 'inline-flex' }}
          >
            Novo exercício
          </Link>
        </div>
      )}
    </div>
  );
}
