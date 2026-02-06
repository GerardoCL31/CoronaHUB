import { z } from "zod";

const isFutureDateTime = (date, time) => {
  if (!date || !time) return false;
  const dateTime = new Date(`${date}T${time}:00`);
  return Number.isFinite(dateTime.valueOf()) && dateTime.getTime() > Date.now();
};

export const reservationSchema = z
  .object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    phone: z.string().max(30).optional().nullable(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    time: z.string().regex(/^\d{2}:\d{2}$/),
    people: z.coerce.number().int().min(1).max(20),
    notes: z.string().max(500).optional().nullable(),
  })
  .refine((data) => isFutureDateTime(data.date, data.time), {
    message: "La fecha y hora deben ser futuras",
    path: ["date"],
  });
