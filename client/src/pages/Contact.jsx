import { useEffect, useState } from "react";
import "../App.css";
import "../opiniones.css";
import { mesaChimenea } from "../constants/cloudinaryAssets.js";
import Navbar from "../components/Navbar.jsx";
import FooterSmall from "../components/FooterSmall.jsx";
import ImageStack from "../components/ImageStack.jsx";
import FormFeedback from "../components/FormFeedback.jsx";
import { createReview, getApprovedReviews } from "../services/reviews.service.js";

export default function Contact() {
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const loadReviews = async () => {
    try {
      const data = await getApprovedReviews();
      setReviews(data);
    } catch (err) {
      setError(err.message || "No se pudieron cargar las opiniones.");
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleAddReview = async (event) => {
    event.preventDefault();
    setError("");
    setStatus("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const comment = String(formData.get("comment") || "").trim();
    const rating = Number(formData.get("rating") || 5);

    try {
      await createReview({ name, comment, rating });
      setStatus("Opinion enviada. Queda pendiente de moderacion.");
      form.reset();
    } catch (err) {
      setError(err.message || "No se pudo enviar la opinion.");
    }
  };

  return (
    <div className="opiniones-page">
      <Navbar active="opiniones" />

      <main className="opiniones-main" id="opiniones">
        <section className="opinions-panel">
          <header className="opinions-header">
            <h2>Opiniones reales</h2>
            <p>
              Comparte tu experiencia. Las opiniones pasan por moderacion antes
              de publicarse.
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
            <FormFeedback error={error} status={status} />
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
            {reviews.length === 0 && (
              <p className="review-meta">Aun no hay opiniones aprobadas.</p>
            )}
          </div>
        </section>

        <ImageStack
          as="aside"
          className="opinions-gallery"
          imageClassName="opinions-photo"
          images={[{ src: mesaChimenea, alt: "Mesa junto a chimenea" }]}
        />
      </main>

      <FooterSmall />
    </div>
  );
}

