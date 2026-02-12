import { useMemo, useState } from "react";
import "../App.css";
import "../reserva.css";
import quesoUvas from "../assets/quesoUvas.png";
import comidaBarra from "../assets/comidaBarra.png";
import chimenea1 from "../assets/chimenea1.png";
import Navbar from "../components/Navbar.jsx";
import FooterSmall from "../components/FooterSmall.jsx";
import { createReservation } from "../services/reservations.service.js";

const tableGroups = [
  {
    title: "Salon 1",
    key: "salon1",
    tables: [
      { id: "S1", seats: 4 },
      { id: "S2", seats: 4 },
      { id: "S3", seats: 4 },
      { id: "S4", seats: 4 },
    ],
  },
  {
    title: "Salon 2",
    key: "salon2",
    tables: [
      { id: "S2-1", seats: 4 },
      { id: "S2-2", seats: 6 },
      { id: "S2-3", seats: 6 },
    ],
  },
  {
    title: "Terraza",
    key: "terraza",
    tables: [
      { id: "T1", seats: 4 },
      { id: "T2", seats: 4 },
      { id: "T3", seats: 4 },
      { id: "T4", seats: 4 },
    ],
  },
];

const timeSlots = [
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
];

const formatDate = (value) => {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
};

export default function Reservation() {
  const today = new Date();
  const [date, setDate] = useState(today.toISOString().slice(0, 10));
  const [time, setTime] = useState(timeSlots[2]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [people, setPeople] = useState(2);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const todayReservations = useMemo(() => [], []);

  const handleSelectTable = (tableId) => {
    setSelectedTable((prev) => (prev === tableId ? null : tableId));
  };

  const handleReserve = async () => {
    setError("");
    setStatus("");

    try {
      const finalNotes = selectedTable
        ? `${notes ? `${notes} ` : ""}Mesa: ${selectedTable}`
        : notes;

      await createReservation({
        name: guestName.trim(),
        email: guestEmail.trim(),
        phone: guestPhone.trim() || null,
        date,
        time,
        people: Number(people),
        notes: finalNotes || null,
      });

      setStatus(
        "Reserva enviada. Queda pendiente de confirmacion. Te enviaremos un WhatsApp para confirmar la reserva."
      );
      setSelectedTable(null);
      setGuestName("");
      setGuestEmail("");
      setGuestPhone("");
      setPeople(2);
      setNotes("");
    } catch (err) {
      setError(err.message || "No se pudo enviar la reserva.");
    }
  };

  return (
    <div className="reserva-page">
      <Navbar active="reserva" />

      <main className="reserva-main">
        <aside className="reserva-side">
          <img src={chimenea1} alt="Mesa con tapas" />
          <img src={comidaBarra} alt="Comida en barra" />
        </aside>

        <section className="reserva-center">
          <div className="reserva-status">
            <div>
              <span>Mesas disponibles</span>
              <strong>{formatDate(date)}</strong>
            </div>
            <div className="status-list">
              {todayReservations.length === 0 && <p>Reserva tu mesa favorita</p>}
            </div>
          </div>

          <div className="reserva-controls">
            <label>
              Dia
              <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
            </label>
            <label>
              Hora
              <select value={time} onChange={(event) => setTime(event.target.value)}>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Nombre
              <input
                type="text"
                value={guestName}
                onChange={(event) => setGuestName(event.target.value)}
                placeholder="Tu nombre"
              />
            </label>
            <label>
              Correo
              <input
                type="email"
                value={guestEmail}
                onChange={(event) => setGuestEmail(event.target.value)}
                placeholder="tu@correo.com"
              />
            </label>
            <label>
              Telefono
              <input
                type="tel"
                value={guestPhone}
                onChange={(event) => setGuestPhone(event.target.value)}
                placeholder="600 000 000"
              />
            </label>
            <label>
              Personas
              <input
                type="number"
                min="1"
                max="20"
                value={people}
                onChange={(event) => setPeople(event.target.value)}
              />
            </label>
            <label>
              Notas
              <textarea
                rows="3"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Alergias, celebraciones, etc."
              />
            </label>
          </div>

          <div className="reserva-map">
            {tableGroups.map((group) => (
              <div className="reserva-group" key={group.key}>
                <h3>{group.title}</h3>
                <div className="table-grid">
                  {group.tables.map((table) => {
                    const isSelected = selectedTable === table.id;
                    return (
                      <button
                        type="button"
                        key={table.id}
                        className={`table-pill ${isSelected ? "is-selected" : ""}`}
                        onClick={() => handleSelectTable(table.id)}
                      >
                        <span>{table.id}</span>
                        <small>{table.seats} pax</small>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="reserva-legend">
            <div className="legend-item">
              <span className="legend-dot is-free" />
              Libre
            </div>
            <div className="legend-item">
              <span className="legend-dot is-selected" />
              Seleccionada
            </div>
          </div>

          <div className="reserva-action">
            <button
              type="button"
              onClick={handleReserve}
              disabled={!guestName.trim() || !guestEmail.trim() || !date || !time}
            >
              Reservar mesa
            </button>
            {selectedTable && (
              <p>
                Mesa <strong>{selectedTable}</strong> para el {formatDate(date)} a las {time}
              </p>
            )}
            {error && <p className="form-error">{error}</p>}
            {status && <p className="form-note">{status}</p>}
          </div>
        </section>

        <aside className="reserva-side">
          <img src={quesoUvas} alt="Queso con uvas" />
        </aside>
      </main>

      <FooterSmall />
    </div>
  );
}
