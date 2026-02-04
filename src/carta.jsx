import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./carta.css";
import mesaComida from "./assets/mesaComida.png";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

function Carta() {
  return (
    <div className="carta-page">
      <Navbar active="carta" cartaTarget="_self" />

      <main className="carta-main">
        <section className="carta-grid">
          <article className="carta-card">
            <span className="carta-pill-title">Lunes</span>
            <p>1°: Sopa de pollo / Macarrones</p>
            <p>2°: Pollo plancha / Merluza</p>
            <p>Postre: Flan / Fruta</p>
          </article>
          <article className="carta-card">
            <span className="carta-pill-title">Martes</span>
            <p>1°: Ensaladilla / Arroz 3 delicias</p>
            <p>2°: Lomo en salsa / Pescado frito</p>
            <p>Postre: Yogur / Fruta</p>
          </article>
          <article className="carta-card">
            <span className="carta-pill-title">Miercoles</span>
            <p>1°: Gazpacho / Pasta boloñesa</p>
            <p>2°: Pechuga empanada / Bacalao</p>
            <p>Postre: Natillas / Fruta</p>
          </article>
          <article className="carta-card">
            <span className="carta-pill-title">Jueves</span>
            <p>1°: Puré verduras / Ensalada campera</p>
            <p>2°: Albóndigas / Calamares</p>
            <p>Postre: Flan / Yogur</p>
          </article>
          <article className="carta-card">
            <span className="carta-pill-title">Viernes</span>
            <p>1°: Sopa marisco / Espaguetis</p>
            <p>2°: Carne mechada / Merluza plancha</p>
            <p>Postre: Tarta / Fruta</p>
          </article>
          <article className="carta-card">
            <span className="carta-pill-title">Sabado</span>
            <p>1°: Paella / Salmorejo</p>
            <p>2°: Chuleta cerdo / Pescado del dia</p>
            <p>Postre: Natillas / Yogur</p>
          </article>
          <article className="carta-card carta-combos">
            <span className="carta-pill-title">Platos combinados</span>
            <ul>
              <li>Huevos fritos + patatas + chorizo</li>
              <li>Pechuga plancha + ensalada</li>
              <li>Lomo + huevo + patatas</li>
              <li>Tortilla francesa + ensalada</li>
              <li>Hamburguesa + patatas</li>
            </ul>
          </article>
        </section>

        <aside className="carta-photo">
          <img src={mesaComida} alt="Mesa preparada en Bar Corona" />
        </aside>
      </main>

      <Footer />
    </div>
  );
}

export default Carta;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Carta />
  </StrictMode>
);
