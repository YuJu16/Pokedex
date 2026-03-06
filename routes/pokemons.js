import express from 'express';
import Pokemon from '../models/pokemon.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET /api/pokemons - Retourne tous les Pokémon avec filtres, tri et pagination
router.get('/', async (req, res) => {
    try {
        // 1. Construction du filtre
        const filter = {};

        // Filtre par type (ex: ?type=Feu)
        if (req.query.type) {
            filter['apiTypes.name'] = req.query.type;
        }

        // Recherche par nom (ex: ?name=pika)
        if (req.query.name) {
            filter.name = {
                $regex: req.query.name,
                $options: 'i' // Insensible à la casse
            };
        }

        // 2. Pagination
        const page = parseInt(req.query.page) || 1; // Défaut : page 1
        const limit = parseInt(req.query.limit) || 1500; // Défaut : 1500 résultats (tous les Pokémon)
        const skip = (page - 1) * limit;

        // 3. Tri (ex: ?sort=name.french ou ?sort=-base.HP)
        const sort = req.query.sort || 'id'; // Défaut : tri par ID

        // 4. Exécution de la requête avec tous les paramètres
        const pokemonsList = await Pokemon.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit);

        // 5. Compte total pour la pagination
        const total = await Pokemon.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);

        // 6. Réponse avec métadonnées de pagination
        res.json({
            data: pokemonsList,
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        });
    } catch (error) {
        console.error('Error fetching pokemons:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des Pokémon' });
    }
});

// GET /api/pokemons/:id - Retourne un Pokémon par son ID
router.get('/:id', async (req, res) => {
    try {
        const pokemonId = parseInt(req.params.id); // Convertit l'ID en nombre

        // Vérifie que l'ID est un nombre valide
        if (isNaN(pokemonId)) {
            return res.status(400).json({ error: 'ID invalide' });
        }

        // Cherche le Pokémon avec cet ID
        const pokemon = await Pokemon.findOne({ id: pokemonId });

        if (!pokemon) {
            return res.status(404).json({ error: `Pokémon avec l'ID ${pokemonId} non trouvé` });
        }

        res.json(pokemon);
    } catch (error) {
        console.error('Error fetching pokemon:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération du Pokémon' });
    }
});

// POST /api/pokemons - Crée un nouveau Pokémon (PROTÉGÉ - nécessite authentification)
router.post('/', auth, async (req, res) => {
    try {
        const newPokemon = await Pokemon.create(req.body);
        res.status(201).json(newPokemon); // 201 = Created
    } catch (error) {
        console.error('Error creating pokemon:', error);

        // Erreur de validation Mongoose ou doublon
        if (error.name === 'ValidationError' || error.code === 11000) {
            return res.status(400).json({
                error: 'Données invalides ou Pokémon déjà existant',
                details: error.message
            });
        }

        res.status(500).json({ error: 'Erreur lors de la création du Pokémon' });
    }
});

// PUT /api/pokemons/:id - Modifie un Pokémon existant (PROTÉGÉ - nécessite authentification)
router.put('/:id', auth, async (req, res) => {
    try {
        const pokemonId = parseInt(req.params.id);

        if (isNaN(pokemonId)) {
            return res.status(400).json({ error: 'ID invalide' });
        }

        // findOneAndUpdate avec { new: true } retourne le document APRÈS modification
        const updatedPokemon = await Pokemon.findOneAndUpdate(
            { id: pokemonId },
            req.body,
            { new: true, runValidators: true } // runValidators applique les validations du schéma
        );

        if (!updatedPokemon) {
            return res.status(404).json({ error: `Pokémon avec l'ID ${pokemonId} non trouvé` });
        }

        res.json(updatedPokemon);
    } catch (error) {
        console.error('Error updating pokemon:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                error: 'Données invalides',
                details: error.message
            });
        }

        res.status(500).json({ error: 'Erreur lors de la modification du Pokémon' });
    }
});

// DELETE /api/pokemons/:id - Supprime un Pokémon (PROTÉGÉ - nécessite authentification)
router.delete('/:id', auth, async (req, res) => {
    try {
        const pokemonId = parseInt(req.params.id);

        if (isNaN(pokemonId)) {
            return res.status(400).json({ error: 'ID invalide' });
        }

        const deletedPokemon = await Pokemon.findOneAndDelete({ id: pokemonId });

        if (!deletedPokemon) {
            return res.status(404).json({ error: `Pokémon avec l'ID ${pokemonId} non trouvé` });
        }

        // 204 = No Content (suppression réussie, pas de contenu à retourner)
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting pokemon:', error);
        res.status(500).json({ error: 'Erreur lors de la suppression du Pokémon' });
    }
});

export default router;
