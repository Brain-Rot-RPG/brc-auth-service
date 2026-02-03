import {Validator} from '../../utils/Validator.js';
import {AuthTokenBuilder} from './AuthTokenBuilder.js';

export class AuthToken {
    private readonly _accessToken: string;
    private readonly _refreshToken: string;
    private readonly _expiresIn: Date;
    private readonly _userId: string;

    constructor(
        accessToken: string,
        refreshToken: string,
        expiresIn: number | Date, // Changed to allow Date directly or number timestamp
        userId: string
    ) {
        this._accessToken = Validator.string(accessToken, 'accessToken');
        this._refreshToken = Validator.string(refreshToken , 'refreshToken');
        this._expiresIn = Validator.date(expiresIn, 'expiresIn');
        this._userId = Validator.string(userId, 'userId');
    }

    get accessToken(): string { return this._accessToken; }
    get refreshToken(): string { return this._refreshToken; }
    get expiresIn(): Date { return this._expiresIn; }
    get userId(): string { return this._userId; }

    static get builder(): AuthTokenBuilder {
        return new AuthTokenBuilder();
    }
}

