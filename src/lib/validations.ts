import { z } from "zod";

// ─────────────────────────────────────────────
//  Auth schemas
// ─────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.email({ error: "Please enter a valid email address." }).trim(),
  password: z
    .string()
    .min(6, { error: "Password must be at least 6 characters." }),
});

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, { error: "Name must be at least 2 characters." })
      .max(50, { error: "Name must be less than 50 characters." })
      .trim(),
    email: z.email({ error: "Please enter a valid email address." }).trim(),
    password: z
      .string()
      .min(8, { error: "Password must be at least 8 characters." })
      .regex(/[a-zA-Z]/, { error: "Password must contain at least one letter." })
      .regex(/[0-9]/, { error: "Password must contain at least one number." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;

// ─────────────────────────────────────────────
//  Task schemas
// ─────────────────────────────────────────────

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, { error: "Title is required." })
    .max(200, { error: "Title must be less than 200 characters." })
    .trim(),
  description: z
    .string()
    .max(2000, { error: "Description must be less than 2000 characters." })
    .optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).default("TODO"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  dueDate: z.string().optional().nullable(),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  id: z.string().min(1),
  position: z.number().int().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
