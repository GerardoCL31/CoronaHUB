import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { adminGetReviews, adminUpdateReview } from "../../services/reviews.service.js";
import {
  adminGetReservations,
  adminUpdateReservation,
} from "../../services/reservations.service.js";
import { adminGetMenu, adminUpdateMenu } from "../../services/menu.service.js";
import { adminGetEvents, adminUpdateEvents } from "../../services/events.service.js";
import { logout } from "../../services/auth.service.js";
import { cerveza, sol } from "../../constants/cloudinaryAssets.js";
import { resolveEventImage, resolveGalleryImage } from "../../constants/eventsFallback.js";

const toTimestamp = (item) => new Date(`${item.date}T${item.time}:00`).getTime();

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [menu, setMenu] = useState(null);
  const [events, setEvents] = useState(null);
  const [error, setError] = useState("");
  const [menuState, setMenuState] = useState({ saving: false, message: "" });
  const [eventsState, setEventsState] = useState({ saving: false, message: "" });
  const [activeTab, setActiveTab] = useState("web");
  const [activeWebTab, setActiveWebTab] = useState("inicio");

  const loadAll = async () => {
    setError("");
    try {
      const [reviewData, reservationData, menuData, eventsData] = await Promise.all([
        adminGetReviews(),
        adminGetReservations(),
        adminGetMenu(),
        adminGetEvents(),
      ]);
      setReviews(reviewData);
      setReservations(reservationData);
      setMenu(menuData);
      setEvents(eventsData);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const pendingReviews = useMemo(
    () => reviews.filter((item) => item.status === "PENDING"),
    [reviews]
  );

  const pendingReservations = useMemo(
    () => reservations.filter((item) => item.status === "PENDING"),
    [reservations]
  );

  const confirmedReservations = useMemo(
    () => reservations.filter((item) => item.status === "CONFIRMED"),
    [reservations]
  );

  const upcomingReservations = useMemo(() => {
    const now = Date.now();
    return reservations
      .filter(
        (item) =>
          item.status === "CONFIRMED" &&
          Number.isFinite(toTimestamp(item)) &&
          toTimestamp(item) >= now
      )
      .sort((a, b) => toTimestamp(a) - toTimestamp(b));
  }, [reservations]);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const updateReview = async (id, status) => {
    try {
      await adminUpdateReview(id, status);
      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateReservation = async (id, status) => {
    try {
      await adminUpdateReservation(id, status);
      await loadAll();
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

  const updateEventsField = (field, value) => {
    setEvents((prev) => ({ ...prev, [field]: value }));
  };

  const updateHomeCard = (cardId, field, value) => {
    setEvents((prev) => ({
      ...prev,
      homeCards: prev.homeCards.map((card) =>
        card.id === cardId
          ? {
              ...card,
              [field]: value,
            }
          : card
      ),
    }));
  };

  const updatePageItem = (itemId, field, value) => {
    setEvents((prev) => ({
      ...prev,
      pageItems: prev.pageItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              [field]: value,
            }
          : item
      ),
    }));
  };

  const updatePhoto = (itemId, photoId, field, value) => {
    setEvents((prev) => ({
      ...prev,
      pageItems: prev.pageItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              photos: item.photos.map((photo) =>
                photo.id === photoId
                  ? {
                      ...photo,
                      [field]: value,
                    }
                  : photo
              ),
            }
          : item
      ),
    }));
  };

  const updateGalleryPhoto = (photoId, field, value) => {
    setEvents((prev) => ({
      ...prev,
      gallery: (prev.gallery || []).map((photo) =>
        photo.id === photoId
          ? {
              ...photo,
              [field]: value,
            }
          : photo
      ),
    }));
  };

  const pasteFromClipboard = async (onValue) => {
    try {
      const text = await navigator.clipboard.readText();
      onValue(text);
    } catch {
      setEventsState({
        saving: false,
        message: "No se pudo leer el portapapeles. Pega manualmente.",
      });
    }
  };

  const saveEvents = async () => {
    if (!events) return;
    setEventsState({ saving: true, message: "" });
    try {
      await adminUpdateEvents(events);
      setEventsState({ saving: false, message: "Eventos guardados." });
    } catch (err) {
      setEventsState({ saving: false, message: err.message });
    }
  };

  const renderReviews = () => (
    <section className="card admin-card admin-section">
      <div className="admin-section-head">
        <h2>Opiniones pendientes</h2>
        <span>{pendingReviews.length}</span>
      </div>
      <div className="list admin-list">
        {pendingReviews.map((review) => (
          <div key={review.id} className="card admin-item">
            <strong>{review.name}</strong>
            <span className="badge">{review.rating} / 5</span>
            <p>{review.comment}</p>
            <div className="actions">
              <button onClick={() => updateReview(review.id, "APPROVED")}>Aprobar</button>
              <button onClick={() => updateReview(review.id, "REJECTED")}>Rechazar</button>
            </div>
          </div>
        ))}
        {pendingReviews.length === 0 && <p>No hay pendientes.</p>}
      </div>
    </section>
  );

  const renderReservations = () => (
    <>
      <section className="card admin-card admin-section">
        <div className="admin-section-head">
          <h2>Reservas pendientes</h2>
          <span>{pendingReservations.length}</span>
        </div>
        <div className="list admin-list">
          {pendingReservations.map((reserva) => (
            <div key={reserva.id} className="card admin-item">
              <strong>{reserva.name}</strong>
              <p>
                {reserva.date} {reserva.time} · {reserva.people} personas
              </p>
              <p>{reserva.email}</p>
              {reserva.tableId && <p>Mesa: {reserva.tableId}</p>}
              {reserva.phone && <p>Teléfono: {reserva.phone}</p>}
              {reserva.notes && <p>Alergias / notas: {reserva.notes}</p>}
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

      <section className="card admin-card admin-section">
        <div className="admin-section-head">
          <h2>Próximas reservas</h2>
          <span>{upcomingReservations.length}</span>
        </div>
        <div className="list admin-list">
          {upcomingReservations.map((reserva) => (
            <div key={reserva.id} className="card admin-item">
              <strong>{reserva.name}</strong>
              <div className="admin-details-grid">
                <p>
                  <span>Fecha:</span> {reserva.date}
                </p>
                <p>
                  <span>Hora:</span> {reserva.time}
                </p>
                <p>
                  <span>Mesa:</span> {reserva.tableId || "-"}
                </p>
                <p>
                  <span>Personas:</span> {reserva.people}
                </p>
                <p>
                  <span>Email:</span> {reserva.email}
                </p>
                <p>
                  <span>Teléfono:</span> {reserva.phone || "-"}
                </p>
                <p>
                  <span>Estado:</span> {reserva.status}
                </p>
                <p>
                  <span>ID:</span> {reserva.id}
                </p>
              </div>
              <p>
                <span>Notas / alergias:</span> {reserva.notes || "-"}
              </p>
              <div className="actions">
                <button onClick={() => updateReservation(reserva.id, "CONFIRMED")}>Confirmar</button>
                <button onClick={() => updateReservation(reserva.id, "CANCELLED")}>Cancelar</button>
              </div>
            </div>
          ))}
          {upcomingReservations.length === 0 && <p>No hay reservas próximas.</p>}
        </div>
      </section>
    </>
  );

  const renderHomeEditor = () => {
    if (!events) return <p>Cargando contenido...</p>;

    return (
      <section className="card admin-card admin-section">
        <div className="admin-section-head">
          <h2>Página inicio</h2>
        </div>

        <div className="admin-menu-editor">
          <label className="admin-field">
            <span>Título sección eventos (home)</span>
            <input
              type="text"
              value={events.homeTitle}
              onChange={(event) => updateEventsField("homeTitle", event.target.value)}
            />
          </label>

          <div className="admin-menu-grid">
            {events.homeCards.map((card) => (
              <article key={card.id} className="admin-menu-day">
                <h3>{card.id}</h3>
                <label className="admin-field">
                  <span>Título</span>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(event) => updateHomeCard(card.id, "title", event.target.value)}
                  />
                </label>
                <label className="admin-field">
                  <span>Horario</span>
                  <input
                    type="text"
                    value={card.schedule}
                    onChange={(event) => updateHomeCard(card.id, "schedule", event.target.value)}
                  />
                </label>
                <label className="admin-field">
                  <span>Descripción corta</span>
                  <textarea
                    rows={3}
                    value={card.note}
                    onChange={(event) => updateHomeCard(card.id, "note", event.target.value)}
                  />
                </label>
                <label className="admin-field">
                  <span>URL icono (opcional)</span>
                  <div className="admin-inline-input">
                    <input
                      type="url"
                      value={card.imageUrl}
                      onChange={(event) => updateHomeCard(card.id, "imageUrl", event.target.value)}
                      placeholder="https://..."
                    />
                    <button
                      type="button"
                      onClick={() =>
                        pasteFromClipboard((value) => updateHomeCard(card.id, "imageUrl", value))
                      }
                    >
                      Pegar
                    </button>
                  </div>
                </label>
                <label className="admin-field">
                  <span>Texto alternativo</span>
                  <input
                    type="text"
                    value={card.imageAlt}
                    onChange={(event) => updateHomeCard(card.id, "imageAlt", event.target.value)}
                  />
                </label>
              </article>
            ))}
          </div>

          <div className="actions">
            <button type="button" onClick={saveEvents} disabled={eventsState.saving}>
              {eventsState.saving ? "Guardando..." : "Guardar inicio"}
            </button>
          </div>
          {eventsState.message && <p>{eventsState.message}</p>}
        </div>
      </section>
    );
  };

  const renderMenuEditor = () => {
    if (!menu) return <p>Cargando carta...</p>;

    return (
      <section className="card admin-card admin-section">
        <div className="admin-section-head">
          <h2>Página carta</h2>
        </div>

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
                    onChange={(event) => updateDay(day.id, "first", event.target.value)}
                  />
                </label>
                <label className="admin-field">
                  <span>Segundo plato</span>
                  <input
                    type="text"
                    value={day.second}
                    onChange={(event) => updateDay(day.id, "second", event.target.value)}
                  />
                </label>
                <label className="admin-field">
                  <span>Postre</span>
                  <input
                    type="text"
                    value={day.dessert}
                    onChange={(event) => updateDay(day.id, "dessert", event.target.value)}
                  />
                </label>
              </article>
            ))}
          </div>

          <label className="admin-field">
            <span>Título platos combinados</span>
            <input
              type="text"
              value={menu.combosTitle}
              onChange={(event) => updateMenuField("combosTitle", event.target.value)}
            />
          </label>

          <label className="admin-field">
            <span>Platos combinados (uno por línea)</span>
            <textarea rows={6} value={menu.combos.join("\n")} onChange={(event) => updateCombos(event.target.value)} />
          </label>

          <div className="actions">
            <button type="button" onClick={saveMenu} disabled={menuState.saving}>
              {menuState.saving ? "Guardando..." : "Guardar carta"}
            </button>
          </div>
          {menuState.message && <p>{menuState.message}</p>}
        </div>
      </section>
    );
  };

  const renderEventsEditor = () => {
    if (!events) return <p>Cargando eventos...</p>;

    return (
      <section className="card admin-card admin-section">
        <div className="admin-section-head">
          <h2>Página eventos</h2>
        </div>

        <div className="admin-menu-editor">
          <div className="admin-events-list">
            {events.pageItems.map((item) => (
              <article key={item.id} className="admin-events-item">
                <h3>{item.id}</h3>
                <label className="admin-field">
                  <span>Título bloque</span>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(event) => updatePageItem(item.id, "title", event.target.value)}
                  />
                </label>
                <label className="admin-field">
                  <span>Descripción</span>
                  <textarea
                    rows={4}
                    value={item.description}
                    onChange={(event) => updatePageItem(item.id, "description", event.target.value)}
                  />
                </label>

                <div className="admin-photo-grid">
                  {item.photos.map((photo) => (
                    <div key={photo.id} className="admin-menu-day">
                      <h3>{photo.id}</h3>
                      <label className="admin-field">
                        <span>URL imagen (opcional)</span>
                        <div className="admin-inline-input">
                          <input
                            type="url"
                            value={photo.imageUrl}
                            onChange={(event) =>
                              updatePhoto(item.id, photo.id, "imageUrl", event.target.value)
                            }
                            placeholder="https://..."
                          />
                          <button
                            type="button"
                            onClick={() =>
                              pasteFromClipboard((value) =>
                                updatePhoto(item.id, photo.id, "imageUrl", value)
                              )
                            }
                          >
                            Pegar
                          </button>
                        </div>
                      </label>
                      <label className="admin-field">
                        <span>Texto alternativo</span>
                        <input
                          type="text"
                          value={photo.imageAlt}
                          onChange={(event) =>
                            updatePhoto(item.id, photo.id, "imageAlt", event.target.value)
                          }
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="actions">
            <button type="button" onClick={saveEvents} disabled={eventsState.saving}>
              {eventsState.saving ? "Guardando..." : "Guardar eventos"}
            </button>
          </div>
          {eventsState.message && <p>{eventsState.message}</p>}
        </div>
      </section>
    );
  };

  const renderPhotosEditor = () => {
    if (!events) return <p>Cargando fotos...</p>;

    return (
      <section className="card admin-card admin-section">
        <div className="admin-section-head">
          <h2>Fotos</h2>
        </div>

        <p>
          Aquí puedes ver la imagen actual y cambiar el enlace por una nueva URL.
          Guarda al final para aplicar cambios.
        </p>

        <h3 className="admin-subtitle">Inicio</h3>
        <div className="admin-photo-editor-grid">
          {events.homeCards.map((card, index) => {
            const currentSrc = card.imageUrl?.trim() || (index % 2 === 0 ? cerveza : sol);
            return (
              <article key={card.id} className="admin-menu-day">
                <h3>{card.id}</h3>
                <img
                  className="admin-photo-preview"
                  src={currentSrc}
                  alt={card.imageAlt || `Foto ${card.id}`}
                />
                <label className="admin-field">
                  <span>URL nueva</span>
                  <div className="admin-inline-input">
                    <input
                      type="url"
                      value={card.imageUrl}
                      onChange={(event) => updateHomeCard(card.id, "imageUrl", event.target.value)}
                      placeholder="https://..."
                    />
                    <button
                      type="button"
                      onClick={() =>
                        pasteFromClipboard((value) => updateHomeCard(card.id, "imageUrl", value))
                      }
                    >
                      Pegar
                    </button>
                  </div>
                </label>
                <label className="admin-field">
                  <span>Texto alternativo</span>
                  <input
                    type="text"
                    value={card.imageAlt}
                    onChange={(event) => updateHomeCard(card.id, "imageAlt", event.target.value)}
                  />
                </label>
              </article>
            );
          })}
        </div>

        <h3 className="admin-subtitle">Eventos</h3>
        <div className="admin-photo-editor-grid">
          {events.pageItems.map((item) =>
            item.photos.map((photo) => (
              <article key={photo.id} className="admin-menu-day">
                <h3>
                  {item.id} - {photo.id}
                </h3>
                <img
                  className="admin-photo-preview"
                  src={resolveEventImage(photo)}
                  alt={photo.imageAlt || `Foto ${photo.id}`}
                />
                <label className="admin-field">
                  <span>URL nueva</span>
                  <div className="admin-inline-input">
                    <input
                      type="url"
                      value={photo.imageUrl}
                      onChange={(event) =>
                        updatePhoto(item.id, photo.id, "imageUrl", event.target.value)
                      }
                      placeholder="https://..."
                    />
                    <button
                      type="button"
                      onClick={() =>
                        pasteFromClipboard((value) =>
                          updatePhoto(item.id, photo.id, "imageUrl", value)
                        )
                      }
                    >
                      Pegar
                    </button>
                  </div>
                </label>
                <label className="admin-field">
                  <span>Texto alternativo</span>
                  <input
                    type="text"
                    value={photo.imageAlt}
                    onChange={(event) =>
                      updatePhoto(item.id, photo.id, "imageAlt", event.target.value)
                    }
                  />
                </label>
              </article>
            ))
          )}
        </div>

        <h3 className="admin-subtitle">Galería</h3>
        <div className="admin-photo-editor-grid">
          {(events.gallery || []).map((photo) => (
            <article key={photo.id} className="admin-menu-day">
              <h3>{photo.id}</h3>
              <img
                className="admin-photo-preview"
                src={resolveGalleryImage(photo)}
                alt={photo.imageAlt || `Foto ${photo.id}`}
              />
              <label className="admin-field">
                <span>URL nueva</span>
                <div className="admin-inline-input">
                  <input
                    type="url"
                    value={photo.imageUrl}
                    onChange={(event) =>
                      updateGalleryPhoto(photo.id, "imageUrl", event.target.value)
                    }
                    placeholder="https://..."
                  />
                  <button
                    type="button"
                    onClick={() =>
                      pasteFromClipboard((value) =>
                        updateGalleryPhoto(photo.id, "imageUrl", value)
                      )
                    }
                  >
                    Pegar
                  </button>
                </div>
              </label>
              <label className="admin-field">
                <span>Texto alternativo</span>
                <input
                  type="text"
                  value={photo.imageAlt}
                  onChange={(event) =>
                    updateGalleryPhoto(photo.id, "imageAlt", event.target.value)
                  }
                />
              </label>
            </article>
          ))}
        </div>

        <div className="actions">
          <button type="button" onClick={saveEvents} disabled={eventsState.saving}>
            {eventsState.saving ? "Guardando..." : "Guardar fotos"}
          </button>
        </div>
        {eventsState.message && <p>{eventsState.message}</p>}
      </section>
    );
  };

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

        <section className="admin-kpis">
          <article className="admin-kpi-card">
            <p>Pendientes de opiniones</p>
            <strong>{pendingReviews.length}</strong>
          </article>
          <article className="admin-kpi-card">
            <p>Reservas pendientes</p>
            <strong>{pendingReservations.length}</strong>
          </article>
          <article className="admin-kpi-card">
            <p>Reservas confirmadas</p>
            <strong>{confirmedReservations.length}</strong>
          </article>
          <article className="admin-kpi-card">
            <p>Próximas reservas</p>
            <strong>{upcomingReservations.length}</strong>
          </article>
        </section>

        <section className="admin-tabs" aria-label="Secciones admin">
          <button
            type="button"
            className={`admin-tab ${activeTab === "overview" ? "is-active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Resumen
          </button>
          <button
            type="button"
            className={`admin-tab ${activeTab === "reviews" ? "is-active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            Opiniones
            <span>{pendingReviews.length}</span>
          </button>
          <button
            type="button"
            className={`admin-tab ${activeTab === "reservations" ? "is-active" : ""}`}
            onClick={() => setActiveTab("reservations")}
          >
            Reservas
            <span>{pendingReservations.length}</span>
          </button>
          <button
            type="button"
            className={`admin-tab ${activeTab === "web" ? "is-active" : ""}`}
            onClick={() => setActiveTab("web")}
          >
            Páginas web
          </button>
          <button
            type="button"
            className={`admin-tab ${activeTab === "photos" ? "is-active" : ""}`}
            onClick={() => setActiveTab("photos")}
          >
            Fotos
          </button>
        </section>

        {activeTab === "overview" && (
          <div className="admin-grid-two">
            {renderReviews()}
            <section className="card admin-card admin-section">
              <div className="admin-section-head">
                <h2>Resumen de reservas</h2>
                <span>{pendingReservations.length + upcomingReservations.length}</span>
              </div>
              <div className="list admin-list">
                <p>
                  <strong>Pendientes:</strong> {pendingReservations.length}
                </p>
                <p>
                  <strong>Próximas confirmadas:</strong> {upcomingReservations.length}
                </p>
              </div>
            </section>
          </div>
        )}

        {activeTab === "reviews" && renderReviews()}

        {activeTab === "reservations" && renderReservations()}

        {activeTab === "web" && (
          <>
            <section className="admin-subtabs" aria-label="Páginas web">
              <button
                type="button"
                className={`admin-subtab ${activeWebTab === "inicio" ? "is-active" : ""}`}
                onClick={() => setActiveWebTab("inicio")}
              >
                Inicio
              </button>
              <button
                type="button"
                className={`admin-subtab ${activeWebTab === "carta" ? "is-active" : ""}`}
                onClick={() => setActiveWebTab("carta")}
              >
                Carta
              </button>
              <button
                type="button"
                className={`admin-subtab ${activeWebTab === "eventos" ? "is-active" : ""}`}
                onClick={() => setActiveWebTab("eventos")}
              >
                Eventos
              </button>
            </section>

            {activeWebTab === "inicio" && renderHomeEditor()}
            {activeWebTab === "carta" && renderMenuEditor()}
            {activeWebTab === "eventos" && renderEventsEditor()}
          </>
        )}

        {activeTab === "photos" && renderPhotosEditor()}
      </main>
    </>
  );
}

