import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function Navbar({ active = "inicio" }) {
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
        <Link
          className={`nav-pill ${active === "inicio" ? "is-active" : ""}`}
          to="/"
          onClick={handleClose}
        >
          Inicio
        </Link>
        <Link
          className={`nav-pill ${active === "carta" ? "is-active" : ""}`}
          to="/carta"
          onClick={handleClose}
        >
          Carta
        </Link>
        <Link
          className={`nav-pill ${active === "eventos" ? "is-active" : ""}`}
          to="/eventos"
          onClick={handleClose}
        >
          Eventos
        </Link>
        <Link
          className={`nav-pill ${active === "galeria" ? "is-active" : ""}`}
          to="/galeria"
          onClick={handleClose}
        >
          Galeria
        </Link>
        <Link
          className={`nav-pill ${active === "opiniones" ? "is-active" : ""}`}
          to="/contact"
          onClick={handleClose}
        >
          Opiniones
        </Link>
        <Link
          className={`nav-pill is-reserve ${active === "reserva" ? "is-active" : ""}`}
          to="/reservation"
          onClick={handleClose}
        >
          Reserva
        </Link>
      </nav>
    </header>
  );
}

export default Navbar;
