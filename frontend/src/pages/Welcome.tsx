import { Link } from 'react-router-dom';

export function Welcome() {
  return (
    <div className="welcome">
      <div className="welcome__card">
        <p className="welcome__brand">Personal Futebol</p>
        <h1 className="welcome__title">Prescrição guiada com aderência</h1>
        <p className="welcome__lead">
          Uma experiência para o treinador prescrever e acompanhar — e para o
          atleta executar o treino com clareza, timer e feedback.
        </p>
        <div className="welcome__actions">
          <Link to="/login" className="btn btn-primary btn-lg btn-block">
            Sou treinador(a)
          </Link>
          <Link to="/athlete/login" className="btn btn-secondary btn-lg btn-block">
            Sou atleta
          </Link>
        </div>
        <p className="welcome__hint">
          Ambiente de demonstração — use as contas do README após o seed.
        </p>
      </div>
    </div>
  );
}
