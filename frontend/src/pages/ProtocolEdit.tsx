import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ErrorRetry } from '../components/PageLoading';
import { PageHeader } from '../components/PageHeader';
import { PersonalNav } from '../components/PersonalNav';
import {
  EXECUTION_TYPE_LABEL,
  EXECUTION_TYPES,
  TRAINING_TYPE_LABEL,
  TRAINING_TYPES,
} from '../constants/enums';
import { api, getToken } from '../services/api';

type ExerciseLib = { id: string; name: string };

type TrainingExercise = {
  id: string;
  order: number;
  sets: number | null;
  repetitions: number | null;
  durationSeconds: number | null;
  distanceMeters: number | null;
  restSeconds: number | null;
  rounds: number | null;
  executionType: string;
  notes: string | null;
  exercise: { id: string; name: string };
};

type TrainingSession = {
  id: string;
  order: number;
  name: string;
  type: string;
  estimatedDurationMinutes: number | null;
  generalInstructions: string | null;
  trainingExercises: TrainingExercise[];
};

type Protocol = {
  id: string;
  name: string;
  description: string | null;
  objective: string | null;
  cycleCount: number;
  isActive: boolean;
  trainingSessions: TrainingSession[];
};

export function ProtocolEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [exercisesLib, setExercisesLib] = useState<ExerciseLib[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [sessOrder, setSessOrder] = useState(1);
  const [sessName, setSessName] = useState('');
  const [sessType, setSessType] = useState<string>('OUTRO');
  const [sessDur, setSessDur] = useState<number | ''>('');
  const [sessInstr, setSessInstr] = useState('');

  const load = useCallback(async () => {
    if (!id) return;
    const [p, ex] = await Promise.all([
      api.get<Protocol>(`/api/protocols/${id}`),
      api.get<ExerciseLib[]>('/api/exercises'),
    ]);
    setProtocol(p);
    setExercisesLib(ex);
    const nextOrder =
      (p.trainingSessions?.reduce((m, s) => Math.max(m, s.order), 0) ?? 0) + 1;
    setSessOrder(nextOrder);
  }, [id]);

  useEffect(() => {
    if (!getToken()) {
      navigate('/login');
      return;
    }
    if (!id) return;
    load().catch((e) => setError(e instanceof Error ? e.message : 'Erro'));
  }, [id, navigate, load]);

  async function addSession(e: FormEvent) {
    e.preventDefault();
    if (!id) return;
    setError(null);
    try {
      await api.post(`/api/protocols/${id}/training-sessions`, {
        order: sessOrder,
        name: sessName,
        type: sessType,
        estimatedDurationMinutes:
          sessDur === '' ? undefined : Number(sessDur),
        generalInstructions: sessInstr || undefined,
      });
      setSessName('');
      setSessInstr('');
      setSessDur('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro');
    }
  }

  async function removeSession(sessionId: string) {
    if (!id || !confirm('Remover este treino do protocolo?')) return;
    setError(null);
    try {
      await api.delete(`/api/protocols/${id}/training-sessions/${sessionId}`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro');
    }
  }

  async function addExerciseToSession(
    sessionId: string,
    payload: Record<string, unknown>,
  ) {
    setError(null);
    try {
      await api.post(`/api/training-sessions/${sessionId}/exercises`, payload);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro');
    }
  }

  async function removeExercise(sessionId: string, teId: string) {
    if (!confirm('Remover exercício desta sessão?')) return;
    setError(null);
    try {
      await api.delete(
        `/api/training-sessions/${sessionId}/exercises/${teId}`,
      );
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro');
    }
  }

  if (!protocol && !error) {
    return (
      <div className="app-shell">
        <PersonalNav />
        <p className="muted">Carregando…</p>
      </div>
    );
  }

  if (error && !protocol) {
    return (
      <div className="app-shell">
        <PersonalNav />
        <ErrorRetry
          message={error}
          onRetry={() => {
            setError(null);
            void load().catch((e) =>
              setError(e instanceof Error ? e.message : 'Erro'),
            );
          }}
        />
        <Link to="/protocols" className="link-subtle">
          ← Protocolos
        </Link>
      </div>
    );
  }

  if (!protocol) return null;

  const sessions = [...protocol.trainingSessions].sort(
    (a, b) => a.order - b.order,
  );

  return (
    <div className="app-shell">
      <PersonalNav />
      <PageHeader
        title={protocol.name}
        subtitle={`${protocol.description || 'Sem descrição'} · ${protocol.cycleCount} ciclos`}
        breadcrumbs={
          <Link to="/protocols" className="link-subtle">
            ← Protocolos
          </Link>
        }
        actions={
          <span className={protocol.isActive ? 'badge badge--ok' : 'badge'}>
            {protocol.isActive ? 'Ativo' : 'Inativo'}
          </span>
        }
      />
      {error ? <p className="form-error">{error}</p> : null}

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Adicionar treino (sessão)</h3>
        <form onSubmit={addSession}>
          <div className="field">
            <label>Ordem</label>
            <input
              type="number"
              min={1}
              value={sessOrder}
              onChange={(e) => setSessOrder(Number(e.target.value))}
            />
          </div>
          <div className="field">
            <label>Nome</label>
            <input
              value={sessName}
              onChange={(e) => setSessName(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Tipo</label>
            <select
              value={sessType}
              onChange={(e) => setSessType(e.target.value)}
            >
              {TRAINING_TYPES.map((t) => (
                <option key={t} value={t}>
                  {TRAINING_TYPE_LABEL[t] ?? t}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Duração estimada (min)</label>
            <input
              type="number"
              min={1}
              value={sessDur}
              onChange={(e) =>
                setSessDur(e.target.value === '' ? '' : Number(e.target.value))
              }
            />
          </div>
          <div className="field">
            <label>Instruções gerais</label>
            <textarea
              rows={2}
              value={sessInstr}
              onChange={(e) => setSessInstr(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Adicionar sessão
          </button>
        </form>
      </div>

      {sessions.map((s) => (
        <SessionCard
          key={s.id}
          session={s}
          exercisesLib={exercisesLib}
          onRemoveSession={() => void removeSession(s.id)}
          onAddExercise={(payload) =>
            void addExerciseToSession(s.id, payload)
          }
          onRemoveExercise={(teId) => void removeExercise(s.id, teId)}
        />
      ))}
    </div>
  );
}

function SessionCard({
  session,
  exercisesLib,
  onRemoveSession,
  onAddExercise,
  onRemoveExercise,
}: {
  session: TrainingSession;
  exercisesLib: ExerciseLib[];
  onRemoveSession: () => void;
  onAddExercise: (p: Record<string, unknown>) => void;
  onRemoveExercise: (teId: string) => void;
}) {
  const [exId, setExId] = useState(exercisesLib[0]?.id ?? '');
  const [order, setOrder] = useState(
    () =>
      (session.trainingExercises?.reduce((m, x) => Math.max(m, x.order), 0) ??
        0) + 1,
  );
  const [sets, setSets] = useState<number | ''>(3);
  const [reps, setReps] = useState<number | ''>('');
  const [dur, setDur] = useState<number | ''>('');
  const [dist, setDist] = useState<number | ''>('');
  const [rest, setRest] = useState<number | ''>(60);
  const [rounds, setRounds] = useState<number | ''>('');
  const [execType, setExecType] = useState('SERIES_REPS');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (exercisesLib.length && !exId) {
      setExId(exercisesLib[0].id);
    }
  }, [exercisesLib, exId]);

  useEffect(() => {
    const max =
      session.trainingExercises?.reduce((m, x) => Math.max(m, x.order), 0) ??
      0;
    setOrder(max + 1);
  }, [session.trainingExercises]);

  function submitExercise(e: FormEvent) {
    e.preventDefault();
    if (!exId) return;
    onAddExercise({
      exerciseId: exId,
      order,
      sets: sets === '' ? undefined : sets,
      repetitions: reps === '' ? undefined : reps,
      durationSeconds: dur === '' ? undefined : dur,
      distanceMeters: dist === '' ? undefined : dist,
      restSeconds: rest === '' ? undefined : rest,
      rounds: rounds === '' ? undefined : rounds,
      executionType: execType,
      notes: notes || undefined,
    });
    setNotes('');
  }

  const list = [...(session.trainingExercises ?? [])].sort(
    (a, b) => a.order - b.order,
  );

  return (
    <div className="card">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h3 style={{ marginTop: 0 }}>
            {session.order}. {session.name}
          </h3>
          <p className="muted" style={{ marginTop: 0 }}>
            {TRAINING_TYPE_LABEL[session.type] ?? session.type}
            {session.estimatedDurationMinutes != null
              ? ` · ~${session.estimatedDurationMinutes} min`
              : ''}
          </p>
          {session.generalInstructions && (
            <p className="muted">{session.generalInstructions}</p>
          )}
        </div>
        <button type="button" className="btn btn-danger" onClick={onRemoveSession}>
          Remover sessão
        </button>
      </div>
      <ul style={{ paddingLeft: '1.2rem' }}>
        {list.map((te) => (
          <li key={te.id} style={{ marginBottom: '0.5rem' }}>
            <strong>{te.exercise.name}</strong>{' '}
            <span className="badge">{EXECUTION_TYPE_LABEL[te.executionType]}</span>
            <button
              type="button"
              className="btn btn-danger"
              style={{ marginLeft: '0.5rem', padding: '0.25rem 0.55rem' }}
              aria-label={`Remover ${te.exercise.name}`}
              onClick={() => onRemoveExercise(te.id)}
            >
              ✕
            </button>
            <p className="muted" style={{ margin: '0.15rem 0 0' }}>
              séries {te.sets ?? '—'} · reps {te.repetitions ?? '—'} · tempo{' '}
              {te.durationSeconds ?? '—'}s · desc {te.restSeconds ?? '—'}s
            </p>
          </li>
        ))}
      </ul>
      <details style={{ marginTop: '0.75rem' }}>
        <summary>Adicionar exercício à sessão</summary>
        {exercisesLib.length === 0 ? (
          <p className="muted" style={{ marginTop: '0.75rem' }}>
            Cadastre exercícios em <Link to="/exercises/new">Exercícios</Link>{' '}
            antes de montar a sessão.
          </p>
        ) : (
        <form onSubmit={submitExercise} style={{ marginTop: '0.75rem' }}>
          <div className="field">
            <label>Exercício</label>
            <select value={exId} onChange={(e) => setExId(e.target.value)}>
              {exercisesLib.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Ordem na sessão</label>
            <input
              type="number"
              min={1}
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
            />
          </div>
          <div className="field">
            <label>Tipo de execução</label>
            <select
              value={execType}
              onChange={(e) => setExecType(e.target.value)}
            >
              {EXECUTION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {EXECUTION_TYPE_LABEL[t]}
                </option>
              ))}
            </select>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '0.5rem',
            }}
          >
            <div className="field">
              <label>Séries</label>
              <input
                type="number"
                min={0}
                value={sets}
                onChange={(e) =>
                  setSets(e.target.value === '' ? '' : Number(e.target.value))
                }
              />
            </div>
            <div className="field">
              <label>Reps</label>
              <input
                type="number"
                min={0}
                value={reps}
                onChange={(e) =>
                  setReps(e.target.value === '' ? '' : Number(e.target.value))
                }
              />
            </div>
            <div className="field">
              <label>Tempo (s)</label>
              <input
                type="number"
                min={0}
                value={dur}
                onChange={(e) =>
                  setDur(e.target.value === '' ? '' : Number(e.target.value))
                }
              />
            </div>
            <div className="field">
              <label>Dist (m)</label>
              <input
                type="number"
                min={0}
                value={dist}
                onChange={(e) =>
                  setDist(e.target.value === '' ? '' : Number(e.target.value))
                }
              />
            </div>
            <div className="field">
              <label>Desc (s)</label>
              <input
                type="number"
                min={0}
                value={rest}
                onChange={(e) =>
                  setRest(e.target.value === '' ? '' : Number(e.target.value))
                }
              />
            </div>
            <div className="field">
              <label>Rodadas</label>
              <input
                type="number"
                min={0}
                value={rounds}
                onChange={(e) =>
                  setRounds(e.target.value === '' ? '' : Number(e.target.value))
                }
              />
            </div>
          </div>
          <div className="field">
            <label>Notas</label>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary">
            Adicionar à sessão
          </button>
        </form>
        )}
      </details>
    </div>
  );
}
