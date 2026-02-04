import { useState } from "react";
import logo from "../assets/logo.png";

function Navbar({ active = "inicio", cartaTarget = "_self" }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <header className="topbar">
      <div className="brand">
        <div className="logo-badge">
          <img src={logo} alt="Bar Corona logo" />
        </div>
        <div className="brand-title">
          <span className="brand-kicker">Intro</span>
          <h1>Bar Corona</h1>
        </div>
      </div>
      <button className="nav-toggle" type="button" onClick={handleToggle} aria-expanded={isOpen} aria-label="Abrir menu">
        <span />
        <span />
        <span />
      </button>
      <nav className={`nav ${isOpen ? "is-open" : ""}`}>
        <a className={`nav-pill ${active === "inicio" ? "is-active" : ""}`} href="/index.html#inicio" onClick={handleClose}>
          Inicio
        </a>
        <a
          className={`nav-pill ${active === "carta" ? "is-active" : ""}`}
          href="/carta.html"
          target={cartaTarget}
          rel={cartaTarget === "_blank" ? "noopener noreferrer" : undefined}
          onClick={handleClose}
        >
          Carta
        </a>
        <a className={`nav-pill ${active === "eventos" ? "is-active" : ""}`} href="/eventos.html" onClick={handleClose}>
          Eventos
        </a>
        <a className={`nav-pill ${active === "galeria" ? "is-active" : ""}`} href="/index.html#galeria" onClick={handleClose}>
          Galeria
        </a>
        <a className={`nav-pill ${active === "opiniones" ? "is-active" : ""}`} href="/index.html#opiniones" onClick={handleClose}>
          Opiniones
        </a>
        <a className="nav-pill is-reserve" href="/index.html#reserva" onClick={handleClose}>
          Reserva
        </a>
      </nav>
    </header>
  );
}

export default Navbar;
