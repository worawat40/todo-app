import { ZodError } from 'zod';

export function formatZodErrors(error: ZodError) {
    const flat = error.flatten().fieldErrors;
    const result: Record<string, string[]> = {};

    for (const key in flat) {
        if (flat[key]?.length) {
            result[key] = [flat[key]![0]];
        }
    }

    return result;
}
