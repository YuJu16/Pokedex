// Charger les variables d'environnement en PREMIER (avant tout autre import)
// dotenv lit le fichier .env et rend les variables accessibles via process.env
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import pokemonsRouter from './routes/pokemons.js';
import authRouter from './routes/auth.js';
import favoritesRouter from './routes/favorites.js';
import statsRouter from './routes/stats.js';
import teamsRouter from './routes/teams.js';
import connect from './db/connect.js';

// Connexion à MongoDB AVANT de lancer le serveur
await connect();


const app = express();

app.use(cors()); // Permet les requêtes cross-origin (ex: frontend sur un autre port)
app.use(express.json());

app.use('/assets', express.static('assets')); // Permet d'accéder aux fichiers dans le dossier "assets" via l'URL /assets/...



app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Routes d'authentification
app.use('/api/auth', authRouter);

// Routes Pokémon - utilise le router depuis routes/pokemons.js
app.use('/api/pokemons', pokemonsRouter);

// Routes favoris
app.use('/api/favorites', favoritesRouter);

// Routes statistiques
app.use('/api/stats', statsRouter);

// Routes équipes
app.use('/api/teams', teamsRouter);


app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT || 3000}`);
});