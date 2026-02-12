import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { adminGetReviews, adminUpdateReview } from "../../services/reviews.service.js";
import {
  adminGetReservations,
  adminUpdateReservation,
} from "../../services/reservations.service.js";
import { adminGetMenu, adminUpdateMenu } from "../../services/menu.service.js";
import { logout } from "../../services/auth.service.js";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [menu, setMenu] = useState(null);
  const [error, setError] = useState("");
  const [menuState, setMenuState] = useState({ saving: false, message: "" });

  const loadAll = async () => {
    setError("");
    try {
      const [reviewData, reservationData, menuData] = await Promise.all([
        adminGetReviews(),
        adminGetReservations(),
        adminGetMenu(),
      ]);
      setReviews(reviewData);
      setReservations(reservationData);
      setMenu(menuData);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const updateReview = async (id, status) => {
    try {
      await adminUpdateReview(id, status);
      loadAll();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateReservation = async (id, status) => {
    try {
      await adminUpdateReservation(id, status);
      loadAll();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateMenuField = (field, value) => {
    setMenu((prev) => ({ ...prev, [field]: value }));
  };

  const updateDay = (dayId, field, value) => {
    setMenu((prev) => ({
      ...prev,
      days: prev.days.map((day) =>
        day.id === dayId
          ? {
              ...day,
              [field]: value,
            }
          : day
      ),
    }));
  };

  const updateCombos = (rawValue) => {
    const combos = rawValue
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
    setMenu((prev) => ({ ...prev, combos }));
  };

  const saveMenu = async () => {
    if (!menu) return;
    setMenuState({ saving: true, message: "" });
    try {
      await adminUpdateMenu(menu);
      setMenuState({ saving: false, message: "Carta guardada." });
    } catch (err) {
      setMenuState({ saving: false, message: err.message });
    }
  };

  const pendingReviews = reviews.filter((item) => item.status === "PENDING");
  const pendingReservations = reservations.filter((item) => item.status === "PENDING");

  return (
    <>
      <header className="admin-header">
        <strong>CoronaHUB Admin</strong>
        <nav>
          <Link to="/">Home</Link>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </header>
      <main className="admin-main">
        {error && <p className="error">{error}</p>}

        <section className="card admin-card">
          <h2>Opiniones pendientes</h2>
          <div className="list admin-list">
            {pendingReviews.map((review) => (
              <div key={review.id} className="card admin-item">
                <strong>{review.name}</strong>
                <span className="badge">{review.rating} / 5</span>
                <p>{review.comment}</p>
                <div className="actions">
                  <button onClick={() => updateReview(review.id, "APPROVED")}>
                    Aprobar
                  </button>
                  <button onClick={() => updateReview(review.id, "REJECTED")}>
                    Rechazar
                  </button>
                </div>
              </div>
            ))}
            {pendingReviews.length === 0 && <p>No hay pendientes.</p>}
          </div>
        </section>

        <section className="card admin-card" style={{ marginTop: 16 }}>
          <h2>Reservas pendientes</h2>
          <div className="list admin-list">
            {pendingReservations.map((reserva) => (
              <div key={reserva.id} className="card admin-item">
                <strong>{reserva.name}</strong>
                <p>
                  {reserva.date} {reserva.time} · {reserva.people} personas
                </p>
                <p>{reserva.email}</p>
                {reserva.phone && <p>Telefono: {reserva.phone}</p>}
                <div className="actions">
                  <button onClick={() => updateReservation(reserva.id, "CONFIRMED")}>
                    Confirmar
                  </button>
                  <button onClick={() => updateReservation(reserva.id, "CANCELLED")}>
                    Cancelar
                  </button>
                </div>
              </div>
            ))}
            {pendingReservations.length === 0 && <p>No hay pendientes.</p>}
          </div>
        </section>

        <section className="card admin-card" style={{ marginTop: 16 }}>
          <h2>Editar carta</h2>
          {!menu && <p>Cargando carta...</p>}
          {menu && (
            <div className="admin-menu-editor">
              <label className="admin-field">
                <span>Banner</span>
                <input
                  type="text"
                  value={menu.banner}
                  onChange={(event) => updateMenuField("banner", event.target.value)}
                />
              </label>

              <div className="admin-menu-grid">
                {menu.days.map((day) => (
                  <article key={day.id} className="admin-menu-day">
                    <h3>{day.title}</h3>
                    <label className="admin-field">
                      <span>Primer plato</span>
                      <input
                        type="text"
                        value={day.first}
                        onChange={(event) =>
                          updateDay(day.id, "first", event.target.value)
                        }
                      />
                    </label>
                    <label className="admin-field">
                      <span>Segundo plato</span>
                      <input
                        type="text"
                        value={day.second}
                        onChange={(event) =>
                          updateDay(day.id, "second", event.target.value)
                        }
                      />
                    </label>
                    <label className="admin-field">
                      <span>Postre</span>
                      <input
                        type="text"
                        value={day.dessert}
                        onChange={(event) =>
                          updateDay(day.id, "dessert", event.target.value)
                        }
                      />
                    </label>
                  </article>
                ))}
              </div>

              <label className="admin-field">
                <span>Titulo platos combinados</span>
                <input
                  type="text"
                  value={menu.combosTitle}
                  onChange={(event) =>
                    updateMenuField("combosTitle", event.target.value)
                  }
                />
              </label>

              <label className="admin-field">
                <span>Platos combinados (uno por linea)</span>
                <textarea
                  rows={6}
                  value={menu.combos.join("\n")}
                  onChange={(event) => updateCombos(event.target.value)}
                />
              </label>

              <div className="actions">
                <button type="button" onClick={saveMenu} disabled={menuState.saving}>
                  {menuState.saving ? "Guardando..." : "Guardar carta"}
                </button>
              </div>
              {menuState.message && <p>{menuState.message}</p>}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
