import { StrictMode, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import "./reserva.css";
import mesaComida from "./assets/mesaComida.png";
import quesoUvas from "./assets/quesoUvas.png";
import comidaBarra from "./assets/comidaBarra.png";
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
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
];

const DATE_OPTIONS_DAYS = 90;
const WEEKDAYS_ES = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];
const MONTHS_ES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const pad2 = (value) => String(value).padStart(2, "0");
const startOfDay = (value) => new Date(value.getFullYear(), value.getMonth(), value.getDate());
const startOfMonth = (value) => new Date(value.getFullYear(), value.getMonth(), 1);
const addDays = (value, amount) =>
  new Date(value.getFullYear(), value.getMonth(), value.getDate() + amount);
const toISODateLocal = (value) =>
  `${value.getFullYear()}-${pad2(value.getMonth() + 1)}-${pad2(value.getDate())}`;
const parseISODateLocal = (value) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

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
  const minDate = useMemo(() => startOfDay(new Date()), []);
  const maxDate = useMemo(() => addDays(minDate, DATE_OPTIONS_DAYS - 1), [minDate]);
  const minMonth = useMemo(() => startOfMonth(minDate), [minDate]);
  const maxMonth = useMemo(() => startOfMonth(maxDate), [maxDate]);
  const initialDate = useMemo(() => toISODateLocal(minDate), [minDate]);
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(timeSlots[0]);
  const [visibleMonth, setVisibleMonth] = useState(minMonth);
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
  const canGoPrevMonth = visibleMonth.getTime() > minMonth.getTime();
  const canGoNextMonth = visibleMonth.getTime() < maxMonth.getTime();

  const calendarCells = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];

    for (let index = 0; index < startOffset; index += 1) {
      cells.push({ empty: true, key: `empty-${index}` });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const currentDate = new Date(year, month, day);
      const iso = toISODateLocal(currentDate);
      const disabled = currentDate < minDate || currentDate > maxDate;
      cells.push({ empty: false, key: iso, day, iso, disabled });
    }

    return cells;
  }, [visibleMonth, minDate, maxDate]);

  return (
    <div className="reserva-page">
      <Navbar active="reserva" cartaTarget="_blank" />

      <main className="reserva-main">
        <aside className="reserva-side">
          <img src={chimenea1} alt="Mesa con tapas" />
          <img src={comidaBarra} alt="Comida en barra" />
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
            <label className="reserva-date-picker">
              Dia
              <div className="calendar-picker">
                <div className="calendar-header">
                  <button
                    type="button"
                    className="calendar-nav"
                    onClick={() =>
                      setVisibleMonth(
                        (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
                      )
                    }
                    disabled={!canGoPrevMonth}
                    aria-label="Mes anterior"
                  >
                    ‹
                  </button>
                  <strong>{`${MONTHS_ES[visibleMonth.getMonth()]} ${visibleMonth.getFullYear()}`}</strong>
                  <button
                    type="button"
                    className="calendar-nav"
                    onClick={() =>
                      setVisibleMonth(
                        (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
                      )
                    }
                    disabled={!canGoNextMonth}
                    aria-label="Mes siguiente"
                  >
                    ›
                  </button>
                </div>
                <div className="calendar-weekdays">
                  {WEEKDAYS_ES.map((weekDay) => (
                    <span key={weekDay}>{weekDay}</span>
                  ))}
                </div>
                <div className="calendar-grid">
                  {calendarCells.map((cell) => {
                    if (cell.empty) {
                      return <span key={cell.key} className="calendar-empty" aria-hidden="true" />;
                    }
                    const isSelected = date === cell.iso;
                    return (
                      <button
                        type="button"
                        key={cell.key}
                        className={`calendar-day ${isSelected ? "is-selected" : ""}`}
                        disabled={cell.disabled}
                        onClick={() => {
                          setDate(cell.iso);
                          setVisibleMonth(startOfMonth(parseISODateLocal(cell.iso)));
                        }}
                      >
                        {cell.day}
                      </button>
                    );
                  })}
                </div>
              </div>
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
          <img src={quesoUvas} alt="Queso con uvas" />
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
