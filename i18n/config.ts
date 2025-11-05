export const locales = ['en','de'] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'en';
export function isLocale(v: string | undefined): v is Locale { return !!v && (['en','de'] as const).includes(v as any); }
