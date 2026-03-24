import { useEffect, useState } from "react";
import "../carta.css";
import { mesaComida } from "../constants/cloudinaryAssets.js";
import Navbar from "../components/Navbar.jsx";
import FooterSmall from "../components/FooterSmall.jsx";
import { getApiBaseUrl } from "../services/api.js";

const fallbackMenu = {
  banner: "Menú diario 9€ con bebida",
  days: [
    {
      id: "lunes",
      title: "Lunes",
      first: "Sopa de pollo / Macarrones",
      second: "Pollo plancha / Merluza",
      dessert: "Flan / Fruta",
    },
    {
      id: "martes",
      title: "Martes",
      first: "Ensaladilla / Arroz 3 delicias",
      second: "Lomo en salsa / Pescado frito",
      dessert: "Yogur / Fruta",
    },
    {
      id: "miercoles",
      title: "Miércoles",
      first: "Gazpacho / Pasta boloñesa",
      second: "Pechuga empanada / Bacalao",
      dessert: "Natillas / Fruta",
    },
    {
      id: "jueves",
      title: "Jueves",
      first: "Puré de verduras / Ensalada campera",
      second: "Albóndigas / Calamares",
      dessert: "Flan / Yogur",
    },
    {
      id: "viernes",
      title: "Viernes",
      first: "Sopa marisco / Espaguetis",
      second: "Carne mechada / Merluza plancha",
      dessert: "Tarta / Fruta",
    },
    {
      id: "sabado",
      title: "Sábado",
      first: "Paella / Salmorejo",
      second: "Chuleta de cerdo / Pescado del día",
      dessert: "Natillas / Yogur",
    },
  ],
  combosTitle: "Platos combinados",
  combos: [
    "Huevos fritos + patatas + chorizo",
    "Pechuga plancha + ensalada",
    "Lomo + huevo + patatas",
    "Tortilla francesa + ensalada",
    "Hamburguesa + patatas",
  ],
};

export default function Carta() {
  const [menu, setMenu] = useState(fallbackMenu);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/menu`);
        const data = await response.json();
        if (response.ok && data?.ok && data?.data) {
          setMenu(data.data);
        }
      } catch {
        // Keep fallback menu if API is not reachable.
      }
    };

    loadMenu();
  }, []);

  return (
    <div className="carta-page">
      <Navbar active="carta" />

      <main className="carta-main" id="main-content" tabIndex={-1}>
        <div className="carta-banner">
          <span className="carta-banner-kicker">Mediodía</span>
          <strong>{menu.banner}</strong>
        </div>

        <div className="carta-content">
          <div className="carta-left">
            <section className="carta-grid">
              {menu.days.map((day) => (
                <article key={day.id} className="carta-card">
                  <span className="carta-pill-title">{day.title}</span>
                  <div className="carta-card-lines">
                    <div className="carta-line">
                      <span>Primero</span>
                      <p>{day.first}</p>
                    </div>
                    <div className="carta-line">
                      <span>Segundo</span>
                      <p>{day.second}</p>
                    </div>
                    <div className="carta-line">
                      <span>Postre</span>
                      <p>{day.dessert}</p>
                    </div>
                  </div>
                </article>
              ))}
              <article className="carta-card carta-combos">
                <span className="carta-pill-title">{menu.combosTitle}</span>
                <ul>
                  {menu.combos.map((combo, index) => (
                    <li key={`${combo}-${index}`}>{combo}</li>
                  ))}
                </ul>
              </article>
            </section>
          </div>

          <aside className="carta-photo">
            <img src={mesaComida} alt="Mesa preparada en Bar Corona" loading="lazy" decoding="async" />
          </aside>
        </div>
      </main>

      <FooterSmall />
    </div>
  );
}






