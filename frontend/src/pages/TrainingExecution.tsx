import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AthleteNav } from '../components/AthleteNav';
import { EXECUTION_TYPE_LABEL } from '../constants/enums';
import { useCountdown } from '../hooks/useCountdown';
import { api, getToken, setToken } from '../services/api';
import { formatSeconds } from '../utils/formatTime';

type ExerciseRow = {
  id: string;
  order: number;
  sets: number | null;
  repetitions: number | null;
  durationSeconds: number | null;
  distanceMeters: number | null;
  restSeconds: number | null;
  rounds: number | null;
  notes: string | null;
  executionType: string;
  exercise: {
    name: string;
    videoUrl: string | null;
    description: string | null;
  };
};

type ExecutionPayload = {
  id: string;
  steps: Array<{ id: string; trainingExerciseId: string; status: string }>;
  trainingSession: {
    name: string;
    generalInstructions: string | null;
    trainingExercises: ExerciseRow[];
  };
};

const DIFFICULTY_LABEL: Record<string, string> = {
  EASY: 'Leve',
  MODERATE: 'Moderado',
  HARD: 'Difícil',
  VERY_HARD: 'Muito difícil',
};

function workDurationSeconds(ex: ExerciseRow): number {
  const t = ex.executionType;
  const d = ex.durationSeconds ?? 0;
  if ((t === 'TIME_BASED' || t === 'INTERVAL') && d > 0) return d;
  return 0;
}

export function TrainingExecution() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [execution, setExecution] = useState<ExecutionPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [difficulty, setDifficulty] = useState('MODERATE');
  const [feltPain, setFeltPain] = useState(false);
  const [painLocation, setPainLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [restLeft, setRestLeft] = useState<number | null>(null);
  const [stepBusy, setStepBusy] = useState(false);
  /** Após última etapa, se houver descanso, abre feedback só quando o descanso terminar. */
  const [finishAfterRest, setFinishAfterRest] = useState(false);

  useEffect(() => {
    if (!getToken() || !id) {
      navigate('/athlete/login');
      return;
    }
    const raw = sessionStorage.getItem(`pf_exec_${id}`);
    if (!raw) {
      setError('Sessão expirada. Inicie o treino novamente.');
      return;
    }
    try {
      setExecution(JSON.parse(raw) as ExecutionPayload);
    } catch {
      setError('Dados inválidos.');
    }
  }, [id, navigate]);

  const orderedSteps = useMemo(() => {
    if (!execution) return [];
    const ex = [...execution.trainingSession.trainingExercises].sort(
      (a, b) => a.order - b.order,
    );
    const steps = [...execution.steps].sort(
      (a, b) =>
        ex.findIndex((e) => e.id === a.trainingExerciseId) -
        ex.findIndex((e) => e.id === b.trainingExerciseId),
    );
    return steps.map((s) => ({
      step: s,
      exercise: ex.find((e) => e.id === s.trainingExerciseId)!,
    }));
  }, [execution]);

  const nextIncomplete = orderedSteps.find((x) => x.step.status !== 'COMPLETED');
  const totalSteps = orderedSteps.length;
  const doneCount = orderedSteps.filter((x) => x.step.status === 'COMPLETED').length;
  const progressPct = totalSteps ? Math.round((doneCount / totalSteps) * 100) : 0;

  const workDur = nextIncomplete ? workDurationSeconds(nextIncomplete.exercise) : 0;
  const { remaining, running, start, pause, reset } = useCountdown(workDur);

  useEffect(() => {
    reset(workDur);
  }, [nextIncomplete?.step.id, workDur, reset]);

  useEffect(() => {
    if (restLeft === null || restLeft <= 0) return;
    const iv = setInterval(() => {
      setRestLeft((x) => {
        if (x === null || x <= 1) return null;
        return x - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [restLeft]);

  useEffect(() => {
    if (finishAfterRest && restLeft === null) {
      setShowFeedback(true);
      setFinishAfterRest(false);
    }
  }, [finishAfterRest, restLeft]);

  async function completeStep(stepId: string) {
    if (!execution) return;
    const pair = orderedSteps.find((x) => x.step.id === stepId);
    const restSec = pair?.exercise.restSeconds;
    setError(null);
    setStepBusy(true);
    try {
      await api.patch(
        `/api/athlete/training-executions/${execution.id}/steps/${stepId}/complete`,
        {},
      );
      const updated = {
        ...execution,
        steps: execution.steps.map((s) =>
          s.id === stepId ? { ...s, status: 'COMPLETED' } : s,
        ),
      };
      setExecution(updated);
      sessionStorage.setItem(
        `pf_exec_${execution.id}`,
        JSON.stringify(updated),
      );
      const allDone = !updated.steps.some((s) => s.status !== 'COMPLETED');
      if (allDone) {
        if (restSec != null && restSec > 0) {
          setRestLeft(restSec);
          setFinishAfterRest(true);
        } else {
          setShowFeedback(true);
        }
      } else if (restSec != null && restSec > 0) {
        setRestLeft(restSec);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro');
    } finally {
      setStepBusy(false);
    }
  }

  async function onFeedback(e: FormEvent) {
    e.preventDefault();
    if (!execution) return;
    setCompleting(true);
    setError(null);
    try {
      await api.post(`/api/athlete/training-executions/${execution.id}/complete`, {
        perceivedDifficulty: difficulty,
        feltPain,
        painLocation: painLocation || undefined,
        athleteNotes: notes || undefined,
      });
      sessionStorage.removeItem(`pf_exec_${execution.id}`);
      navigate('/athlete/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao concluir');
    } finally {
      setCompleting(false);
    }
  }

  const showRestOverlay = restLeft !== null && restLeft > 0 && !showFeedback;

  if (!execution && !error) {
    return (
      <div className="app-shell app-shell--athlete">
        <div className="skeleton" style={{ height: 120 }} />
        <p className="muted" style={{ marginTop: '1rem' }}>
          Carregando treino…
        </p>
      </div>
    );
  }

  if (error && !execution) {
    return (
      <div className="app-shell app-shell--athlete">
        <AthleteNav />
        <div className="empty-state">
          <p className="empty-state__title">Não foi possível abrir o treino</p>
          <p>{error}</p>
          <Link to="/athlete/home" className="btn btn-primary btn-block" style={{ marginTop: '1rem' }}>
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  if (!execution) return null;

  const cur = nextIncomplete;

  return (
    <div className="app-shell app-shell--athlete">
      <AthleteNav />

      {showRestOverlay && (
        <div className="rest-overlay" role="dialog" aria-modal="true" aria-label="Descanso">
          <div className="rest-overlay__card">
            <p className="timer-panel__label">Descanso</p>
            <div className="timer-panel__value timer-panel__value--rest">
              {formatSeconds(restLeft ?? 0)}
            </div>
            <p className="muted" style={{ marginBottom: '1.25rem' }}>
              Respire fundo. Na próxima etapa você continua firme.
            </p>
            <button
              type="button"
              className="btn btn-ghost btn-block btn-lg"
              onClick={() => setRestLeft(null)}
            >
              Pular descanso
            </button>
          </div>
        </div>
      )}

      <header style={{ marginBottom: '0.5rem' }}>
        <Link to="/athlete/home" className="muted" style={{ fontSize: '0.9rem' }}>
          ← Sair do guia
        </Link>
      </header>

      <h1 style={{ fontSize: '1.15rem', margin: '0 0 0.25rem', lineHeight: 1.3 }}>
        {execution.trainingSession.name}
      </h1>
      {execution.trainingSession.generalInstructions && (
        <p className="muted" style={{ marginTop: 0 }}>
          {execution.trainingSession.generalInstructions}
        </p>
      )}

      <div className="stepper" aria-live="polite">
        <div>
          <p className="stepper__label">Progresso</p>
          <p className="stepper__value">
            Etapa {Math.min(doneCount + 1, totalSteps)} de {totalSteps}
          </p>
        </div>
        <div className="stepper__pct">{progressPct}%</div>
      </div>

      <div className="training-progress" aria-hidden>
        <div className="training-progress__fill" style={{ width: `${progressPct}%` }} />
      </div>

      {error ? <p className="form-error">{error}</p> : null}

      {!showFeedback && cur && (
        <>
          <div className="card" style={{ marginBottom: '0.75rem' }}>
            <p className="timer-panel__label" style={{ marginBottom: '0.35rem' }}>
              Agora
            </p>
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.35rem' }}>
              {cur.exercise.exercise.name}
            </h2>
            <span className="badge badge--pending">
              {EXECUTION_TYPE_LABEL[cur.exercise.executionType] ??
                cur.exercise.executionType}
            </span>
            {cur.exercise.exercise.description && (
              <p className="muted" style={{ marginBottom: 0 }}>
                {cur.exercise.exercise.description}
              </p>
            )}
            {cur.exercise.exercise.videoUrl && (
              <p style={{ marginTop: '0.75rem' }}>
                <a
                  href={cur.exercise.exercise.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-ghost btn-block"
                >
                  Abrir vídeo do exercício
                </a>
              </p>
            )}
            <ul className="muted" style={{ paddingLeft: '1.1rem', margin: '0.75rem 0 0' }}>
              {cur.exercise.sets != null && <li>Séries: {cur.exercise.sets}</li>}
              {cur.exercise.repetitions != null && (
                <li>Repetições: {cur.exercise.repetitions}</li>
              )}
              {cur.exercise.durationSeconds != null && (
                <li>Tempo alvo: {cur.exercise.durationSeconds}s</li>
              )}
              {cur.exercise.distanceMeters != null && (
                <li>Distância: {cur.exercise.distanceMeters} m</li>
              )}
              {cur.exercise.rounds != null && (
                <li>Rodadas: {cur.exercise.rounds}</li>
              )}
              {cur.exercise.restSeconds != null && cur.exercise.restSeconds > 0 && (
                <li>Descanso após a etapa: {cur.exercise.restSeconds}s</li>
              )}
              {cur.exercise.notes && <li>Obs.: {cur.exercise.notes}</li>}
            </ul>
          </div>

          {workDur > 0 && (
            <div className="timer-panel">
              <p className="timer-panel__label">Timer (trabalho)</p>
              <div className="timer-panel__value">{formatSeconds(remaining)}</div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {!running && remaining > 0 && (
                  <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={() => start()}
                  >
                    Iniciar
                  </button>
                )}
                {running && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-lg"
                    onClick={() => pause()}
                  >
                    Pausar
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-ghost btn-lg"
                  onClick={() => reset(workDur)}
                >
                  Reiniciar
                </button>
              </div>
              <p className="muted" style={{ marginBottom: 0, marginTop: '0.75rem' }}>
                Opcional: use o timer para guiar o tempo. Você pode concluir a etapa a
                qualquer momento.
              </p>
            </div>
          )}

          <button
            type="button"
            className="btn btn-primary btn-block btn-lg"
            disabled={stepBusy}
            onClick={() => void completeStep(cur.step.id)}
          >
            {stepBusy ? 'Salvando…' : 'Concluir esta etapa'}
          </button>

          <details style={{ marginTop: '1.25rem' }}>
            <summary className="muted" style={{ cursor: 'pointer' }}>
              Ver todas as etapas
            </summary>
            <ol style={{ paddingLeft: '1.1rem', marginTop: '0.75rem' }}>
              {orderedSteps.map(({ step, exercise }) => (
                <li key={step.id} style={{ marginBottom: '0.5rem' }}>
                  {exercise.exercise.name}{' '}
                  {step.status === 'COMPLETED' ? (
                    <span className="badge badge--ok">ok</span>
                  ) : (
                    <span className="badge badge--pending">pendente</span>
                  )}
                </li>
              ))}
            </ol>
          </details>
        </>
      )}

      {!showFeedback && !cur && !showRestOverlay && (
        <p className="muted">Preparando feedback…</p>
      )}

      {showFeedback && (
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Como foi o treino?</h3>
          <form onSubmit={onFeedback}>
            <div className="field">
              <label htmlFor="diff">Esforço percebido</label>
              <select
                id="diff"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                {Object.entries(DIFFICULTY_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>
                <input
                  type="checkbox"
                  checked={feltPain}
                  onChange={(e) => setFeltPain(e.target.checked)}
                />{' '}
                Sentiu dor ou desconforto?
              </label>
            </div>
            {feltPain && (
              <div className="field">
                <label htmlFor="pain">Onde?</label>
                <input
                  id="pain"
                  value={painLocation}
                  onChange={(e) => setPainLocation(e.target.value)}
                  placeholder="Opcional"
                />
              </div>
            )}
            <div className="field">
              <label htmlFor="notes">Observações</label>
              <textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Como se sentiu, técnica, clima…"
              />
            </div>
            {error ? <p className="form-error">{error}</p> : null}
            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              disabled={completing}
            >
              {completing ? 'Enviando…' : 'Concluir treino'}
            </button>
          </form>
        </div>
      )}

      <p className="muted" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <button
          type="button"
          className="btn btn-ghost"
          style={{ fontSize: '0.85rem' }}
          onClick={() => {
            if (confirm('Sair do treino? O progresso desta sessão permanece no servidor apenas após cada etapa concluída.')) {
              setToken(null);
              navigate('/athlete/login');
            }
          }}
        >
          Encerrar sessão e sair
        </button>
      </p>
    </div>
  );
}
