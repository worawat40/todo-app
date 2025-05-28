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

export const registerSchema = z.object({
    name: z.string({ required_error: 'The name field is required.' }).nonempty('The name field is required.'),
    email: z
        .string({ required_error: 'The email field is required.' })
        .nonempty('The email field is required.')
        .email('The email must be a valid email address.'),

    password: z
        .string({ required_error: 'The password field is required.' })
        .nonempty('The password field is required.')
        .min(6, 'The password must be at least 6 characters.'),
});

export const changePasswordSchema = z
    .object({
        email: z
            .string({ required_error: 'The email field is required.' })
            .nonempty('The email field is required.')
            .email('The email must be a valid email address.'),

        oldPassword: z
            .string({ required_error: 'The old password field is required.' })
            .nonempty('The old password field is required.')
            .min(6, 'The old password must be at least 6 characters.'),

        newPassword: z
            .string({ required_error: 'The new password field is required.' })
            .nonempty('The new password field is required.')
            .min(6, 'The new password must be at least 6 characters.'),
    })
    .refine((data) => data.oldPassword !== data.newPassword, {
        message: 'New password must be different from old password.',
        path: ['newPassword'],
    });
