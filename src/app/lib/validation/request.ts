import { z } from 'zod';

export const loginSchema = z.object({
    email: z
        .string({ required_error: 'The email field is required.' })
        .nonempty('The email field is required.')
        .email('The email must be a valid email address.'),

    password: z
        .string({ required_error: 'The password field is required.' })
        .nonempty('The password field is required.')
        .min(6, 'The password must be at least 6 characters.'),
});
