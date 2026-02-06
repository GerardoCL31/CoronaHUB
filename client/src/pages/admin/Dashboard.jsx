import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { adminGetReviews, adminUpdateReview } from "../../services/reviews.service.js";
import {
  adminGetReservations,
  adminUpdateReservation,
} from "../../services/reservations.service.js";
import { logout } from "../../services/auth.service.js";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");

  const loadAll = async () => {
    setError("");
    try {
      const [reviewData, reservationData] = await Promise.all([
        adminGetReviews(),
        adminGetReservations(),
      ]);
      setReviews(reviewData);
      setReservations(reservationData);
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
      </main>
    </>
  );
}
