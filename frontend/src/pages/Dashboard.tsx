import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DashboardSkeleton, ErrorRetry } from '../components/PageLoading';
import { PageHeader } from '../components/PageHeader';
import { PersonalNav } from '../components/PersonalNav';
import { api, getToken } from '../services/api';

type Summary = {
  activeAthletes: number;
  averageAdherencePercent: number;
  athletesOnTrack: number;
  athletesAttention: number;
  athletesLate: number;
  athletesStopped: number;
  trainingsCompletedThisWeek: number;
  painAlertsLast7Days: number;
};

export function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<Summary | null>(null);
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
      .get<Summary>('/api/dashboard/summary')
      .then(setSummary)
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
        title="Dashboard"
        subtitle="Visão operacional dos atletas, aderência e alertas recentes."
      />
      {loading && <DashboardSkeleton />}
      {error && <ErrorRetry message={error} onRetry={() => void load()} />}
      {!loading && !error && summary && (
        <div className="dashboard-layout">
          <div>
            <div className="grid-stats">
              <div className="stat">
                <strong className="stat__accent">{summary.activeAthletes}</strong>
                <span className="muted">Atletas ativos</span>
              </div>
              <div className="stat">
                <strong>{summary.averageAdherencePercent}%</strong>
                <span className="muted">Aderência média</span>
              </div>
              <div className="stat">
                <strong>{summary.trainingsCompletedThisWeek}</strong>
                <span className="muted">Treinos na semana</span>
              </div>
              <div className="stat">
                <strong
                  style={
                    summary.painAlertsLast7Days > 0
                      ? { color: 'var(--color-danger)' }
                      : undefined
                  }
                >
                  {summary.painAlertsLast7Days}
                </strong>
                <span className="muted">Alertas dor (7d)</span>
              </div>
            </div>

            <div className="card" style={{ marginTop: '1.25rem' }}>
              <h3 style={{ marginTop: 0, fontSize: '1rem' }}>Status dos atletas</h3>
              <p className="muted" style={{ marginTop: 0 }}>
                Distribuição por acompanhamento — priorize quem está em atenção
                ou atrasado.
              </p>
              <div className="status-grid">
                <div className="status-pill status-pill--ok">
                  <strong>{summary.athletesOnTrack}</strong>
                  <span className="muted" style={{ fontSize: '0.8rem' }}>
                    Em dia
                  </span>
                </div>
                <div className="status-pill status-pill--warn">
                  <strong>{summary.athletesAttention}</strong>
                  <span className="muted" style={{ fontSize: '0.8rem' }}>
                    Atenção
                  </span>
                </div>
                <div className="status-pill status-pill--danger">
                  <strong>{summary.athletesLate}</strong>
                  <span className="muted" style={{ fontSize: '0.8rem' }}>
                    Atrasados
                  </span>
                </div>
                <div className="status-pill status-pill--neutral">
                  <strong>{summary.athletesStopped}</strong>
                  <span className="muted" style={{ fontSize: '0.8rem' }}>
                    Parados
                  </span>
                </div>
              </div>
              <p style={{ marginBottom: 0, marginTop: '1rem' }}>
                <Link to="/athletes" className="btn btn-secondary" style={{ display: 'inline-flex' }}>
                  Ver todos os atletas
                </Link>
              </p>
            </div>
          </div>

          <aside>
            <div className="card" style={{ marginBottom: 0 }}>
              <h3 style={{ marginTop: 0, fontSize: '0.85rem' }}>
                Atalhos
              </h3>
              <nav className="quick-links" aria-label="Atalhos do painel">
                <Link to="/athletes">Atletas</Link>
                <Link to="/athletes/new">Novo atleta</Link>
                <Link to="/protocols">Protocolos</Link>
                <Link to="/exercises">Exercícios</Link>
                <Link to="/prescriptions/new">Nova prescrição</Link>
              </nav>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
