import { useEffect, useState } from "react";
import "../App.css";
import { cerveza, mapa as mapaImg, portada, sol } from "../constants/cloudinaryAssets.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { fallbackEvents } from "../constants/eventsFallback.js";
import { getEvents } from "../services/events.service.js";

const getHomeIcon = (card, index) => {
  const custom = card.imageUrl?.trim();
  if (custom) return custom;
  return index % 2 === 0 ? cerveza : sol;
};

export default function Home() {
  const [eventsData, setEventsData] = useState(fallbackEvents);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await getEvents();
        if (data) {
          setEventsData(data);
        }
      } catch {
        // Keep local fallback if API is not reachable.
      }
    };

    loadEvents();
  }, []);

  return (
    <div className="page">
      <Navbar active="inicio" />

      <section className="hero" id="inicio">
        <div className="hero-media">
          <img className="hero-photo" src={portada} alt="Fachada de Bar Corona" />
        </div>
        <aside className="events" id="eventos">
          <h2>{eventsData.homeTitle}</h2>
          {eventsData.homeCards.map((card, index) => (
            <div className="event-card" key={card.id}>
              <div className="event-icon" aria-hidden="true">
                <img src={getHomeIcon(card, index)} alt="" />
              </div>
              <div>
                <h3>{card.title}</h3>
                <p>{card.schedule}</p>
                <p className="event-note">{card.note}</p>
              </div>
            </div>
          ))}
        </aside>
      </section>

      <section className="info-strip">
        <div className="hours">
          <h3>Horarios:</h3>
          <p>Lunes a sábado: 8:00 am - 5:00 pm</p>
          <p>Domingo: 8:00 am - 12:00 pm</p>
        </div>
        <div className="map-card">
          <a
            href="https://share.google/fyJ2NpJ85uG2Vk8NH"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={mapaImg} alt="Mapa de ubicación de Bar Corona" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
