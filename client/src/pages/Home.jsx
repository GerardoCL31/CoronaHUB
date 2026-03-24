import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import { cerveza, mapa as mapaImg, portada, portadaMobile, sol } from "../constants/cloudinaryAssets.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { fallbackHomeEvents } from "../constants/homeEventsFallback.js";
import { getEvents } from "../services/events.service.js";

const getHomeIcon = (card, index) => {
  const custom = card.imageUrl?.trim();
  if (custom) return custom;
  return index % 2 === 0 ? cerveza : sol;
};

export default function Home() {
  const [eventsData, setEventsData] = useState(fallbackHomeEvents);
  const homeCards = Array.isArray(eventsData.homeCards) ? eventsData.homeCards.slice(0, 2) : [];

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await getEvents();
        if (data) {
          setEventsData(data);
        }
      } catch {
        
      }
    };

    loadEvents();
  }, []);

  return (
    <div className="page">
      <Navbar active="inicio" />

      <main id="main-content" tabIndex={-1}>
        <section className="home-hero" id="inicio">
          <div className="hero-media home-hero-media">
            <img
              className="hero-photo"
              src={portada}
              srcSet={`${portadaMobile} 720w, ${portada} 1400w`}
              sizes="100vw"
              alt="Fachada de Bar Corona"
              fetchPriority="high"
              loading="eager"
              decoding="async"
            />
            <div className="home-hero-copy">
              <p className="home-eyebrow">Bar Corona</p>
              <h2>
                Desayunos, tapas{" "}
                <br className="home-title-break" />
                y buen ambiente{" "}
                <br className="home-title-break" />
                en Trajano.
              </h2>
              <p className="home-lead">
                Un sitio sencillo para desayunar, tomar algo y quedar con amigos sin complicarte.
              </p>
              <div className="home-actions">
                <Link className="home-cta home-cta-primary" to="/reservation">
                  Reservar
                </Link>
                <Link className="home-cta home-cta-secondary" to="/carta">
                  Ver carta
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="home-summary">
          <article className="home-summary-card">
            <span>Horario</span>
            <strong>Lunes a sábado</strong>
            <p>8:00 - 17:00</p>
          </article>
          <article className="home-summary-card">
            <span>Domingo</span>
            <strong>Solo mañana</strong>
            <p>8:00 - 12:00</p>
          </article>
        </section>

        <section className="home-section" id="eventos">
          <div className="home-section-heading">
            <p className="home-section-kicker">Eventos</p>
            <h2>{eventsData.homeTitle || "Próximos eventos"}</h2>
          </div>
          <div className="home-events-grid">
            {homeCards.map((card, index) => (
              <article className="home-event-card" key={card.id}>
                <div className="home-event-icon">
                  <img
                    src={getHomeIcon(card, index)}
                    alt={card.imageAlt || card.title}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="home-event-copy">
                  <h3>{card.title}</h3>
                  <p className="home-event-meta">{card.schedule}</p>
                  <p>{card.note}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="home-map-section">
          <div className="home-map-copy">
            <p className="home-section-kicker">Cómo llegar</p>
            <h2>Estamos donde tienes que estar.</h2>
            <p>Si quieres venir directo, abre el mapa y listo.</p>
          </div>
          <a
            className="map-card"
            href="https://share.google/fyJ2NpJ85uG2Vk8NH"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Abrir ubicación en Google Maps"
          >
            <img src={mapaImg} alt="Mapa de ubicación de Bar Corona" loading="lazy" decoding="async" />
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
}
