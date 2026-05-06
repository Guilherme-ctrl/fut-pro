import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { DashboardSkeleton, ErrorRetry } from '../components/PageLoading';
import { PageHeader } from '../components/PageHeader';
import { PersonalNav } from '../components/PersonalNav';
import { api, getToken } from '../services/api';

type Athlete = {
  id: string;
  name: string;
  email: string;
  userId: string | null;
  phone: string | null;
  age: number | null;
  position: string | null;
  objective: string | null;
  notes: string | null;
  status: string;
};

type Adherence = {
  prescribed: number;
  completed: number;
  adherencePercent: number;
  daysSinceLastTraining: number | null;
  currentCycle: number;
  currentTrainingOrder: number;
  status: string;
  missedOrLate: number;
};

type HistoryRow = {
  id: string;
  finishedAt: string | null;
  perceivedDifficulty: string | null;
  feltPain: boolean | null;
  trainingSession: { name: string };
};

type AlertRow = {
  id: string;
  type: string;
  message: string;
  createdAt: string;
  isRead: boolean;
};

type PrescriptionRow = {
  id: string;
  status: string;
  currentCycle: number;
  currentTrainingOrder: number;
  athlete: { id: string; name: string };
  protocol: { name: string; trainingCount: number; cycleCount: number };
};

type TabId = 'overview' | 'prescription' | 'adherence' | 'alerts' | 'history';

export function AthleteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabId>('overview');
  const [athlete, setAthlete] = useState<Athlete | null>(null);
  const [adherence, setAdherence] = useState<Adherence | null>(null);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [alerts, setAlerts] = useState<AlertRow[]>([]);
  const [prescriptions, setPrescriptions] = useState<PrescriptionRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordOk, setPasswordOk] = useState(false);

  const load = useCallback(() => {
    if (!getToken()) {
      navigate('/login');
      return Promise.resolve();
    }
    if (!id) return Promise.resolve();
    setError(null);
    setLoading(true);
    return Promise.all([
      api.get<Athlete>(`/api/athletes/${id}`),
      api.get<Adherence | null>(`/api/athletes/${id}/adherence`),
      api.get<HistoryRow[]>(`/api/athletes/${id}/history`),
      api.get<AlertRow[]>(`/api/athletes/${id}/alerts`),
      api.get<PrescriptionRow[]>('/api/prescriptions'),
    ])
      .then(([a, ad, h, al, pr]) => {
        setAthlete(a);
        setAdherence(ad);
        setHistory(h);
        setAlerts(al);
        setPrescriptions(pr.filter((p) => p.athlete.id === id));
      })
      .catch((e) => {
        setAthlete(null);
        setError(e instanceof Error ? e.message : 'Erro ao carregar');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  useEffect(() => {
    void load();
  }, [load]);

  async function removeAthlete() {
    if (!id || !athlete) return;
    const ok = window.confirm(
      `Excluir ${athlete.name} permanentemente?\n\nSerão removidos prescrições, execuções de treino e alertas deste atleta. Não dá para desfazer.`,
    );
    if (!ok) return;
    setDeleteError(null);
    setDeleting(true);
    try {
      await api.delete(`/api/athletes/${id}`);
      navigate('/athletes');
    } catch (e) {
      setDeleteError(
        e instanceof Error ? e.message : 'Não foi possível excluir o atleta.',
      );
    } finally {
      setDeleting(false);
    }
  }

  async function onPasswordSubmit(e: FormEvent) {
    e.preventDefault();
    if (!id) return;
    setPasswordError(null);
    setPasswordOk(false);
    if (newPassword.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('As senhas não coincidem.');
      return;
    }
    setPasswordSaving(true);
    try {
      await api.patch(`/api/athletes/${id}`, { password: newPassword });
      setNewPassword('');
      setConfirmPassword('');
      setPasswordOk(true);
      const refreshed = await api.get<Athlete>(`/api/athletes/${id}`);
      setAthlete(refreshed);
    } catch (err) {
      setPasswordError(
        err instanceof Error ? err.message : 'Não foi possível salvar a senha.',
      );
    } finally {
      setPasswordSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="app-shell">
        <PersonalNav />
        <p className="muted">
          <Link to="/athletes" className="link-subtle">
            ← Atletas
          </Link>
        </p>
        <DashboardSkeleton />
      </div>
    );
  }

  if (error || !athlete) {
    return (
      <div className="app-shell">
        <PersonalNav />
        <p className="muted">
          <Link to="/athletes" className="link-subtle">
            ← Atletas
          </Link>
        </p>
        <ErrorRetry
          message={error ?? 'Atleta não encontrado'}
          onRetry={() => void load()}
        />
      </div>
    );
  }

  const activeRx = prescriptions.find((p) => p.status === 'ACTIVE');

  const tabs: { id: TabId; label: string }[] = [
    { id: 'overview', label: 'Resumo' },
    { id: 'prescription', label: 'Prescrição' },
    { id: 'adherence', label: 'Aderência' },
    { id: 'alerts', label: `Alertas${alerts.length ? ` (${alerts.length})` : ''}` },
    { id: 'history', label: 'Histórico' },
  ];

  function alertBadgeClass(type: string) {
    const t = type.toUpperCase();
    if (t.includes('PAIN') || t.includes('DOR')) return 'badge--danger';
    if (t.includes('STOP') || t.includes('BEHIND')) return 'badge--pending';
    return 'badge--neutral';
  }

  return (
    <div className="app-shell">
      <PersonalNav />
      <PageHeader
        title={athlete.name}
        subtitle={`${athlete.email}${athlete.phone ? ` · ${athlete.phone}` : ''}`}
        breadcrumbs={
          <Link to="/athletes" className="link-subtle">
            ← Atletas
          </Link>
        }
        actions={
          <Link
            className="btn btn-primary"
            to={`/prescriptions/new?athleteId=${athlete.id}`}
          >
            Nova prescrição
          </Link>
        }
      />

      <div className="card">
        <h3 style={{ marginTop: 0, fontSize: '1rem' }}>Senha no app do atleta</h3>
        <p className="muted" style={{ marginTop: 0 }}>
          {athlete.userId
            ? 'O atleta entra em “Sou atleta” com o email acima. Você pode redefinir a senha aqui quando precisar.'
            : 'Ainda não há conta de login para este email. Defina uma senha abaixo para o atleta poder entrar no app.'}
        </p>
        <form onSubmit={onPasswordSubmit}>
          <div className="field">
            <label htmlFor="ath-new-pass">Nova senha</label>
            <input
              id="ath-new-pass"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setPasswordOk(false);
              }}
              minLength={6}
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          <div className="field">
            <label htmlFor="ath-confirm-pass">Confirmar senha</label>
            <input
              id="ath-confirm-pass"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setPasswordOk(false);
              }}
              minLength={6}
            />
          </div>
          {passwordError ? <p className="form-error">{passwordError}</p> : null}
          {passwordOk ? (
            <p style={{ color: 'var(--color-success)', margin: '0 0 0.75rem' }}>
              Senha salva com sucesso.
            </p>
          ) : null}
          <button
            type="submit"
            className="btn btn-secondary"
            disabled={passwordSaving}
          >
            {passwordSaving ? 'Salvando…' : athlete.userId ? 'Atualizar senha' : 'Definir senha e liberar acesso'}
          </button>
        </form>
      </div>

      <div className="tabs" role="tablist" aria-label="Seções do atleta">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            data-active={tab === t.id ? 'true' : undefined}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="card">
          <h3 style={{ marginTop: 0, fontSize: '1rem' }}>Dados</h3>
          <p className="muted" style={{ marginTop: 0 }}>
            {athlete.position ?? '—'} ·{' '}
            {athlete.age ? `${athlete.age} anos` : 'Idade —'}
          </p>
          <p>{athlete.objective || '—'}</p>
          {athlete.notes ? <p className="muted">{athlete.notes}</p> : null}
          <span
            className={`badge ${athlete.status === 'ACTIVE' ? 'badge--ok' : ''}`}
          >
            {athlete.status}
          </span>
          {activeRx ? (
            <p style={{ marginTop: '1rem', marginBottom: 0 }}>
              <span className="muted">Prescrição ativa:</span>{' '}
              <strong>{activeRx.protocol.name}</strong>
            </p>
          ) : (
            <p className="muted" style={{ marginTop: '1rem' }}>
              Sem prescrição ativa.
            </p>
          )}
        </div>
      )}

      {tab === 'prescription' && (
        <div className="card">
          <h3 style={{ marginTop: 0, fontSize: '1rem' }}>Prescrição</h3>
          {activeRx ? (
            <>
              <p>
                <strong>{activeRx.protocol.name}</strong>
              </p>
              <p className="muted">
                Ciclo {activeRx.currentCycle} · próximo treino ordem{' '}
                {activeRx.currentTrainingOrder} / {activeRx.protocol.trainingCount}
              </p>
              <p className="muted" style={{ fontSize: '0.85rem' }}>
                Para trocar de protocolo, pause ou conclua a prescrição atual
                (API / gestão futura).
              </p>
            </>
          ) : (
            <p className="muted">Nenhuma prescrição ativa.</p>
          )}
          <Link
            className="btn btn-secondary"
            to={`/prescriptions/new?athleteId=${athlete.id}`}
            style={{ display: 'inline-flex', marginTop: '0.75rem' }}
          >
            {activeRx ? 'Adicionar nova (após encerrar atual)' : 'Prescrever protocolo'}
          </Link>
        </div>
      )}

      {tab === 'adherence' && adherence && (
        <div className="card">
          <h3 style={{ marginTop: 0, fontSize: '1rem' }}>Aderência</h3>
          <div className="grid-stats">
            <div className="stat">
              <strong className="stat__accent">{adherence.adherencePercent}%</strong>
              <span className="muted">Aderência</span>
            </div>
            <div className="stat">
              <strong>{adherence.completed}</strong>
              <span className="muted">Concluídos</span>
            </div>
            <div className="stat">
              <strong>{adherence.prescribed}</strong>
              <span className="muted">Esperados</span>
            </div>
            <div className="stat">
              <strong>{adherence.status}</strong>
              <span className="muted">Status</span>
            </div>
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Dias sem treinar: {adherence.daysSinceLastTraining ?? '—'} · Atraso
            estimado: {adherence.missedOrLate}
          </p>
        </div>
      )}

      {tab === 'adherence' && !adherence && (
        <div className="card">
          <p className="muted">Sem dados de aderência ainda.</p>
        </div>
      )}

      {tab === 'alerts' && (
        <div className="card">
          <h3 style={{ marginTop: 0, fontSize: '1rem' }}>Alertas recentes</h3>
          {alerts.length === 0 && <p className="muted">Nenhum alerta.</p>}
          {alerts.slice(0, 15).map((a) => (
            <div key={a.id} className="list-divider">
              <span className={`badge ${alertBadgeClass(a.type)}`}>{a.type}</span>{' '}
              <span className="muted" style={{ fontSize: '0.8rem' }}>
                {new Date(a.createdAt).toLocaleString()}
              </span>
              <p style={{ margin: '0.35rem 0 0' }}>{a.message}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'history' && (
        <div className="card">
          <h3 style={{ marginTop: 0, fontSize: '1rem' }}>Histórico de execuções</h3>
          {history.length === 0 && <p className="muted">Sem execuções ainda.</p>}
          {history.slice(0, 20).map((h) => (
            <div key={h.id} className="list-divider">
              <strong>{h.trainingSession.name}</strong>
              <p className="muted" style={{ margin: '0.25rem 0' }}>
                {h.finishedAt
                  ? new Date(h.finishedAt).toLocaleString()
                  : '—'}{' '}
                · {h.perceivedDifficulty ?? '—'} · dor:{' '}
                {h.feltPain == null ? '—' : h.feltPain ? 'sim' : 'não'}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="card danger-zone" style={{ marginTop: '1.5rem' }}>
        <h3>Excluir atleta</h3>
        <p className="muted" style={{ marginTop: 0 }}>
          Remove o cadastro e todos os dados vinculados (prescrições, histórico de
          treinos, alertas). A conta de login do atleta, se existir, também será
          apagada.
        </p>
        {deleteError ? <p className="form-error">{deleteError}</p> : null}
        <button
          type="button"
          className="btn btn-danger"
          disabled={deleting}
          onClick={() => void removeAthlete()}
        >
          {deleting ? 'Excluindo…' : 'Excluir atleta'}
        </button>
      </div>
    </div>
  );
}
