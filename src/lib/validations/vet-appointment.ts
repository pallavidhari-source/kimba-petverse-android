import { z } from "zod";

export const vetAppointmentSchema = z.object({
  petParentName: z.string().min(2, "Pet parent name must be at least 2 characters"),
  phoneNumber: z.string().regex(/^\+91\s?\d{10}$/, "Phone number must be in format +91 followed by 10 digits"),
  petName: z.string().min(2, "Pet name must be at least 2 characters"),
  petType: z.string().min(1, "Please select pet type"),
  petGender: z.enum(["male", "female"], {
    required_error: "Please select pet gender",
  }),
  appointmentReason: z.string().min(10, "Please provide a detailed reason (at least 10 characters)"),
  preferredDate: z.string().min(1, "Please select a preferred date"),
  preferredTime: z.string().min(1, "Please select a preferred time"),
});

export type VetAppointmentFormData = z.infer<typeof vetAppointmentSchema>;
