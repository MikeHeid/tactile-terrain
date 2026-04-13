import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required").max(300),
  message: z.string().min(1, "Message is required").max(5000),
});

export const customOrderSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Invalid email address"),
  organization: z.string().max(300).optional(),
  projectType: z.string().min(1, "Project type is required"),
  scale: z.string().max(200).optional(),
  timeline: z.string().max(200).optional(),
  budgetRange: z.string().optional(),
  description: z.string().min(1, "Description is required").max(10000),
});

export const galleryItemSchema = z.object({
  title: z.string().min(1, "Title is required").max(300),
  slug: z.string().min(1, "Slug is required").max(300),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  scale: z.string().optional(),
  year: z.string().optional(),
  location: z.string().optional(),
  sortOrder: z.number().int().default(0),
  featured: z.boolean().default(false),
});

export const homepageContentSchema = z.object({
  heroTagline: z.string().min(1, "Tagline is required"),
  introText: z.string().min(1, "Intro text is required"),
});

export type ContactFormData = z.infer<typeof contactSchema>;
export type CustomOrderFormData = z.infer<typeof customOrderSchema>;
export type GalleryItemFormData = z.infer<typeof galleryItemSchema>;
export type HomepageContentFormData = z.infer<typeof homepageContentSchema>;
