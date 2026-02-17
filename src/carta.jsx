import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./carta.css";
import mesaComida from "./assets/mesaComida.png";
import Navbar from "./components/Navbar.jsx";
import FooterSmall from "./components/FooterSmall.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const fallbackMenu = {
  banner: "Menu diario 9€ con bebida",
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
      title: "Miercoles",
      first: "Gazpacho / Pasta bolonesa",
      second: "Pechuga empanada / Bacalao",
      dessert: "Natillas / Fruta",
    },
    {
      id: "jueves",
      title: "Jueves",
      first: "Pure verduras / Ensalada campera",
      second: "Albondigas / Calamares",
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
      title: "Sabado",
      first: "Paella / Salmorejo",
      second: "Chuleta cerdo / Pescado del dia",
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

function Carta() {
  const [menu, setMenu] = useState(fallbackMenu);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const response = await fetch(`${API_URL}/api/menu`);
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
      <Navbar active="carta" cartaTarget="_self" />

      <main className="carta-main">
        <div className="carta-left">
          <div className="carta-banner">
            <span>{menu.banner}</span>
          </div>
          <section className="carta-grid">
            {menu.days.map((day) => (
              <article key={day.id} className="carta-card">
                <span className="carta-pill-title">{day.title}</span>
                <p>1o: {day.first}</p>
                <p>2o: {day.second}</p>
                <p>Postre: {day.dessert}</p>
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
          <img src={mesaComida} alt="Mesa preparada en Bar Corona" />
        </aside>
      </main>

      <FooterSmall />
    </div>
  );
}

export default Carta;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Carta />
  </StrictMode>
);
