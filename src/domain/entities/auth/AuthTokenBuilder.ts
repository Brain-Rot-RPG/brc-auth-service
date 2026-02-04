import { AuthToken } from './AuthToken.js';

export class AuthTokenBuilder {
    private _accessToken!: string;
    private _refreshToken!: string;
    private _expiresIn!: Date;
    private _userId!: string;

    /**
     * Définit le token d'accès (JWT)
     */
    accessToken(token: string): this {
        this._accessToken = token;
        return this;
    }

    /**
     * Définit le token de rafraîchissement
     */
    refreshToken(token: string): this {
        this._refreshToken = token;
        return this;
    }

    /**
     * Définit la durée de validité (en secondes ou timestamp ou Date)
     * Le constructeur de AuthToken se chargera de la convertir en Date via le Validator.
     */
    expiresIn(value: Date): this {
        this._expiresIn = value;
        return this;
    }

    /**
     * Lie le token à l'identifiant technique de l'utilisateur
     */
    userId(id: string): this {
        this._userId = id;
        return this;
    }

    /**
     * Produit l'instance d'AuthToken finale après validation
     */
    build(): AuthToken {
        return new AuthToken(
            this._accessToken,
            this._refreshToken,
            this._expiresIn,
            this._userId
        );
    }
}