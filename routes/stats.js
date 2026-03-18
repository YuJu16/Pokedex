import express from 'express';
import Pokemon from '../models/pokemon.js';

const router = express.Router();

// GET /api/stats - Statistiques avancées avec agrégation MongoDB
router.get('/', async (req, res) => {
    try {
        // 1. Nombre de Pokémon par type + moyenne HP par type
        const pokemonsByType = await Pokemon.aggregate([
            // Étape 1 : Décomposer le tableau des types
            { $unwind: '$apiTypes' },

            // Étape 2 : Grouper par type et calculer les statistiques
            {
                $group: {
                    _id: '$apiTypes.name',
                    count: { $sum: 1 },
                    avgHP: { $avg: '$stats.HP' }
                }
            },

            // Étape 3 : Trier par nombre décroissant
            { $sort: { count: -1 } },

            // Étape 4 : Renommer le champ _id en 'type' pour plus de clarté
            {
                $project: {
                    _id: 0,
                    type: '$_id',
                    count: 1,
                    avgHP: { $round: ['$avgHP', 2] } // Arrondir à 2 décimales
                }
            }
        ]);

        // 2. Pokémon avec le plus d'attaque
        const strongestAttack = await Pokemon.aggregate([
            { $sort: { 'stats.attack': -1 } },
            { $limit: 1 },
            {
                $project: {
                    id: 1,
                    name: 1,
                    apiTypes: 1,
                    attack: '$stats.attack'
                }
            }
        ]);

        // 3. Pokémon avec le plus de HP
        const strongestHP = await Pokemon.aggregate([
            { $sort: { 'stats.HP': -1 } },
            { $limit: 1 },
            {
                $project: {
                    id: 1,
                    name: 1,
                    apiTypes: 1,
                    hp: '$stats.HP'
                }
            }
        ]);

        // 4. Statistiques globales bonus
        const globalStats = await Pokemon.aggregate([
            {
                $group: {
                    _id: null,
                    totalPokemon: { $sum: 1 },
                    avgHP: { $avg: '$stats.HP' },
                    avgAttack: { $avg: '$stats.attack' },
                    avgDefense: { $avg: '$stats.defense' },
                    maxHP: { $max: '$stats.HP' },
                    maxAttack: { $max: '$stats.attack' }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalPokemon: 1,
                    avgHP: { $round: ['$avgHP', 2] },
                    avgAttack: { $round: ['$avgAttack', 2] },
                    avgDefense: { $round: ['$avgDefense', 2] },
                    maxHP: 1,
                    maxAttack: 1
                }
            }
        ]);

        res.json({
            pokemonsByType,
            avgHPByType: pokemonsByType, // Même données, juste pour respecter la consigne
            strongestAttack: strongestAttack[0] || null,
            strongestHP: strongestHP[0] || null,
            globalStats: globalStats[0] || null
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
    }
});

export default router;
