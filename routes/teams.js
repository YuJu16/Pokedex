import express from 'express';
import Team from '../models/team.js';
import Pokemon from '../models/pokemon.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// POST /api/teams - Créer une nouvelle équipe
router.post('/', auth, async (req, res) => {
    try {
        const { name, pokemons } = req.body;

        // Validation
        if (!name) {
            return res.status(400).json({ error: 'Le nom de l\'équipe est requis' });
        }

        if (pokemons && pokemons.length > 6) {
            return res.status(400).json({ error: 'Une équipe ne peut contenir que 6 Pokémon maximum' });
        }

        // Vérifier que tous les Pokémon existent
        if (pokemons && pokemons.length > 0) {
            const existingPokemon = await Pokemon.find({ id: { $in: pokemons } });
            if (existingPokemon.length !== pokemons.length) {
                return res.status(400).json({ error: 'Un ou plusieurs Pokémon n\'existent pas' });
            }
        }

        // Créer l'équipe
        const team = await Team.create({
            user: req.user.id,
            name,
            pokemons: pokemons || []
        });

        res.status(201).json(team);
    } catch (error) {
        console.error('Error creating team:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                error: 'Données invalides',
                details: error.message
            });
        }

        res.status(500).json({ error: 'Erreur lors de la création de l\'équipe' });
    }
});

// GET /api/teams - Lister mes équipes
router.get('/', auth, async (req, res) => {
    try {
        const teams = await Team.find({ user: req.user.id })
            .sort({ createdAt: -1 }); // Plus récentes en premier

        res.json({
            count: teams.length,
            teams
        });
    } catch (error) {
        console.error('Error fetching teams:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des équipes' });
    }
});

// GET /api/teams/:id - Détails d'une équipe avec les Pokémon complets
router.get('/:id', auth, async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({ error: 'Équipe non trouvée' });
        }

        // Vérifier que l'équipe appartient à l'utilisateur
        if (team.user.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Accès refusé à cette équipe' });
        }

        // Récupérer les détails complets des Pokémon
        const pokemonDetails = await Pokemon.find({
            id: { $in: team.pokemons }
        });

        res.json({
            ...team.toObject(),
            pokemonDetails
        });
    } catch (error) {
        console.error('Error fetching team:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'ID d\'équipe invalide' });
        }

        res.status(500).json({ error: 'Erreur lors de la récupération de l\'équipe' });
    }
});

// PUT /api/teams/:id - Modifier une équipe
router.put('/:id', auth, async (req, res) => {
    try {
        const { name, pokemons } = req.body;

        // Vérifier que l'équipe existe et appartient à l'utilisateur
        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({ error: 'Équipe non trouvée' });
        }

        if (team.user.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Accès refusé à cette équipe' });
        }

        // Validation
        if (pokemons && pokemons.length > 6) {
            return res.status(400).json({ error: 'Une équipe ne peut contenir que 6 Pokémon maximum' });
        }

        // Vérifier que tous les Pokémon existent
        if (pokemons && pokemons.length > 0) {
            const existingPokemon = await Pokemon.find({ id: { $in: pokemons } });
            if (existingPokemon.length !== pokemons.length) {
                return res.status(400).json({ error: 'Un ou plusieurs Pokémon n\'existent pas' });
            }
        }

        // Mettre à jour
        const updatedTeam = await Team.findByIdAndUpdate(
            req.params.id,
            { name, pokemons },
            { new: true, runValidators: true }
        );

        res.json(updatedTeam);
    } catch (error) {
        console.error('Error updating team:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                error: 'Données invalides',
                details: error.message
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'ID d\'équipe invalide' });
        }

        res.status(500).json({ error: 'Erreur lors de la modification de l\'équipe' });
    }
});

// DELETE /api/teams/:id - Supprimer une équipe
router.delete('/:id', auth, async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({ error: 'Équipe non trouvée' });
        }

        // Vérifier que l'équipe appartient à l'utilisateur
        if (team.user.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Accès refusé à cette équipe' });
        }

        await Team.findByIdAndDelete(req.params.id);

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting team:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'ID d\'équipe invalide' });
        }

        res.status(500).json({ error: 'Erreur lors de la suppression de l\'équipe' });
    }
});

export default router;
