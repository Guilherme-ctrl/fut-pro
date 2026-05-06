import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AthleteNav } from '../components/AthleteNav';
import { api, getToken } from '../services/api';

type Row = {
  id: string;
  finishedAt: string | null;
  trainingSession: { name: string };
  perceivedDifficulty: string | null;
  feltPain: boolean | null;
};

const DIFF: Record<string, string> = {
  EASY: 'Leve',
  MODERATE: 'Moderado',
  HARD: 'Difícil',
  VERY_HARD: 'Muito difícil',
};

export function AthleteHistory() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) {
      navigate('/athlete/login');
      return;
    }
    api
      .get<Row[]>('/api/athlete/history')
      .then(setRows)
      .catch((e) => setError(e instanceof Error ? e.message : 'Erro'))
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <div className="app-shell app-shell--athlete">
      <AthleteNav />
      <h1 className="page-header__title" style={{ marginTop: 0 }}>
        Histórico
      </h1>
      <p className="muted" style={{ marginTop: '-0.25rem' }}>
        Treinos concluídos e feedback enviado.
      </p>
      {loading && (
        <>
          <div className="skeleton" style={{ height: 72, marginBottom: '0.65rem' }} />
          <div className="skeleton" style={{ height: 72, marginBottom: '0.65rem' }} />
        </>
      )}
      {error ? <p className="form-error">{error}</p> : null}
      {!loading && !error && rows.length === 0 && (
        <div className="empty-state">
          <p className="empty-state__title">Nenhum treino concluído ainda</p>
          <p>Finalize um treino guiado na home para ver o histórico aqui.</p>
          <Link
            to="/athlete/home"
            className="btn btn-primary btn-block"
            style={{ marginTop: '1rem' }}
          >
            Ir para o treino
          </Link>
        </div>
      )}
      {!loading &&
        !error &&
        rows.map((r) => (
          <div key={r.id} className="card">
            <strong>{r.trainingSession.name}</strong>
            <p className="muted" style={{ margin: '0.35rem 0' }}>
              {r.finishedAt
                ? new Date(r.finishedAt).toLocaleString()
                : '—'}
            </p>
            <p className="muted" style={{ margin: 0 }}>
              Esforço:{' '}
              {(r.perceivedDifficulty && DIFF[r.perceivedDifficulty]) ||
                r.perceivedDifficulty ||
                '—'}{' '}
              · Dor:{' '}
              {r.feltPain == null ? '—' : r.feltPain ? 'sim' : 'não'}
            </p>
          </div>
        ))}
    </div>
  );
}
