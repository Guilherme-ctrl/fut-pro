import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { PersonalNav } from '../components/PersonalNav';
import { api, getToken } from '../services/api';

export function ExerciseNew() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [category, setCategory] = useState('');
  const [equipment, setEquipment] = useState('');
  const [technicalNotes, setTechnicalNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!getToken()) navigate('/login');
  }, [navigate]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.post('/api/exercises', {
        name,
        description: description || undefined,
        videoUrl: videoUrl || undefined,
        category: category || undefined,
        equipment: equipment || undefined,
        technicalNotes: technicalNotes || undefined,
      });
      navigate('/exercises');
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
        title="Novo exercício"
        subtitle="Nome, mídia de referência e notas para o atleta."
        breadcrumbs={
          <Link to="/exercises" className="link-subtle">
            ← Exercícios
          </Link>
        }
      />
      <div className="card" style={{ maxWidth: 560 }}>
        <form onSubmit={onSubmit}>
          <div className="form-section">
            <h3 className="form-section__title">Básico</h3>
            <div className="field">
              <label htmlFor="ex-name">Nome</label>
              <input
                id="ex-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="ex-desc">Descrição</label>
              <textarea
                id="ex-desc"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="ex-video">URL do vídeo</label>
              <input
                id="ex-video"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="YouTube, Vimeo ou link direto"
              />
              <span className="muted" style={{ fontSize: '0.8rem' }}>
                O atleta poderá abrir o vídeo durante o treino guiado.
              </span>
            </div>
            <div className="field">
              <label htmlFor="ex-cat">Categoria</label>
              <input
                id="ex-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ex.: Força, campo, mobilidade"
              />
            </div>
          </div>
          <div className="form-section">
            <h3 className="form-section__title">Detalhes</h3>
            <div className="field">
              <label htmlFor="ex-eq">Equipamento</label>
              <input
                id="ex-eq"
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="ex-notes">Notas técnicas</label>
              <textarea
                id="ex-notes"
                rows={2}
                value={technicalNotes}
                onChange={(e) => setTechnicalNotes(e.target.value)}
              />
            </div>
          </div>
          {error ? <p className="form-error">{error}</p> : null}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '…' : 'Salvar exercício'}
          </button>
        </form>
      </div>
    </div>
  );
}
