import { useEffect, useMemo, useState } from "react";
import "../App.css";
import "../reserva.css";
import { chimenea1, comidaBarra, quesoUvas } from "../constants/cloudinaryAssets.js";
import Navbar from "../components/Navbar.jsx";
import FooterSmall from "../components/FooterSmall.jsx";
import ImageStack from "../components/ImageStack.jsx";
import FormFeedback from "../components/FormFeedback.jsx";
import {
  createReservation,
  getReservationAvailability,
} from "../services/reservations.service.js";

const tableGroups = [
  {
    title: "Salón 1",
    key: "salon1",
    tables: [
      { id: "S1", seats: 4 },
      { id: "S2", seats: 4 },
      { id: "S3", seats: 4 },
      { id: "S4", seats: 4 },
    ],
  },
  {
    title: "Salón 2",
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

const formatDate = (value) => {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
};

export default function Reservation() {
  const minDate = useMemo(() => startOfDay(new Date()), []);
  const maxDate = useMemo(() => addDays(minDate, DATE_OPTIONS_DAYS - 1), [minDate]);
  const minMonth = useMemo(() => startOfMonth(minDate), [minDate]);
  const maxMonth = useMemo(() => startOfMonth(maxDate), [maxDate]);
  const initialDate = useMemo(() => toISODateLocal(minDate), [minDate]);
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(timeSlots[0]);
  const [visibleMonth, setVisibleMonth] = useState(minMonth);
  const [selectedTable, setSelectedTable] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [people, setPeople] = useState(2);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [availabilityError, setAvailabilityError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    const loadAvailability = async () => {
      try {
        const rows = await getReservationAvailability(date);
        if (!mounted) return;
        setAvailability(rows);
        setAvailabilityError("");
      } catch {
        if (!mounted) return;
        setAvailability([]);
        setAvailabilityError("No se pudo cargar disponibilidad en tiempo real.");
      }
    };
    loadAvailability();
    return () => {
      mounted = false;
    };
  }, [date]);

  const reservedByTable = useMemo(() => {
    const map = new Map();
    availability.forEach((item) => {
      if (!item?.tableId || !item?.time) return;
      if (!map.has(item.tableId)) {
        map.set(item.tableId, new Set());
      }
      map.get(item.tableId).add(item.time);
    });
    return map;
  }, [availability]);

  const reservedTablesAtTime = useMemo(() => {
    const set = new Set();
    availability.forEach((item) => {
      if (item?.time === time && item?.tableId) {
        set.add(item.tableId);
      }
    });
    return set;
  }, [availability, time]);

  const availableTimeSlots = useMemo(() => {
    if (!selectedTable) return timeSlots;
    const blocked = reservedByTable.get(selectedTable) || new Set();
    return timeSlots.filter((slot) => !blocked.has(slot));
  }, [reservedByTable, selectedTable]);
  const blockedTimeSlots = useMemo(() => {
    if (!selectedTable) return [];
    const blocked = reservedByTable.get(selectedTable) || new Set();
    return timeSlots.filter((slot) => blocked.has(slot));
  }, [reservedByTable, selectedTable]);

  useEffect(() => {
    if (!selectedTable) return;
    if (reservedTablesAtTime.has(selectedTable)) {
      setSelectedTable(null);
    }
  }, [reservedTablesAtTime, selectedTable]);

  useEffect(() => {
    if (!availableTimeSlots.includes(time)) {
      setTime(availableTimeSlots[0] || "");
    }
  }, [availableTimeSlots, time]);

  const todayReservations = availability;
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

  const handleSelectTable = (tableId) => {
    setSelectedTable((prev) => (prev === tableId ? null : tableId));
  };

  const handleReserve = async () => {
    if (isSubmitting) return;
    setError("");
    setStatus("");
    setIsSubmitting(true);

    try {
      const finalNotes = notes.trim() || null;

      await createReservation({
        name: guestName.trim(),
        email: guestEmail.trim(),
        phone: guestPhone.trim(),
        date,
        time,
        tableId: selectedTable,
        people: Number(people),
        notes: finalNotes,
      });

      setStatus(
        "Reserva enviada. Queda pendiente de confirmación. Te enviaremos un WhatsApp para confirmar la reserva."
      );
      setSelectedTable(null);
      setGuestName("");
      setGuestEmail("");
      setGuestPhone("");
      setPeople(2);
      setNotes("");
      try {
        const rows = await getReservationAvailability(date);
        setAvailability(rows);
        setAvailabilityError("");
      } catch {
        setAvailabilityError("Reserva creada, pero no se pudo refrescar disponibilidad.");
      }
    } catch (err) {
      setStatus("");
      setError(err.message || "No se pudo enviar la reserva.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="reserva-page">
      <Navbar active="reserva" />

      <main className="reserva-main">
        <ImageStack
          as="aside"
          className="reserva-side"
          images={[
            { src: chimenea1, alt: "Mesa con tapas" },
            { src: comidaBarra, alt: "Comida en barra" },
          ]}
        />

        <section className="reserva-center">
          <div className="reserva-status">
            <div>
              <span>Mesas disponibles</span>
              <strong>{formatDate(date)}</strong>
            </div>
            <div className="status-list">
              {availabilityError && <p>{availabilityError}</p>}
              {!availabilityError && todayReservations.length === 0 && <p>Reserva tu mesa favorita</p>}
              {!availabilityError && todayReservations.length > 0 && (
                <p>{todayReservations.length} reservas activas ese día</p>
              )}
              {selectedTable && blockedTimeSlots.length > 0 && (
                <p>
                  {selectedTable} ocupada: {blockedTimeSlots.join(", ")}
                </p>
              )}
            </div>
          </div>

          <div className="reserva-controls">
            <label className="reserva-date-picker">
              Día
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
                {availableTimeSlots.map((slot) => (
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
              Teléfono
              <input
                type="tel"
                value={guestPhone}
                onChange={(event) => setGuestPhone(event.target.value)}
                placeholder="600 000 000"
                required
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
                rows="1"
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
                    const isReserved = reservedTablesAtTime.has(table.id);
                    return (
                      <button
                        type="button"
                        key={table.id}
                        className={`table-pill ${isSelected ? "is-selected" : ""} ${isReserved ? "is-reserved" : ""}`}
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
              disabled={
                isSubmitting ||
                !guestName.trim() ||
                !guestEmail.trim() ||
                !guestPhone.trim() ||
                !date ||
                !time ||
                !selectedTable
              }
            >
              {isSubmitting ? "Enviando..." : "Reservar mesa"}
            </button>
            {selectedTable && (
              <p>
                Mesa <strong>{selectedTable}</strong> para el {formatDate(date)} a las {time}
              </p>
            )}
            <FormFeedback error={error} status={status} />
          </div>
        </section>

        <ImageStack
          as="aside"
          className="reserva-side"
          images={[{ src: quesoUvas, alt: "Queso con uvas" }]}
        />
      </main>

      <FooterSmall />
    </div>
  );
}


