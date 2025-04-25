import { z } from "zod";

export const bookingSchema = z.object({
  hours: z
    .number({ invalid_type_error: "Please enter a valid number of hours" })
    .min(1, "Minimum 1 hour")
    .max(1000, "Maximum is 1000 hours"),
  teachingType: z.enum(["online", "physical"], {
    required_error: "Please select teaching type",
  }),
  location: z.string().optional(),
  startDate: z.date({
    required_error: "Please select a start date",
  }),
  endDate: z.date({
    required_error: "Please select an end date",
  }),
  remarks: z.string().optional(),
});
