import { Validator } from '../../utils/Validator.js';
import {UserBuilder} from './UserBuilder.js';

export class User {

    private readonly _id: string;
    private readonly _username: string;
    private readonly _email: string;
    private readonly _passwordHash: string;
    private _isSigma: boolean;
    private readonly _createdAt: Date;
    private _updatedAt: Date;

    public constructor(
        id: string,
        username: string,
        email: string,
        passwordHash: string,
        isSigma: boolean,
        createdAt: Date,
        updatedAt: Date
    ) {
        this._id = Validator.string(id, 'id');
        this._username = Validator.string(username, 'username');
        this._email = Validator.email(email, 'email');
        this._passwordHash = Validator.string(passwordHash, 'passwordHash');
        this._isSigma = Validator.boolean(isSigma, 'isSigma');
        this._createdAt = Validator.date(createdAt, 'createdAt');
        this._updatedAt = Validator.date(updatedAt, 'updatedAt');
    }

    get id(): string { return this._id; }
    get username(): string { return this._username; }
    get email(): string { return this._email; }
    get passwordHash(): string { return this._passwordHash; }
    get isSigma(): boolean { return this._isSigma; }
    get createdAt(): Date { return this._createdAt; }
    get updatedAt(): Date { return this._updatedAt; }

    public updateInternalStatus(isSigma: boolean): void {
        this._isSigma = isSigma;
        this._updatedAt = new Date();
    }

    static get builder(): UserBuilder {
        return new UserBuilder();
    }
}
