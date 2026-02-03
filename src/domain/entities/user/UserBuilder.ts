import {randomUUID} from 'node:crypto';

import {User} from './User.js';

export class UserBuilder {
    private _id!: string;
    private _username!: string;
    private _email!: string;
    private _passwordHash!: string;
    private _isSigma: boolean = false;
    private _createdAt!: Date;
    private _updatedAt!: Date;

    constructor() {
        this._createdAt = new Date();
        this._updatedAt = new Date();
    }

    withId(id: string): this {
        this._id = id;
        return this;
    }

    withNewId(): this {
        this._id = randomUUID();
        return this;
    }

    username(username: string): this {
        this._username = username;
        return this;
    }

    email(email: string): this {
        this._email = email;
        return this;
    }

    passwordHash(hash: string): this {
        this._passwordHash = hash;
        return this;
    }

    sigma(isSigma: boolean = true): this {
        this._isSigma = isSigma;
        return this;
    }

    dates(createdAt: Date, updatedAt: Date): this {
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
        return this;
    }

    build(): User {
        return new User(
            this._id,
            this._username,
            this._email,
            this._passwordHash,
            this._isSigma,
            this._createdAt,
            this._updatedAt
        );
    }
}