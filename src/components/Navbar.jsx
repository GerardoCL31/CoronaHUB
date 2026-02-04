import logo from "../assets/logo.png";

function Navbar({ active = "inicio", cartaTarget = "_self" }) {
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
      <nav className="nav">
        <a className={`nav-pill ${active === "inicio" ? "is-active" : ""}`} href="/index.html#inicio">
          Inicio
        </a>
        <a
          className={`nav-pill ${active === "carta" ? "is-active" : ""}`}
          href="/carta.html"
          target={cartaTarget}
          rel={cartaTarget === "_blank" ? "noopener noreferrer" : undefined}
        >
          Carta
        </a>
        <a className={`nav-pill ${active === "eventos" ? "is-active" : ""}`} href="/index.html#eventos">
          Eventos
        </a>
        <a className={`nav-pill ${active === "galeria" ? "is-active" : ""}`} href="/index.html#galeria">
          Galeria
        </a>
        <a className={`nav-pill ${active === "opiniones" ? "is-active" : ""}`} href="/index.html#opiniones">
          Opiniones
        </a>
        <a className="nav-pill is-reserve" href="/index.html#reserva">
          Reserva
        </a>
      </nav>
    </header>
  );
}

export default Navbar;
