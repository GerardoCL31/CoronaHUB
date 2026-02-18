import "../galeria.css";
import {
  abanico2,
  CasaFundada,
  chimenea1,
  chimenea2,
  mesa1,
  mesa2,
  quesoAceitunasJamon,
  saborConTradicion,
  saborConTradicion2,
  salon,
  TostasdaJamon,
} from "../constants/cloudinaryAssets.js";
import Navbar from "../components/Navbar.jsx";
import FooterSmall from "../components/FooterSmall.jsx";

export default function Galeria() {
  return (
    <div className="galeria-page">
      <Navbar active="galeria" />

      <main className="galeria-main">
        <div className="galeria-left">
          <img src={saborConTradicion} alt="Sabor con tradición" />
        </div>

        <section className="galeria-grid">
          <img src={quesoAceitunasJamon} alt="Tabla de quesos, aceitunas y jamón" />
          <img src={chimenea1} alt="Mesa con brasas y tapas" />
          <img src={abanico2} alt="Tabla de jamón" />
          <img src={salon} alt="Salón del bar" />
          <img src={mesa1} alt="Mesa preparada" />
          <img src={mesa2} alt="Mesa lista para servir" />
        </section>

        <div className="galeria-right">
          <img src={saborConTradicion2} alt="Sabor con tradición en plato" />
        </div>

        <div className="galeria-bottom">
          <img src={chimenea2} alt="Picoteo y vino" />
          <img src={CasaFundada} alt="Casa fundada Bar Corona" />
          <img src={TostasdaJamon} alt="Tostadas con jamón" />
        </div>
      </main>

      <FooterSmall />
    </div>
  );
}
