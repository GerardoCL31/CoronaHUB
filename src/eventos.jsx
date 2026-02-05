import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./eventos.css";
import corazonSanValentin from "./assets/CorazonSanValetin.png";
import sanValentinSalon from "./assets/sanValentinSalon.png";
import navidadSalon from "./assets/navidadSalon.png";
import navidadSalon2 from "./assets/navidadSalon2.png";
import Navbar from "./components/Navbar.jsx";
import FooterSmall from "./components/FooterSmall.jsx";

function Eventos() {
  return (
    <div className="eventos-page">
      <Navbar active="eventos" cartaTarget="_self" />

      <main className="eventos-main">
        <section className="eventos-column">
          <div className="eventos-text">
            <h2>
              <span className="eventos-emoji">❤️</span> San Valentín — “Noche de
              Amor”
            </h2>
            <p>
              Una velada especial con música suave, tragos temáticos y ambiente
              romántico. Promos para parejas y sorpresas durante la noche. Ideal
              para disfrutar en pareja o con amigos.
            </p>
          </div>
          <div className="eventos-photos">
            <img src={corazonSanValentin} alt="Decoración romántica en Bar Corona" />
            <img src={sanValentinSalon} alt="Mesa especial de San Valentín" />
          </div>
        </section>

        <div className="eventos-divider" aria-hidden="true" />

        <section className="eventos-column">
          <div className="eventos-text">
            <h2>
              <span className="eventos-emoji">🎄</span> Comida Navideña
            </h2>
            <p>
              Mesa navideña elegante con mariscos, embutidos y entradas
              decoradas. Velas, copas y colores festivos crean un ambiente
              cálido y familiar. Ideal para una celebración especial.
            </p>
          </div>
          <div className="eventos-photos">
            <img src={navidadSalon} alt="Mesa navideña en Bar Corona" />
            <img src={navidadSalon2} alt="Cena festiva en Bar Corona" />
          </div>
        </section>
      </main>

      <FooterSmall />
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Eventos />
  </StrictMode>
);
