import { StrictMode, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import "./reserva.css";
import mesaComida from "./assets/mesaComida.png";
import chimenea1 from "./assets/chimenea1.png";
import Navbar from "./components/Navbar.jsx";
import FooterSmall from "./components/FooterSmall.jsx";

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

const storageKey = "barcorona_reservas";

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

const loadReservations = () => {
  if (typeof window === "undefined") {
    return [];
  }
  const saved = window.localStorage.getItem(storageKey);
  if (!saved) {
    return [];
  }
  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const saveReservations = (items) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }
};

const formatDate = (value) => {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
};

function Reserva() {
  const today = new Date();
  const [date, setDate] = useState(today.toISOString().slice(0, 10));
  const [time, setTime] = useState(timeSlots[2]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [reservations, setReservations] = useState(loadReservations);

  const reservedSet = useMemo(() => {
    const set = new Set();
    reservations.forEach((item) => {
      if (item.date === date && item.time === time) {
        set.add(item.tableId);
      }
    });
    return set;
  }, [reservations, date, time]);

  const handleSelectTable = (tableId) => {
    if (reservedSet.has(tableId)) {
      return;
    }
    setSelectedTable((prev) => (prev === tableId ? null : tableId));
  };

  const handleReserve = () => {
    if (!selectedTable || !guestName.trim() || !guestPhone.trim()) {
      return;
    }
    if (reservedSet.has(selectedTable)) {
      return;
    }

    const newReservation = {
      id: `res-${Date.now()}`,
      tableId: selectedTable,
      date,
      time,
      name: guestName.trim(),
      phone: guestPhone.trim(),
    };

    const next = [newReservation, ...reservations];
    setReservations(next);
    saveReservations(next);
    setSelectedTable(null);
    setGuestName("");
    setGuestPhone("");
  };

  const todayReservations = useMemo(() => {
    return reservations.filter((item) => item.date === date).slice(0, 2);
  }, [reservations, date]);

  return (
    <div className="reserva-page">
      <Navbar active="reserva" cartaTarget="_blank" />

      <main className="reserva-main">
        <aside className="reserva-side">
          <img src={chimenea1} alt="Mesa con tapas" />
          <img src={mesaComida} alt="Platos para compartir" />
        </aside>

        <section className="reserva-center">
          <div className="reserva-status">
            <div>
              <span>Mesas libres hoy</span>
              <strong>{formatDate(date)}</strong>
            </div>
            <div className="status-list">
              {todayReservations.length === 0 && <p>Sin reservas aun</p>}
              {todayReservations.map((item) => (
                <p key={item.id}>
                  {item.tableId} - {item.time}
                </p>
              ))}
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
              Telefono
              <input
                type="tel"
                value={guestPhone}
                onChange={(event) => setGuestPhone(event.target.value)}
                placeholder="600 000 000"
              />
            </label>
          </div>

          <div className="reserva-map">
            {tableGroups.map((group) => (
              <div className="reserva-group" key={group.key}>
                <h3>{group.title}</h3>
                <div className="table-grid">
                  {group.tables.map((table) => {
                    const isReserved = reservedSet.has(table.id);
                    const isSelected = selectedTable === table.id;
                    return (
                      <button
                        type="button"
                        key={table.id}
                        className={`table-pill ${isReserved ? "is-reserved" : ""} ${isSelected ? "is-selected" : ""}`}
                        onClick={() => handleSelectTable(table.id)}
                        disabled={isReserved}
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
              <span className="legend-dot is-reserved" />
              Reservada
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
              disabled={!selectedTable || !guestName.trim() || !guestPhone.trim()}
            >
              Reservar mesa
            </button>
            {selectedTable && (
              <p>
                Mesa <strong>{selectedTable}</strong> para el {formatDate(date)} a las {time}
              </p>
            )}
          </div>
        </section>

        <aside className="reserva-side">
          <img src={mesaComida} alt="Tabla de jamon" />
        </aside>
      </main>

      <FooterSmall />
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Reserva />
  </StrictMode>
);
