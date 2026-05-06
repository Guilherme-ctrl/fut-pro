import { NavLink, useNavigate } from 'react-router-dom';
import { setToken } from '../services/api';

export function PersonalNav() {
  const navigate = useNavigate();

  function logout() {
    setToken(null);
    navigate('/login');
  }

  return (
    <header className="personal-nav">
      <div className="personal-nav__inner">
        <NavLink to="/dashboard" className="personal-nav__brand" end>
          fut<span>Pro</span>
        </NavLink>
        <nav
          className="personal-nav__links"
          aria-label="Área do treinador"
        >
          <NavLink to="/dashboard" end>
            Dashboard
          </NavLink>
          <NavLink to="/athletes">Atletas</NavLink>
          <span className="personal-nav__divider" aria-hidden />
          <NavLink to="/protocols">Protocolos</NavLink>
          <NavLink to="/exercises">Exercícios</NavLink>
        </nav>
        <button
          type="button"
          className="btn btn-ghost personal-nav__logout"
          onClick={logout}
        >
          Sair
        </button>
      </div>
    </header>
  );
}
