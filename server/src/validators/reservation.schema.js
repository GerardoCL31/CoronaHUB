import { z } from "zod";

const isFutureDateTime = (date, time) => {
  if (!date || !time) return false;
  const dateTime = new Date(`${date}T${time}:00`);
  return Number.isFinite(dateTime.valueOf()) && dateTime.getTime() > Date.now();
};

const isNotSunday = (date) => {
  if (!date) return false;
  const [year, month, day] = String(date).split("-").map(Number);
  const value = new Date(year, month - 1, day);
  return value.getDay() !== 0;
};

export const reservationSchema = z
  .object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    phone: z.string().trim().min(6).max(30),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    time: z.string().regex(/^\d{2}:\d{2}$/),
    tableId: z.string().min(1).max(20),
    people: z.coerce.number().int().min(1).max(20),
    notes: z.string().max(500).optional().nullable(),
  })
  .refine((data) => isFutureDateTime(data.date, data.time), {
    message: "La fecha y hora deben ser futuras",
    path: ["date"],
  })
  .refine((data) => isNotSunday(data.date), {
    message: "Los domingos el restaurante está cerrado",
    path: ["date"],
  });
