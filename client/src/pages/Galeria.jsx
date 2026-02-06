import "../galeria.css";
import saborConTradicion from "../assets/saborConTradicion.png";
import saborConTradicion2 from "../assets/saborConTradicion2.png";
import quesoAceitunasJamon from "../assets/quesoAceitunasJamon.png";
import TostasdaJamon from "../assets/TostasdaJamon.png";
import CasaFundada from "../assets/CasaFundada.png";
import mesa1 from "../assets/mesa1.png";
import mesa2 from "../assets/mesa2.png";
import salon from "../assets/salon.png";
import abanico2 from "../assets/abanico2.png";
import chimenea1 from "../assets/chimenea1.png";
import chimenea2 from "../assets/chimenea2.png";
import Navbar from "../components/Navbar.jsx";
import FooterSmall from "../components/FooterSmall.jsx";

export default function Galeria() {
  return (
    <div className="galeria-page">
      <Navbar active="galeria" />

      <main className="galeria-main">
        <div className="galeria-left">
          <img src={saborConTradicion} alt="Sabor con tradicion" />
        </div>

        <section className="galeria-grid">
          <img src={quesoAceitunasJamon} alt="Tabla de quesos, aceitunas y jamon" />
          <img src={chimenea1} alt="Mesa con brasas y tapas" />
          <img src={abanico2} alt="Tabla de jamon" />
          <img src={salon} alt="Salon del bar" />
          <img src={mesa1} alt="Mesa preparada" />
          <img src={mesa2} alt="Mesa lista para servir" />
        </section>

        <div className="galeria-right">
          <img src={saborConTradicion2} alt="Sabor con tradicion en plato" />
        </div>

        <div className="galeria-bottom">
          <img src={chimenea2} alt="Picoteo y vino" />
          <img src={CasaFundada} alt="Casa fundada Bar Corona" />
          <img src={TostasdaJamon} alt="Tostadas con jamon" />
        </div>
      </main>

      <FooterSmall />
    </div>
  );
}
