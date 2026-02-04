import {InvalidDataError} from '../../errors/InvalidDataError.js';

export class Validator {
    /**
     * Chaîne de caractères classique (username, passwordHash, tokens).
     */
    static string(value: unknown, fieldName: string): string {
        if (typeof value !== 'string' || value.trim().length === 0) {
            throw new InvalidDataError(fieldName, 'Le champ doit être une chaîne non vide.');
        }
        return value;
    }

    /**
     * Validation stricte d'un Email.
     */
    static email(value: unknown, fieldName: string): string {
        const email = this.string(value, fieldName);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new InvalidDataError(fieldName, 'Le champ doit être un email valide.');
        }
        return email;
    }

    /**
     * Validation d'un booléen (pour isSigma).
     */
    static boolean(value: unknown, fieldName: string): boolean {
        if (typeof value !== 'boolean') {
            throw new InvalidDataError(fieldName, 'Le champ doit être un booléen.');
        }
        return value;
    }

    /**
     * Validation d'un nombre (pour expiresIn).
     */
    static number(value: unknown, fieldName: string): number {
        if (typeof value !== 'number' || Number.isNaN(value)) {
            throw new InvalidDataError(fieldName, 'Le champ doit être un nombre valide.');
        }
        return value;
    }

    /**
     * Validation des dates (createdAt, updatedAt).
     */
    static date(value: unknown, fieldName: string): Date {
        if (value === undefined || value === null) {
            throw new InvalidDataError(fieldName, 'Le champ est requis.');
        }
        const parsedDate = typeof value === 'string' || typeof value === 'number'
            ? new Date(value)
            : value;

        if (!(parsedDate instanceof Date) || Number.isNaN(parsedDate.getTime())) {
            throw new InvalidDataError(fieldName, 'Le champ doit être une date valide.');
        }
        return parsedDate;
    }
}