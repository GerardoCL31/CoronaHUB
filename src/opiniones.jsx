import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import "./opiniones.css";
import mesaComida from "./assets/mesaComida.png";
import chimenea1 from "./assets/chimenea1.png";
import salon from "./assets/salon.png";
import Navbar from "./components/Navbar.jsx";
import FooterSmall from "./components/FooterSmall.jsx";

const defaultReviews = [
  {
    id: "seed-1",
    name: "Ana M.",
    rating: 5,
    comment:
      "Excelente sitio para desayunar. El cafe esta buenisimo y las tostadas salen siempre perfectas. El ambiente es tranquilo y el personal muy amable. Ideal para empezar el dia con buen rollo.",
    createdAt: "2026-02-01T09:00:00.000Z",
  },
  {
    id: "seed-2",
    name: "Carlos R.",
    rating: 4,
    comment:
      "Un bar de barrio de los que ya casi no quedan. Trato cercano, buena comida y precios muy razonables. La terraza es amplia y comoda, perfecta para tomar algo al sol. Muy recomendado.",
    createdAt: "2026-01-27T12:30:00.000Z",
  },
  {
    id: "seed-3",
    name: "Lucia P.",
    rating: 5,
    comment:
      "Comimos el menu del dia y estaba espectacular: casero, abundante y con muy buen sabor. El servicio fue rapido y atento. Sin duda volveremos, merece la pena.",
    createdAt: "2026-01-18T14:10:00.000Z",
  },
];

const storageKey = "barcorona_opiniones";

function Opiniones() {
  const [reviews, setReviews] = useState(() => {
    if (typeof window === "undefined") {
      return defaultReviews;
    }
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) {
      return defaultReviews;
    }
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultReviews;
    } catch (error) {
      return defaultReviews;
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, JSON.stringify(reviews));
    }
  }, [reviews]);

  const handleAddReview = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const comment = String(formData.get("comment") || "").trim();
    const rating = Number(formData.get("rating") || 5);

    if (!name || !comment) {
      return;
    }

    const newReview = {
      id: `review-${Date.now()}`,
      name,
      rating: Number.isFinite(rating) ? rating : 5,
      comment,
      createdAt: new Date().toISOString(),
    };

    setReviews((prev) => [newReview, ...prev]);
    form.reset();
  };

  return (
    <div className="opiniones-page">
      <Navbar active="opiniones" cartaTarget="_blank" />

      <main className="opiniones-main" id="opiniones">
        <section className="opinions-panel">
          <header className="opinions-header">
            <h2>Opiniones reales</h2>
            <p>
              Comparte tu experiencia. Tu comentario queda guardado en este
              navegador incluso si reinicias el servidor.
            </p>
          </header>

          <form className="review-form" onSubmit={handleAddReview}>
            <label className="review-field">
              Nombre
              <input name="name" type="text" placeholder="Tu nombre" required />
            </label>
            <fieldset className="review-field review-field--stars">
              <legend>Puntuacion</legend>
              <div className="star-rating" role="radiogroup" aria-label="Puntuacion">
                <input type="radio" id="star-5" name="rating" value="5" defaultChecked />
                <label htmlFor="star-5" title="5 estrellas" aria-label="5 estrellas" />

                <input type="radio" id="star-4" name="rating" value="4" />
                <label htmlFor="star-4" title="4 estrellas" aria-label="4 estrellas" />

                <input type="radio" id="star-3" name="rating" value="3" />
                <label htmlFor="star-3" title="3 estrellas" aria-label="3 estrellas" />

                <input type="radio" id="star-2" name="rating" value="2" />
                <label htmlFor="star-2" title="2 estrellas" aria-label="2 estrellas" />

                <input type="radio" id="star-1" name="rating" value="1" />
                <label htmlFor="star-1" title="1 estrella" aria-label="1 estrella" />
              </div>
            </fieldset>
            <label className="review-field review-field--full">
              Comentario
              <textarea
                name="comment"
                rows="3"
                placeholder="Escribe tu opinion..."
                required
              />
            </label>
            <button className="review-submit" type="submit">
              Enviar opinion
            </button>
          </form>

          <div className="opinions-list">
            {reviews.map((review) => (
              <article className="review-card" key={review.id}>
                <div className="review-stars" aria-label={`${review.rating} estrellas`}>
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <span key={index}>&#9733;</span>
                  ))}
                </div>
                <p className="review-text">"{review.comment}"</p>
                <p className="review-meta">- {review.name}</p>
              </article>
            ))}
          </div>
        </section>

        <aside className="opinions-gallery">
          <img className="opinions-photo" src={mesaComida} alt="Tabla y desayuno" />
        </aside>
      </main>

      <FooterSmall />
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Opiniones />
  </StrictMode>
);
