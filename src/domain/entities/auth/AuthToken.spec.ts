import { randomBytes,randomUUID } from 'node:crypto';

import {InvalidDataError} from '../../../errors/InvalidDataError.js';
import {AuthToken} from './AuthToken.js';

describe('AuthToken (Domain Entity)', () => {

    /**
     * Génère des données aléatoires pour un AuthToken.
     */
    const createRandomTokenData = () => ({
        accessToken: randomBytes(32).toString('hex'),
        refreshToken: randomUUID(),
        expiresIn: new Date(Date.now() + Math.floor(Math.random() * 1000000)),
        userId: randomUUID()
    });

    describe('Instantiation', () => {
        it('should create a valid AuthToken when all data is correct', () => {
            const data = createRandomTokenData();

            const authToken = AuthToken.builder
                .accessToken(data.accessToken)
                .userId(data.userId)
                .refreshToken(data.refreshToken)
                .expiresIn(data.expiresIn)
                .build();

            expect(authToken.accessToken).toBe(data.accessToken);
            expect(authToken.refreshToken).toBe(data.refreshToken);
            expect(authToken.expiresIn).toEqual(data.expiresIn);
            expect(authToken.userId).toBe(data.userId);
        });
    });

    describe('Validation Constraints', () => {
        it('should throw a ValidationError if accessToken is empty', () => {
            const data = createRandomTokenData();
            const invalidAccessToken = '   ';
            const actualAuthToken = AuthToken.builder
                .accessToken(invalidAccessToken)
                .refreshToken(data.refreshToken)
                .expiresIn(data.expiresIn)
                .userId(data.userId);

            expect(() => {
                actualAuthToken.build();
            }).toThrow(InvalidDataError);
        });

        it('should throw a ValidationError if userId is an empty string', () => {
            const data = createRandomTokenData();
            const emptyUserId = '';
            const actualAuthToken = AuthToken.builder
                .accessToken(data.accessToken)
                .refreshToken(data.refreshToken)
                .expiresIn(data.expiresIn)
                .userId(emptyUserId);

            expect(() => {
                actualAuthToken.build();
            }).toThrow(InvalidDataError);
        });
    });
});