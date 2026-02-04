import { randomBytes, randomUUID } from 'node:crypto';

import { InvalidDataError } from '../../../errors/InvalidDataError.js';
import { User } from './User.js';

describe('User (Domain Entity)', () => {

    const createRandomUserData = () => ({
        username: `user_${randomBytes(4).toString('hex')}`,
        email: `${randomBytes(4).toString('hex')}@brainrot.com`,
        passwordHash: randomBytes(64).toString('hex'),
        isSigma: Math.random() > 0.5,
        createdAt: new Date(),
        updatedAt: new Date()
    });

    describe('Full Instantiation & All Getters', () => {
        it('should create a valid User', () => {
            const data = createRandomUserData();
            const manualId = randomUUID();

            const user = User.builder
                .withId(manualId) // Couvre .withId()
                .username(data.username)
                .email(data.email)
                .passwordHash(data.passwordHash)
                .sigma(data.isSigma)
                .dates(data.createdAt, data.updatedAt)
                .build();

            expect(user.id).toBe(manualId);
            expect(user.username).toBe(data.username);
            expect(user.email).toBe(data.email);
            expect(user.passwordHash).toBe(data.passwordHash);
            expect(user.isSigma).toBe(data.isSigma);
            expect(user.createdAt).toEqual(data.createdAt);
            expect(user.updatedAt).toEqual(data.updatedAt);
        });

        it('should support automatic ID generation via withNewId', () => {
            const user = User.builder
                .withNewId()
                .username('test_user')
                .email('test@test.com')
                .passwordHash('hash')
                .build();

            expect(user.id).toBeDefined();
            expect(user.id.length).toBeGreaterThan(0);
        });
    });

    describe('Validation Constraints', () => {
        it('should throw an InvalidUserDataError if email format is invalid', () => {
            const data = createRandomUserData();
            const userBuilder = User.builder
                .withNewId()
                .username(data.username)
                .email('invalid-email')
                .passwordHash(data.passwordHash);

            expect(() => userBuilder.build()).toThrow(InvalidDataError);
        });

        it('should throw an InvalidUserDataError if username is empty', () => {
            const data = createRandomUserData();
            const userBuilder = User.builder
                .withNewId()
                .username('   ')
                .email(data.email)
                .passwordHash(data.passwordHash);

            expect(() => userBuilder.build()).toThrow(InvalidDataError);
        });
    });

    describe('Business Logic & Setters', () => {
        it('should update sigma status and refresh updatedAt timestamp', async () => {
            const user = User.builder
                .withNewId()
                .username('sigma_user')
                .email('sigma@mail.com')
                .passwordHash('hash')
                .sigma(false)
                .build();
            const initialUpdatedAt = user.updatedAt.getTime();
            await new Promise(resolve => setTimeout(resolve, 5));

            user.updateInternalStatus(true);

            expect(user.isSigma).toBe(true);
            expect(user.updatedAt.getTime()).toBeGreaterThan(initialUpdatedAt);
        });
    });

    describe('Static Accessor', () => {
        it('should return a new builder instance via the static getter', () => {
            expect(User.builder).toBeDefined();
            expect(User.builder.constructor.name).toBe('UserBuilder');
        });
    });
});