import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { PersonalNav } from '../components/PersonalNav';
import { api, getToken } from '../services/api';

type Exercise = {
  id: string;
  name: string;
  description: string | null;
  videoUrl: string | null;
  category: string | null;
  equipment: string | null;
  technicalNotes: string | null;
  alternativeInstructions: string | null;
};

export function ExerciseEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [row, setRow] = useState<Exercise | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [category, setCategory] = useState('');
  const [equipment, setEquipment] = useState('');
  const [technicalNotes, setTechnicalNotes] = useState('');
  const [alt, setAlt] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      navigate('/login');
      return;
    }
    if (!id) return;
    api
      .get<Exercise>(`/api/exercises/${id}`)
      .then((x) => {
        setRow(x);
        setName(x.name);
        setDescription(x.description ?? '');
        setVideoUrl(x.videoUrl ?? '');
        setCategory(x.category ?? '');
        setEquipment(x.equipment ?? '');
        setTechnicalNotes(x.technicalNotes ?? '');
        setAlt(x.alternativeInstructions ?? '');
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Erro'));
  }, [id, navigate]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!id) return;
    setError(null);
    setLoading(true);
    try {
      await api.patch(`/api/exercises/${id}`, {
        name,
        description: description || undefined,
        videoUrl: videoUrl || undefined,
        category: category || undefined,
        equipment: equipment || undefined,
        technicalNotes: technicalNotes || undefined,
        alternativeInstructions: alt || undefined,
      });
      navigate('/exercises');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro');
    } finally {
      setLoading(false);
    }
  }

  if (!row && !error) {
    return (
      <div className="app-shell">
        <PersonalNav />
        <p className="muted">Carregando…</p>
      </div>
    );
  }

  if (error && !row) {
    return (
      <div className="app-shell">
        <PersonalNav />
        <p className="form-error">{error}</p>
        <Link to="/exercises" className="link-subtle">
          ← Voltar
        </Link>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <PersonalNav />
      <PageHeader
        title="Editar exercício"
        breadcrumbs={
          <Link to="/exercises" className="link-subtle">
            ← Exercícios
          </Link>
        }
      />
      <div className="card" style={{ maxWidth: 560 }}>
        <form onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="ee-name">Nome</label>
            <input
              id="ee-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="ee-desc">Descrição</label>
            <textarea
              id="ee-desc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="ee-video">URL do vídeo</label>
            <input
              id="ee-video"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="ee-cat">Categoria</label>
            <input
              id="ee-cat"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="ee-eq">Equipamento</label>
            <input
              id="ee-eq"
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="ee-notes">Notas técnicas</label>
            <textarea
              id="ee-notes"
              rows={2}
              value={technicalNotes}
              onChange={(e) => setTechnicalNotes(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="ee-alt">Instruções alternativas</label>
            <textarea
              id="ee-alt"
              rows={2}
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
            />
          </div>
          {error ? <p className="form-error">{error}</p> : null}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '…' : 'Salvar'}
          </button>
        </form>
      </div>
    </div>
  );
}
