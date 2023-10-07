import { z } from "zod";

export const ContactSchema = z.object({
  firstname: z.string().trim().min(1, { message: "enter first name" }),
  lastname: z.string().trim().min(1, { message: "enter last name" }),

  emails: z.array(
    z.object({
      email: z
        .string()
        // .toLowerCase()
        .trim()
        .email({ message: "not a valid email" }),
    })
  ),
  phoneNumbers: z.array(
    z.object({
      phone: z
        .string()
        .regex(
          /^(03|70|01|05)[0-9]{6}$/,
          "phone start with 03, 70, 01, 05 followed by 6 digits"
        ),
      // .transform((val) => `${val.slice(0, 2)}-${val.slice(2)}`),
    })
  ),
  scope: z.string(),
  _id: z.string().optional(),
  createdAt: z.date().default(new Date()),
  createdBy: z.string().optional(),
  updatedAt: z.date().optional(),
  updatedBy: z.string().optional(),
});

export type ContactType = z.infer<typeof ContactSchema>;

export const CreateContactSchema = ContactSchema.pick({
  firstname: true,
  lastname: true,
  emails: true,
  phoneNumbers: true,
  scope: true,
});

export type CreateContactType = z.infer<typeof CreateContactSchema>;

export type EmailError = { email: string };
export type PhoneError = { phone: string };
export type ErrorObject = {
  FN_Error: string;
  LN_Error: string;
  Email_Error: EmailError[];
  Phone_Error: PhoneError[];
};
