# 🎮 PokéVerse — Pokédex Full-Stack

> ## ⚡ LANCER QUAND MEME LE PROJET CA VAUT LE COUP DE LE VOIR VISUELLEMENT ⚡

Application web complète de Pokédex avec authentification, gestion d'équipes, favoris, chatbot IA (Mimiqui / Métamorph), et plus encore — le tout avec un thème féérique inspiré de Nymphali (Sylveon). 💜

---

## 🗂️ Structure du projet

```
Pokedex/
├── index.js              # Point d'entrée du serveur Express (backend)
├── package.json          # Dépendances backend
├── .env                  # Variables d'environnement (⚠️ à créer)
├── .env.example          # Modèle de fichier .env
├── db/
│   ├── connect.js        # Connexion MongoDB
│   └── seed.js           # Script pour peupler la BDD
├── routes/
│   ├── pokemons.js       # CRUD Pokémon
│   ├── auth.js           # Inscription / Connexion (JWT)
│   ├── favorites.js      # Pokémon favoris
│   ├── teams.js          # Gestion d'équipes
│   ├── stats.js          # Statistiques
│   ├── chatbot.js        # Chatbot Mimiqui (Gemini AI)
│   └── akinator.js       # Jeu Akinator Métamorph (Gemini AI)
├── models/
│   ├── pokemon.js        # Modèle Mongoose Pokémon
│   ├── user.js           # Modèle Mongoose Utilisateur
│   └── team.js           # Modèle Mongoose Équipe
├── middleware/           # Middlewares Express
├── data/
│   └── PokemonListenPlus.json  # Données JSON de tous les Pokémon
├── assets/               # Images & assets statiques
└── frontend/             # Application React + Vite (frontend)
    ├── src/              # Code source React
    ├── public/           # Fichiers publics
    └── package.json      # Dépendances frontend
```

---

## 🛠️ Prérequis

Avant de commencer, assurez-vous d'avoir installé sur votre machine :

| Outil | Version minimale | Vérification |
|-------|-----------------|--------------|
| **Node.js** | v18+ | `node --version` |
| **npm** | v9+ | `npm --version` |
| **MongoDB** | v6+ | `mongod --version` |

---

## 🌿 1. Cloner le projet

```bash
git clone https://github.com/YuJu16/Pokedex.git
cd Pokedex
```

---

## 🔑 2. Configurer les variables d'environnement (`.env`)

À la racine du projet (`Pokedex/`), créez un fichier `.env` en vous basant sur `.env.example` :

```bash
# Copier le fichier exemple
cp .env.example .env
```

Puis renseignez toutes les valeurs dans `.env` :

```env
# ── Serveur ─────────────────────────────────────────
PORT=3000

# ── Base de données MongoDB ──────────────────────────
MONGODB_URI=mongodb://localhost:27017/Pokemon_noSQL

# ── URL de l'API (backend) ───────────────────────────
API_URL=http://localhost:3000

# ── Clé secrète JSON Web Token (JWT) ─────────────────
# ⚠️ Changez cette valeur pour quelque chose de long et aléatoire en production !
JWT_SECRET=votre_cle_secrete_super_securisee_a_changer_en_production

# ── Clés API Google Gemini (IA) ──────────────────────
# Clé pour le chatbot Mimiqui
GEMINI_API_KEY_MIMIQUI=VOTRE_CLE_GEMINI_ICI

# Clé pour le jeu Akinator Métamorph
GEMINI_API_KEY_DITTO=VOTRE_CLE_GEMINI_ICI
```

### 🤖 Obtenir les clés API Google Gemini (pour Mimiqui & Métamorph)

Les deux fonctionnalités IA du projet utilisent l'API **Google Gemini** (modèle `gemini-2.5-flash`) :
- **`GEMINI_API_KEY_MIMIQUI`** → chatbot Mimiqui (assistant Pokémon)
- **`GEMINI_API_KEY_DITTO`** → jeu Akinator Métamorph (devine le Pokémon)

> Vous pouvez utiliser la **même clé** pour les deux, ou créer deux projets séparés sur Google AI Studio.

**Étapes pour obtenir une clé :**

1. Rendez-vous sur [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Connectez-vous avec un compte Google
3. Cliquez sur **"Create API key"**
4. Copiez la clé générée et collez-la dans votre `.env`

> 💡 **Gratuit** : Google Gemini offre un quota gratuit généreux pour le développement.

---

## 🍃 3. Configurer MongoDB

### Option A — MongoDB en local (recommandé pour le développement)

1. **Installez MongoDB Community Edition** si ce n'est pas déjà fait :
   - Windows : [Télécharger ici](https://www.mongodb.com/try/download/community)
   - Lors de l'installation, cochez **"Install MongoDB as a Service"** pour qu'il démarre automatiquement.

2. **Vérifiez que MongoDB tourne** :
   ```bash
   # Windows (PowerShell)
   Get-Service -Name MongoDB

   # Ou lancez-le manuellement :
   mongod --dbpath "C:\data\db"
   ```

3. **Vérifiez votre `.env`** :
   ```env
   MONGODB_URI=mongodb://localhost:27017/Pokemon_noSQL
   ```

### Option B — MongoDB Atlas (cloud, sans installation)

1. Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un cluster gratuit (M0)
3. Dans "Database Access", créez un utilisateur avec un mot de passe
4. Dans "Network Access", autorisez votre IP (ou `0.0.0.0/0` pour tout autoriser en dev)
5. Cliquez sur "Connect" → "Connect your application" et copiez la chaîne de connexion
6. Remplacez dans `.env` :
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/Pokemon_noSQL?retryWrites=true&w=majority
   ```

---

## 📦 4. Installer les dépendances

### Backend (à la racine du projet)

```bash
# Depuis Pokedex/
npm install
```

### Frontend

```bash
# Depuis Pokedex/frontend/
cd frontend
npm install
```

---

## 🌱 5. Peupler la base de données (Seed)

Cette étape insère tous les Pokémon en base depuis le fichier `data/PokemonListenPlus.json`.

> ⚠️ **À faire une seule fois** (ou à relancer si vous voulez réinitialiser les données Pokémon).
> ⚠️ **MongoDB doit être démarré** avant d'exécuter cette commande.

```bash
# Depuis Pokedex/
npm run seed
```

**Sortie attendue :**
```
Connecté à MongoDB !
Collection vidée.
XXX Pokémon insérés avec succès !
Connexion fermée.
```

---

## 🚀 6. Lancer le projet

Il faut lancer **deux terminaux** en parallèle : un pour le **backend**, un pour le **frontend**.

### Terminal 1 — Lancer le backend (serveur Node.js)

```bash
# Depuis Pokedex/
npm run dev
```

**Sortie attendue :**
```
Connecté à MongoDB !
Server is running on http://localhost:3000
```

### Terminal 2 — Lancer le frontend (React + Vite)

```bash
# Depuis Pokedex/frontend/
cd frontend
npm run dev
```

**Sortie attendue :**
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 🌐 Accéder à l'application

| Service | URL |
|---------|-----|
| **Frontend (application)** | http://localhost:5173 |
| **Backend (API REST)** | http://localhost:3000 |
| **Test API racine** | http://localhost:3000/ → `Hello, World!` |

---

## 📡 API — Routes disponibles

| Méthode | Route | Description | Auth requise |
|---------|-------|-------------|-------------|
| `POST` | `/api/auth/register` | Créer un compte | ❌ |
| `POST` | `/api/auth/login` | Connexion (retourne JWT) | ❌ |
| `GET` | `/api/auth/me` | Profil utilisateur connecté | ✅ JWT |
| `PUT` | `/api/auth/me` | Modifier avatar/mot de passe | ✅ JWT |
| `GET` | `/api/pokemons` | Liste de tous les Pokémon | ❌ |
| `GET` | `/api/pokemons/:id` | Détail d'un Pokémon | ❌ |
| `GET` | `/api/favorites` | Pokémon favoris de l'utilisateur | ✅ JWT |
| `POST` | `/api/favorites` | Ajouter un favori | ✅ JWT |
| `DELETE` | `/api/favorites/:id` | Supprimer un favori | ✅ JWT |
| `GET` | `/api/teams` | Équipes de l'utilisateur | ✅ JWT |
| `POST` | `/api/teams` | Créer une équipe | ✅ JWT |
| `PUT` | `/api/teams/:id` | Modifier une équipe | ✅ JWT |
| `DELETE` | `/api/teams/:id` | Supprimer une équipe | ✅ JWT |
| `GET` | `/api/stats` | Statistiques globales | ❌ |
| `POST` | `/api/chatbot` | Chat avec Mimiqui (IA) | ❌ |
| `POST` | `/api/akinator` | Jeu Akinator Métamorph (IA) | ❌ |

---

## 🧠 Fonctionnalités IA

### 👻 Mimiqui — Chatbot Pokémon
- Propulsé par **Google Gemini 2.5 Flash**
- Personnalité : Mimiqui (#778), timide et attachant, répond en français
- Connaît tous les Pokémon, leurs types, évolutions, stratégies
- Variable d'env : `GEMINI_API_KEY_MIMIQUI`

### 🩷 Métamorph — Jeu Akinator Pokémon
- Propulsé par **Google Gemini 2.5 Flash**
- Devine à quel Pokémon vous pensez en posant des questions (style Akinator)
- Couvre les Gen 1 à Gen 9 (1000+ Pokémon)
- Interface avec boutons de réponse cliquables
- Variable d'env : `GEMINI_API_KEY_DITTO`

---

## 🔐 Authentification

Le système d'authentification utilise **JWT (JSON Web Token)** :
- Inscription : `POST /api/auth/register` avec `{ username, password, avatar? }`
- Connexion : `POST /api/auth/login` → retourne un **token valable 24h**
- Le token doit être envoyé dans le header des requêtes protégées :
  ```
  Authorization: Bearer <votre_token_jwt>
  ```
- Les mots de passe sont hashés avec **bcrypt** avant d'être stockés en base

---

## 🗃️ Modèles MongoDB

### `Pokemon`
Stocke les données de chaque Pokémon (nom, types, stats, image...) selon le fichier `data/PokemonListenPlus.json`.

### `User`
```json
{
  "username": "string (unique, requis)",
  "password": "string (hashé bcrypt, requis)",
  "avatar": "string (optionnel)"
}
```

### `Team`
Permet à chaque utilisateur de créer et gérer des équipes de Pokémon.

---

## ⚠️ Problèmes courants et solutions

### ❌ `Error connecting to MongoDB` / `MongooseServerSelectionError`
→ MongoDB n'est pas démarré. Lancez-le :
```powershell
# Windows — démarrer le service
Start-Service -Name MongoDB

# Ou manuellement
mongod
```

### ❌ `GEMINI_API_KEY_MIMIQUI is not defined` ou chatbot qui ne répond pas
→ Votre fichier `.env` est manquant ou la clé est mal configurée. Vérifiez que :
1. Le fichier `.env` existe à la **racine du projet** (et non dans `frontend/`)
2. Les clés ne contiennent pas d'espaces ni de guillemets

### ❌ `Cannot find module` ou erreurs d'import
→ Les dépendances ne sont pas installées. Relancez :
```bash
npm install         # dans Pokedex/
cd frontend && npm install  # dans Pokedex/frontend/
```

### ❌ Le frontend ne peut pas contacter le backend (erreur CORS / réseau)
→ Vérifiez que le backend tourne bien sur le port 3000. Vérifiez `API_URL` dans `.env`.

### ❌ `npm run seed` ne fonctionne pas / données absentes dans la BDD
→ Assurez-vous que MongoDB est démarré ET que votre `.env` est correctement configuré avant de lancer le seed.

---

## 📋 Récapitulatif des commandes

```bash
# 1. Installation
npm install                    # backend (racine)
cd frontend && npm install     # frontend

# 2. Seed (une seule fois)
npm run seed                   # depuis la racine

# 3. Lancement (2 terminaux)
npm run dev                    # Terminal 1 : backend (racine)
cd frontend && npm run dev     # Terminal 2 : frontend
```

---

## 🧰 Stack technique

| Couche | Technologie |
|--------|------------|
| **Frontend** | React 19, Vite 7, TailwindCSS 3, Framer Motion, React Router DOM |
| **Backend** | Node.js, Express 5, ES Modules |
| **Base de données** | MongoDB + Mongoose |
| **Authentification** | JWT (jsonwebtoken) + bcrypt |
| **IA / Chatbot** | Google Gemini 2.5 Flash (`@google/generative-ai`) |
| **HTTP Client** | Axios |
| **Dev tools** | Nodemon, ESLint |

---

*Projet réalisé dans le cadre du cours NoSQL — B3 Informatique 2025-2026* 🎓
