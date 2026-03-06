// Charger les variables d'environnement EN PREMIER
import 'dotenv/config';

import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connect from './connect.js';
import Pokemon from '../models/pokemon.js';

// Charger les données JSON
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pokemonsData = JSON.parse(
    readFileSync(join(__dirname, '../data/PokemonListenPlus.json'), 'utf-8')
);

// Fonction principale de seed
const seedDatabase = async () => {
    try {
        // 1. Connexion à MongoDB
        await connect();

        // 2. Supprimer les anciens documents (pour pouvoir relancer le script)
        await Pokemon.deleteMany({});
        console.log('Collection vidée.');

        // 3. Insérer tous les Pokémon
        await Pokemon.insertMany(pokemonsData);
        console.log(`${pokemonsData.length} Pokémon insérés avec succès !`);

        // 4. Fermer la connexion
        await mongoose.connection.close();
        console.log('Connexion fermée.');

        process.exit(0); // Sortie propre
    } catch (error) {
        console.error('Erreur lors du seed:', error);
        process.exit(1);
    }
};

// Lancer le seed
seedDatabase();
