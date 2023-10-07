import { z } from "zod";

export const UserSchema = z.object({
  firstname: z.string().trim().min(1, { message: "enter first name" }),
  lastname: z.string().trim().min(1, { message: "enter last name" }),
  username: z
    .string()
    .trim()
    .min(2, { message: "username has at least 2characters" }),
  password: z
    .string()
    .trim()
    .min(2, { message: "password has at least 2characters" }),
  dateOfBirth: z
    .date()
    .min(new Date("1920-01-01"), { message: "too old Date" })
    .max(new Date(), { message: "too young Date" }),

  _id: z.string().optional(),
  createdBy: z.string().optional(),
  editedBy: z.string().optional(),
  createdAt: z.date().default(new Date()),
  editedAt: z.date().optional(),
  isDeleted: z.boolean().default(false),
  isAdmin: z.boolean().default(false),
});
export type UserType = z.infer<typeof UserSchema>;

export const UserWithoutPassSchema = UserSchema.omit({
  password: true,
});
export type UserWithoutPassType = z.infer<typeof UserWithoutPassSchema>;

export const AuthUserWithIdSchema = UserSchema.pick({
  firstname: true,
  _id: true,
}).required();
export type AuthUserWithIdType = z.infer<typeof AuthUserWithIdSchema>;

export const CreateUserSchema = UserSchema.pick({
  firstname: true,
  lastname: true,
  username: true,
  password: true,
  dateOfBirth: true,
});
export type CreateUserType = z.infer<typeof CreateUserSchema>;

export const EditUserSchema = UserSchema.pick({
  firstname: true,
  lastname: true,
  username: true,
  dateOfBirth: true,
});

export type EditUserType = z.infer<typeof EditUserSchema>;

export type EditUserBodyType = {
  firstname: string;
  lastname: string;
  username: string;
  dateOfBirth: string;
};
