import "../eventos.css";
import corazonSanValentin from "../assets/CorazonSanValetin.png";
import sanValentinSalon from "../assets/sanValentinSalon.png";
import navidadSalon from "../assets/navidadSalon.png";
import navidadSalon2 from "../assets/navidadSalon2.png";
import Navbar from "../components/Navbar.jsx";
import FooterSmall from "../components/FooterSmall.jsx";
import ImageStack from "../components/ImageStack.jsx";

export default function Eventos() {
  return (
    <div className="eventos-page">
      <Navbar active="eventos" />

      <main className="eventos-main">
        <section className="eventos-column">
          <div className="eventos-text">
            <h2>San Valentin - Noche de Amor</h2>
            <p>
              Una velada especial con musica suave, tragos tematicos y ambiente
              romantico. Promos para parejas y sorpresas durante la noche. Ideal
              para disfrutar en pareja o con amigos.
            </p>
          </div>
          <ImageStack
            className="eventos-photos"
            images={[
              { src: corazonSanValentin, alt: "Decoracion romantica en Bar Corona" },
              { src: sanValentinSalon, alt: "Mesa especial de San Valentin" },
            ]}
          />
        </section>

        <div className="eventos-divider" aria-hidden="true" />

        <section className="eventos-column">
          <div className="eventos-text">
            <h2>Comida Navidena</h2>
            <p>
              Mesa navidena elegante con mariscos, embutidos y entradas
              decoradas. Velas, copas y colores festivos crean un ambiente
              calido y familiar. Ideal para una celebracion especial.
            </p>
          </div>
          <ImageStack
            className="eventos-photos"
            images={[
              { src: navidadSalon, alt: "Mesa navidena en Bar Corona" },
              { src: navidadSalon2, alt: "Cena festiva en Bar Corona" },
            ]}
          />
        </section>
      </main>

      <FooterSmall />
    </div>
  );
}
