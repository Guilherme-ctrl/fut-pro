import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { PersonalNav } from '../components/PersonalNav';
import { api, getToken } from '../services/api';

type Athlete = { id: string; name: string; email: string };
type Protocol = { id: string; name: string; trainingCount: number };

export function PrescriptionNew() {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const preAthlete = search.get('athleteId') ?? '';

  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [athleteId, setAthleteId] = useState(preAthlete);
  const [protocolId, setProtocolId] = useState('');
  const [startDate, setStartDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [weeklyFrequency, setWeeklyFrequency] = useState(4);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      navigate('/login');
      return;
    }
    let cancelled = false;
    Promise.all([
      api.get<Athlete[]>('/api/athletes'),
      api.get<Protocol[]>('/api/protocols'),
    ])
      .then(([a, p]) => {
        if (cancelled) return;
        setAthletes(a);
        setProtocols(p);
        setAthleteId((prev) => prev || a[0]?.id || '');
        setProtocolId((prev) => prev || p[0]?.id || '');
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Erro');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const selectedAthlete = useMemo(
    () => athletes.find((a) => a.id === athleteId),
    [athletes, athleteId],
  );
  const selectedProtocol = useMemo(
    () => protocols.find((p) => p.id === protocolId),
    [protocols, protocolId],
  );

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const sel = protocols.find((p) => p.id === protocolId);
      if (sel && sel.trainingCount < 1) {
        setError('Protocolo precisa ter ao menos um treino cadastrado.');
        setLoading(false);
        return;
      }
      await api.post('/api/prescriptions', {
        athleteId,
        protocolId,
        startDate: new Date(startDate).toISOString(),
        weeklyFrequency,
      });
      navigate(athleteId ? `/athletes/${athleteId}` : '/athletes');
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
        title="Nova prescrição"
        subtitle="Uma prescrição ativa por atleta. Confira o resumo antes de confirmar."
        breadcrumbs={
          <Link
            to={athleteId ? `/athletes/${athleteId}` : '/athletes'}
            className="link-subtle"
          >
            ← Voltar
          </Link>
        }
      />
      <div className="card" style={{ maxWidth: 520 }}>
        <p className="muted" style={{ marginTop: 0 }}>
          Só é permitida uma prescrição <strong>ACTIVE</strong> por atleta. Se já
          existir, pause ou conclua a atual na API ou em futura tela de gestão.
        </p>
        <form onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="rx-ath">Atleta</label>
            <select
              id="rx-ath"
              value={athleteId}
              onChange={(e) => setAthleteId(e.target.value)}
              required
            >
              {athletes.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.email})
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="rx-proto">Protocolo</label>
            <select
              id="rx-proto"
              value={protocolId}
              onChange={(e) => setProtocolId(e.target.value)}
              required
            >
              {protocols.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.trainingCount} treinos)
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="rx-start">Início</label>
            <input
              id="rx-start"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="rx-freq">Frequência semanal</label>
            <input
              id="rx-freq"
              type="number"
              min={1}
              max={7}
              value={weeklyFrequency}
              onChange={(e) => setWeeklyFrequency(Number(e.target.value))}
            />
          </div>

          {selectedAthlete && selectedProtocol && (
            <div className="prescription-summary" aria-live="polite">
              <dl>
                <div>
                  <dt>Atleta</dt>
                  <dd>{selectedAthlete.name}</dd>
                </div>
                <div>
                  <dt>Protocolo</dt>
                  <dd>{selectedProtocol.name}</dd>
                </div>
                <div>
                  <dt>Início</dt>
                  <dd>
                    {new Date(startDate + 'T12:00:00').toLocaleDateString('pt-BR')}
                  </dd>
                </div>
                <div>
                  <dt>Frequência</dt>
                  <dd>
                    {weeklyFrequency}x por semana
                  </dd>
                </div>
              </dl>
            </div>
          )}

          {error ? <p className="form-error">{error}</p> : null}
          <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
            {loading ? '…' : 'Confirmar prescrição'}
          </button>
        </form>
      </div>
    </div>
  );
}
