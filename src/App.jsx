import "./App.css";
import logo from "./assets/logo.png";
import portada from "./assets/portada.png";
import mapaImg from "./assets/mapa.png";


function App() {
  return (
    <div className="page">
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
          <a className="nav-pill is-active" href="#inicio">
            Inicio
          </a>
          <a className="nav-pill" href="#carta">
            Carta
          </a>
          <a className="nav-pill" href="#eventos">
            Eventos
          </a>
          <a className="nav-pill" href="#galeria">
            Galeria
          </a>
          <a className="nav-pill" href="#opiniones">
            Opiniones
          </a>
          <a className="nav-pill is-reserve" href="#reserva">
            Reserva
          </a>
        </nav>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-media">
          <img
            className="hero-photo"
            src={portada}
            alt="Fachada de Bar Corona"
          />
        </div>
        <aside className="events" id="eventos">
          <h2>Proximos eventos</h2>
          <div className="event-card">
            <div className="event-icon beer" aria-hidden="true" />
            <div>
              <h3>Tardeo Cervecero</h3>
              <p>Viernes - 2:00 pm a 5:00 pm</p>
              <p className="event-note">
                Degustacion con cervezas especiales y musica suave.
              </p>
            </div>
          </div>
          <div className="event-card">
            <div className="event-icon sun" aria-hidden="true" />
            <div>
              <h3>Brunch & Beats</h3>
              <p>Sabado - 11:00 am a 4:30 pm</p>
              <p className="event-note">
                Combos de brunch, mimosas ilimitadas por hora.
              </p>
            </div>
          </div>
        </aside>
      </section>

      <section className="info-strip">
        <div className="hours">
          <h3>Horarios:</h3>
          <p>Lunes a sabado: 8:00 am - 5:00 pm</p>
          <p>Domingo: 8:00 am - 12:00 pm</p>
        </div>
        <div className="map-card">
  <a
    href="https://share.google/fyJ2NpJ85uG2Vk8NH"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img
      src={mapaImg}
      alt="Mapa de ubicación de Bar Corona"
    />
  </a>
</div>

      </section>
    </div>
  );
}

export default App;
