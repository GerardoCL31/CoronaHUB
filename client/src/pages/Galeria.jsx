import { useEffect, useMemo, useState } from "react";
import "../galeria.css";
import Navbar from "../components/Navbar.jsx";
import FooterSmall from "../components/FooterSmall.jsx";
import { fallbackEvents, resolveGalleryImage } from "../constants/eventsFallback.js";
import { getEvents } from "../services/events.service.js";

const getGalleryMap = (eventsData) => {
  const items = Array.isArray(eventsData?.gallery) ? eventsData.gallery : [];
  return new Map(items.map((item) => [item.id, item]));
};

export default function Galeria() {
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

  const gallery = useMemo(() => getGalleryMap(eventsData), [eventsData]);

  const photo = (id) => {
    const item = gallery.get(id) || { id, imageUrl: "", imageAlt: "Foto" };
    return {
      src: resolveGalleryImage(item),
      alt: item.imageAlt,
    };
  };

  return (
    <div className="galeria-page">
      <Navbar active="galeria" />

      <main className="galeria-main" id="main-content" tabIndex={-1}>
        <div className="galeria-left">
          <img src={photo("gallery-left").src} alt={photo("gallery-left").alt} loading="lazy" decoding="async" />
        </div>

        <section className="galeria-grid">
          <img src={photo("gallery-grid-1").src} alt={photo("gallery-grid-1").alt} loading="lazy" decoding="async" />
          <img src={photo("gallery-grid-2").src} alt={photo("gallery-grid-2").alt} loading="lazy" decoding="async" />
          <img src={photo("gallery-grid-3").src} alt={photo("gallery-grid-3").alt} loading="lazy" decoding="async" />
          <img src={photo("gallery-grid-4").src} alt={photo("gallery-grid-4").alt} loading="lazy" decoding="async" />
          <img src={photo("gallery-grid-5").src} alt={photo("gallery-grid-5").alt} loading="lazy" decoding="async" />
          <img src={photo("gallery-grid-6").src} alt={photo("gallery-grid-6").alt} loading="lazy" decoding="async" />
        </section>

        <div className="galeria-right">
          <img src={photo("gallery-right").src} alt={photo("gallery-right").alt} loading="lazy" decoding="async" />
        </div>

        <div className="galeria-bottom">
          <img src={photo("gallery-bottom-1").src} alt={photo("gallery-bottom-1").alt} loading="lazy" decoding="async" />
          <img src={photo("gallery-bottom-2").src} alt={photo("gallery-bottom-2").alt} loading="lazy" decoding="async" />
          <img src={photo("gallery-bottom-3").src} alt={photo("gallery-bottom-3").alt} loading="lazy" decoding="async" />
        </div>
      </main>

      <FooterSmall />
    </div>
  );
}


