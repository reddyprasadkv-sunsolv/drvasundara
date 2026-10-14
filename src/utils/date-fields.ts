import { z } from 'zod';
// Clinic dates are real calendar dates; null/numbers must never coerce into 1970.
export const editorialDate = z
  .union([z.date(), z.string().regex(/^\d{4}-\d{2}-\d{2}$/)])
  .refine(
    (value) => {
      const date = value instanceof Date ? value : new Date(value);
      return (
        Number.isFinite(date.valueOf()) &&
        (value instanceof Date || date.toISOString().slice(0, 10) === value)
      );
    },
    { message: 'Use a genuine YYYY-MM-DD calendar date.' },
  )
  .transform((value) => (value instanceof Date ? value : new Date(value)));
