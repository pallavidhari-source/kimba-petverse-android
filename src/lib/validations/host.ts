import { z } from "zod";

export const becomeHostSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .max(100, "Full name must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),
  phone: z
    .string()
    .trim()
    .regex(/^\+91\s?\d{10}$|^\d{10}$/, "Phone number must be a valid Indian number"),
  address: z
    .string()
    .trim()
    .min(10, "Address must be at least 10 characters")
    .max(500, "Address must be less than 500 characters"),
});

export const registerPetSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Pet name is required")
    .max(100, "Pet name must be less than 100 characters"),
  type: z.enum(["dog", "cat", "bird", "rabbit"], {
    required_error: "Please select a pet type",
  }),
  breed: z
    .string()
    .trim()
    .min(1, "Breed is required")
    .max(100, "Breed must be less than 100 characters"),
  age: z
    .number()
    .int("Age must be a whole number")
    .min(0, "Age cannot be negative")
    .max(50, "Age must be less than 50 years"),
  temperament: z
    .string()
    .trim()
    .max(200, "Temperament must be less than 200 characters")
    .optional(),
  description: z
    .string()
    .trim()
    .max(2000, "Description must be less than 2000 characters")
    .optional(),
  price_per_hour: z
    .number()
    .positive("Price must be greater than 0")
    .max(100000, "Price must be less than ₹100,000"),
  location: z
    .string()
    .trim()
    .min(3, "Location is required")
    .max(200, "Location must be less than 200 characters"),
});

export const createPetStaySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Stay name is required")
    .max(200, "Stay name must be less than 200 characters"),
  type: z.enum(["commercial", "individual"], {
    required_error: "Please select a stay type",
  }),
  location: z
    .string()
    .trim()
    .min(3, "Location is required")
    .max(200, "Location must be less than 200 characters"),
  description: z
    .string()
    .trim()
    .max(2000, "Description must be less than 2000 characters")
    .optional(),
  price_per_night: z
    .number()
    .positive("Price must be greater than 0")
    .max(100000, "Price must be less than ₹100,000"),
  max_capacity: z
    .string()
    .trim()
    .max(50, "Capacity must be less than 50 characters")
    .optional(),
  pet_types: z
    .string()
    .trim()
    .max(200, "Pet types must be less than 200 characters")
    .optional(),
  check_in_time: z
    .string()
    .trim()
    .max(50, "Check-in time must be less than 50 characters")
    .optional(),
  check_out_time: z
    .string()
    .trim()
    .max(50, "Check-out time must be less than 50 characters")
    .optional(),
  image_url: z
    .string()
    .trim()
    .url("Invalid URL format")
    .max(500, "URL must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  features: z
    .string()
    .trim()
    .max(1000, "Features must be less than 1000 characters")
    .optional(),
  amenities: z
    .string()
    .trim()
    .max(1000, "Amenities must be less than 1000 characters")
    .optional(),
});
