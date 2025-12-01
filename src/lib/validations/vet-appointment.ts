import { z } from "zod";

export const vetAppointmentSchema = z.object({
  petParentName: z.string().min(2, "Pet parent name must be at least 2 characters"),
  petName: z.string().min(2, "Pet name must be at least 2 characters"),
  petGender: z.enum(["male", "female"], {
    required_error: "Please select pet gender",
  }),
  appointmentReason: z.string().min(10, "Please provide a detailed reason (at least 10 characters)"),
  preferredDate: z.string().min(1, "Please select a preferred date"),
  preferredTime: z.string().min(1, "Please select a preferred time"),
});

export type VetAppointmentFormData = z.infer<typeof vetAppointmentSchema>;
