import { randomBytes } from 'node:crypto';

import { InvalidDataError } from '../../errors/InvalidDataError.js';
import { Validator } from './Validator.js';

describe('Validator (Utility)', () => {
    const field = 'testField';

    describe('string', () => {
        it('should return the string when it is valid and non-empty', () => {
            const randomString = randomBytes(10).toString('hex');

            const result = Validator.string(randomString, field);

            expect(result).toBe(randomString);
        });

        it('should throw InvalidDataError when value is not a string', () => {
            const values = [123, true, {}, [], null, undefined];

            values.forEach(val => {
                expect(() => Validator.string(val, field)).toThrow(InvalidDataError);
            });
        });

        it('should throw InvalidDataError when string is empty or only whitespace', () => {
            const values = ['', '   ', '\n\t'];

            values.forEach(val => {
                expect(() => Validator.string(val, field)).toThrow(InvalidDataError);
            });
        });
    });

    describe('email', () => {
        it('should return the email when it is valid', () => {
            const validEmail = 'sigma.boy@brainrot.com';

            const result = Validator.email(validEmail, field);

            expect(result).toBe(validEmail);
        });

        it('should throw InvalidDataError for malformed emails', () => {
            const invalidEmails = ['plainaddress', '@no-user.com', 'user@no-domain', 'user@domain.c'];

            invalidEmails.forEach(email => {
                expect(() => Validator.email(email, field)).toThrow(InvalidDataError);
            });
        });
    });

    describe('boolean', () => {
        it('should return the boolean value', () => {
            expect(Validator.boolean(true, field)).toBe(true);
            expect(Validator.boolean(false, field)).toBe(false);
        });

        it('should throw InvalidDataError when value is not a boolean', () => {
            expect(() => Validator.boolean('true', field)).toThrow(InvalidDataError);
            expect(() => Validator.boolean(1, field)).toThrow(InvalidDataError);
        });
    });

    describe('number', () => {
        it('should return the number when valid', () => {
            const val = Math.random() * 100;

            expect(Validator.number(val, field)).toBe(val);
        });

        it('should throw InvalidDataError for NaN or non-numbers', () => {
            expect(() => Validator.number(NaN, field)).toThrow(InvalidDataError);
            expect(() => Validator.number('123', field)).toThrow(InvalidDataError);
        });
    });

    describe('date', () => {
        it('should return a Date instance when a Date object is provided', () => {
            const now = new Date();

            const result = Validator.date(now, field);

            expect(result).toBeInstanceOf(Date);
            expect(result.getTime()).toBe(now.getTime());
        });

        it('should parse and return a Date from a valid ISO string', () => {
            const iso = '2026-02-04T10:00:00.000Z';

            const result = Validator.date(iso, field);

            expect(result).toBeInstanceOf(Date);
            expect(result.getFullYear()).toBe(2026);
        });

        it('should parse and return a Date from a valid timestamp', () => {
            const ts = Date.now();

            const result = Validator.date(ts, field);

            expect(result.getTime()).toBe(ts);
        });

        it('should throw InvalidDataError for null or undefined', () => {
            expect(() => Validator.date(null, field)).toThrow(InvalidDataError);
            expect(() => Validator.date(undefined, field)).toThrow(InvalidDataError);
        });

        it('should throw InvalidDataError for invalid date formats', () => {
            expect(() => Validator.date('not-a-date', field)).toThrow(InvalidDataError);
            expect(() => Validator.date({}, field)).toThrow(InvalidDataError);
        });
    });
});