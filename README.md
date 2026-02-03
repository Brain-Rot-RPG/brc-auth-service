# BRC Auth Service

> **Brain Rot Chronicles (BRC)** : Service centralisé de gestion de l'authentification.

Ce microservice assure la gestion des utilisateurs, la délivrance des tokens JWT (Access & Refresh) et la sécurisation des accès pour l'écosystème BRC. Il est conçu pour être performant, typé et facile à déployer via Docker.

## Installation et démarrage rapide

### 1. Prérequis

* **Node.js** v20+ (recommandé v22)
* **Docker & Docker Compose** (pour la base de données PostgreSQL)
* Un fichier `.env` configuré (voir section [Configuration](#configuration))

### 2. Installation

```bash
# Installation des dépendances
npm install

# Build du projet (TypeScript -> JavaScript)
npm run build
```

### 3. Lancer l'application

| Mode              | Commande        | Description                                     |
|-------------------|-----------------|-------------------------------------------------|
| **Développement** | `npm run dev`   | Relancement automatique (hot-reload) via `tsx`. |
| **Production**    | `npm run start` | Exécute le code compilé dans `/dist`.           |

## Commandes de qualité et de tests

Nous utilisons une suite d'outils rigoureux pour maintenir la "Aura" du code :

* **Linting** : `npm run lint` (vérifie) ou `npm run lint:fix` (corrige).
* **Tests unitaires** : `npm run test` (Jest avec rapport de couverture).
* **Nettoyage** : `npm run clean` (supprime le dossier `/dist`).

## Conteneurisation

Le service nécessite une base de données PostgreSQL pour fonctionner.

### Lancer l'infrastructure (Base de données)

Utile pour développer en local avec la base de données prête :

```bash
docker compose up -d
```

*Note : Cette commande démarre uniquement le conteneur PostgreSQL `brc-auth-db`.*

## Configuration

Crée un fichier `.env` à la racine (basé sur `.env.example`). Voici les variables utilisées :

```ini
# Server Configuration
PORT=4007
NODE_ENV=development # 'production' en prod

# Database Configuration (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=brainrot_secure
DB_NAME=auth_db

# Security (JWT)
JWT_SECRET=change_this_to_something_actually_secure_please
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
```
