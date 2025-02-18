import { z } from "zod";

export const userValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Name is required" }),
    password: z.string().min(1, { message: "Password is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    role: z.enum(["user", "admin"]).optional(),
    profileImg: z.string().min(1, { message: "Image is required" }).optional(),
    // for future use, if we have address field in the database
    address: z.string().optional(),
  }),
});
