import { NavLink, useNavigate } from 'react-router-dom';
import { setToken } from '../services/api';

export function AthleteNav() {
  const navigate = useNavigate();

  function logout() {
    setToken(null);
    navigate('/athlete/login');
  }

  return (
    <header className="athlete-nav">
      <NavLink to="/athlete/home" className="athlete-nav__brand" end>
        fut<span className="text-accent">Pro</span>
      </NavLink>
      <nav className="athlete-nav__links" aria-label="Navegação do atleta">
        <NavLink to="/athlete/home" end>
          Início
        </NavLink>
        <NavLink to="/athlete/history">Histórico</NavLink>
        <button
          type="button"
          className="btn btn-ghost athlete-nav__logout"
          onClick={logout}
        >
          Sair
        </button>
      </nav>
    </header>
  );
}
