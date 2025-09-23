import { z } from "zod"

export const leadFormSchema = z.object({
  name: z
    .string()
    .min(2, "Ім'я повинно містити мінімум 2 символи")
    .max(50, "Ім'я не може бути довшим за 50 символів"),
  
  phone: z
    .string()
    .min(10, "Вкажіть коректний номер телефону")
    .regex(
      /^(\+380|380|0)\d{9}$/,
      "Вкажіть коректний український номер телефону"
    ),
  
  message: z
    .string()
    .max(500, "Повідомлення не може бути довшим за 500 символів")
    .optional(),
  
  service: z.string().optional(),
  
  practice: z.string().optional(),
})

export type LeadFormData = z.infer<typeof leadFormSchema>

export const contactFormSchema = leadFormSchema.omit({
  service: true,
  practice: true,
})

export type ContactFormData = z.infer<typeof contactFormSchema>