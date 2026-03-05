import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { logo } from "../constants/cloudinaryAssets.js";

function Navbar({ active = "inicio" }) {
  const [isOpen, setIsOpen] = useState(false);
  const navId = useId();

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <header className="topbar">
      <a className="skip-link" href="#main-content">
        Saltar al contenido principal
      </a>

      <Link className="brand" to="/" onClick={handleClose} aria-label="Ir a inicio">
        <div className="logo-badge">
          <img src={logo} alt="Logotipo de Bar Corona" />
        </div>
        <div className="brand-title">
          <span className="brand-kicker"></span>
          <h1>Bar Corona</h1>
        </div>
      </Link>

      <button
        className="nav-toggle"
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Cerrar menu" : "Abrir menu"}
        aria-controls={navId}
      >
        <span className="nav-toggle-icon" aria-hidden="true" />
      </button>

      <nav id={navId} className={`nav ${isOpen ? "is-open" : ""}`} aria-label="Navegacion principal">
        <Link
          className={`nav-pill ${active === "inicio" ? "is-active" : ""}`}
          to="/"
          onClick={handleClose}
          aria-current={active === "inicio" ? "page" : undefined}
        >
          Inicio
        </Link>
        <Link
          className={`nav-pill ${active === "carta" ? "is-active" : ""}`}
          to="/carta"
          onClick={handleClose}
          aria-current={active === "carta" ? "page" : undefined}
        >
          Carta
        </Link>
        <Link
          className={`nav-pill ${active === "eventos" ? "is-active" : ""}`}
          to="/eventos"
          onClick={handleClose}
          aria-current={active === "eventos" ? "page" : undefined}
        >
          Eventos
        </Link>
        <Link
          className={`nav-pill ${active === "galeria" ? "is-active" : ""}`}
          to="/galeria"
          onClick={handleClose}
          aria-current={active === "galeria" ? "page" : undefined}
        >
          Galeria
        </Link>
        <Link
          className={`nav-pill ${active === "opiniones" ? "is-active" : ""}`}
          to="/contact"
          onClick={handleClose}
          aria-current={active === "opiniones" ? "page" : undefined}
        >
          Opiniones
        </Link>
        <Link
          className={`nav-pill is-reserve ${active === "reserva" ? "is-active" : ""}`}
          to="/reservation"
          onClick={handleClose}
          aria-current={active === "reserva" ? "page" : undefined}
        >
          Reserva
        </Link>
      </nav>
    </header>
  );
}

export default Navbar;
