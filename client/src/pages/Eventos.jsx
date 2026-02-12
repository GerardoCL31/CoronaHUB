import { Fragment, useEffect, useState } from "react";
import "../eventos.css";
import Navbar from "../components/Navbar.jsx";
import FooterSmall from "../components/FooterSmall.jsx";
import ImageStack from "../components/ImageStack.jsx";
import { fallbackEvents, resolveEventImage } from "../constants/eventsFallback.js";
import { getEvents } from "../services/events.service.js";

export default function Eventos() {
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
    <div className="eventos-page">
      <Navbar active="eventos" />

      <main className="eventos-main">
        {eventsData.pageItems.map((item, index) => (
          <Fragment key={item.id}>
            <section className="eventos-column">
              <div className="eventos-text">
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </div>
              <ImageStack
                className="eventos-photos"
                images={item.photos.map((photo) => ({
                  src: resolveEventImage(photo),
                  alt: photo.imageAlt,
                }))}
              />
            </section>
            {index < eventsData.pageItems.length - 1 && (
              <div className="eventos-divider" aria-hidden="true" />
            )}
          </Fragment>
        ))}
      </main>

      <FooterSmall />
    </div>
  );
}
