import { z } from "zod";

export const bookingSchema = z.object({
  hours: z
    .number({ invalid_type_error: "Please enter a valid number of hours" })
    .min(1, "Minimum 1 hour")
    .max(1000, "Maximum is 1000 hours"),
});
