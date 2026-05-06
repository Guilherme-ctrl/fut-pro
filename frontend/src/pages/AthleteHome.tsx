import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AthleteNav } from '../components/AthleteNav';
import { api, getToken } from '../services/api';

type Current = {
  prescription: {
    id: string;
    currentCycle: number;
    currentTrainingOrder: number;
    protocol: { name: string; cycleCount: number; trainingCount: number };
  };
  trainingSession: {
    id: string;
    name: string;
    generalInstructions: string | null;
    estimatedDurationMinutes: number | null;
  } | null;
};

type HistoryRow = {
  finishedAt: string | null;
  trainingSession: { name: string };
};

export function AthleteHome() {
  const navigate = useNavigate();
  const [data, setData] = useState<Current | null | undefined>(undefined);
  const [lastDone, setLastDone] = useState<HistoryRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  const load = useCallback(() => {
    setError(null);
    return Promise.all([
      api.get<Current | null>('/api/athlete/current-training'),
      api.get<HistoryRow[]>('/api/athlete/history'),
    ])
      .then(([c, h]) => {
        setData(c);
        setLastDone(h[0] ?? null);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Erro'));
  }, []);

  useEffect(() => {
    if (!getToken()) {
      navigate('/athlete/login');
      return;
    }
    void load();
  }, [navigate, load]);

  async function start() {
    setStarting(true);
    setError(null);
    try {
      const execution = await api.post<{
        id: string;
        steps: { id: string }[];
        trainingSession: unknown;
      }>('/api/athlete/training-executions/start', {});
      sessionStorage.setItem(
        `pf_exec_${execution.id}`,
        JSON.stringify(execution),
      );
      navigate(`/athlete/training/execution/${execution.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao iniciar');
    } finally {
      setStarting(false);
    }
  }

  if (data === undefined && !error) {
    return (
      <div className="app-shell app-shell--athlete">
        <AthleteNav />
        <div className="skeleton" style={{ height: 140, marginBottom: '0.75rem' }} />
        <div className="skeleton" style={{ height: 48 }} />
        <p className="muted" style={{ marginTop: '1rem' }}>
          Carregando seu treino…
        </p>
      </div>
    );
  }

  const pct =
    data?.trainingSession && data.prescription.protocol.trainingCount > 0
      ? Math.round(
          ((data.prescription.currentTrainingOrder - 1) /
            data.prescription.protocol.trainingCount) *
            100,
        )
      : 0;

  return (
    <div className="app-shell app-shell--athlete">
      <AthleteNav />
      {error ? <p className="form-error">{error}</p> : null}

      {!data?.trainingSession && (
        <div className="empty-state">
          <p className="empty-state__title">Sem treino prescrito agora</p>
          <p>
            Quando seu treinador atribuir um protocolo ativo, o próximo treino
            aparecerá aqui.
          </p>
          <button
            type="button"
            className="btn btn-ghost btn-block"
            style={{ marginTop: '1rem' }}
            onClick={() => void load()}
          >
            Atualizar
          </button>
        </div>
      )}

      {data?.trainingSession && (
        <>
          <div className="card card--hero">
            <p className="muted" style={{ marginTop: 0 }}>
              {data.prescription.protocol.name}
            </p>
            <h2 style={{ margin: '0.25rem 0', fontSize: '1.35rem' }}>
              {data.trainingSession.name}
            </h2>
            <p className="muted">
              Ciclo {data.prescription.currentCycle} de{' '}
              {data.prescription.protocol.cycleCount} · Treino{' '}
              {data.prescription.currentTrainingOrder} de{' '}
              {data.prescription.protocol.trainingCount}
            </p>
            <div className="training-progress" aria-hidden>
              <div
                className="training-progress__fill"
                style={{ width: `${pct}%` }}
              />
            </div>
            {data.trainingSession.estimatedDurationMinutes != null && (
              <p className="muted">
                Duração estimada ~{data.trainingSession.estimatedDurationMinutes}{' '}
                min
              </p>
            )}
            {data.trainingSession.generalInstructions && (
              <p style={{ marginTop: '0.5rem' }}>
                {data.trainingSession.generalInstructions}
              </p>
            )}
            <button
              type="button"
              className="btn btn-primary btn-block btn-lg"
              onClick={() => void start()}
              disabled={starting}
            >
              {starting ? 'Preparando…' : 'Iniciar treino guiado'}
            </button>
          </div>

          {lastDone?.finishedAt && (
            <p className="muted" style={{ textAlign: 'center', marginTop: '1rem' }}>
              Último treino:{' '}
              <strong>{lastDone.trainingSession.name}</strong> ·{' '}
              {new Date(lastDone.finishedAt).toLocaleString()}
            </p>
          )}
        </>
      )}
    </div>
  );
}
