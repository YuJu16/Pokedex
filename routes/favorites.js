import express from 'express';
import User from '../models/user.js';
import Pokemon from '../models/pokemon.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// POST /api/favorites/:pokemonId - Ajouter un Pokémon aux favoris
router.post('/:pokemonId', auth, async (req, res) => {
    try {
        const pokemonId = parseInt(req.params.pokemonId);

        // Vérifier que le Pokémon existe
        const pokemon = await Pokemon.findOne({ id: pokemonId });
        if (!pokemon) {
            return res.status(404).json({ error: 'Pokémon non trouvé' });
        }

        // Ajouter aux favoris avec $addToSet (évite les doublons)
        await User.findByIdAndUpdate(
            req.user.id,
            { $addToSet: { favorites: pokemonId } }
        );

        res.json({
            message: `${pokemon.name.french} ajouté aux favoris`,
            pokemonId
        });
    } catch (error) {
        console.error('Error adding favorite:', error);
        res.status(500).json({ error: 'Erreur lors de l\'ajout aux favoris' });
    }
});

// DELETE /api/favorites/:pokemonId - Retirer un Pokémon des favoris
router.delete('/:pokemonId', auth, async (req, res) => {
    try {
        const pokemonId = parseInt(req.params.pokemonId);

        // Retirer des favoris avec $pull
        await User.findByIdAndUpdate(
            req.user.id,
            { $pull: { favorites: pokemonId } }
        );

        res.json({
            message: 'Pokémon retiré des favoris',
            pokemonId
        });
    } catch (error) {
        console.error('Error removing favorite:', error);
        res.status(500).json({ error: 'Erreur lors du retrait des favoris' });
    }
});

// GET /api/favorites - Lister mes Pokémon favoris
router.get('/', auth, async (req, res) => {
    try {
        // Récupérer l'utilisateur avec ses favoris
        const user = await User.findById(req.user.id);

        if (!user || !user.favorites || user.favorites.length === 0) {
            return res.json({
                message: 'Aucun favori',
                favorites: []
            });
        }

        // Récupérer les détails des Pokémon favoris
        const favoritePokemon = await Pokemon.find({
            id: { $in: user.favorites }
        });

        res.json({
            count: favoritePokemon.length,
            favorites: favoritePokemon
        });
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des favoris' });
    }
});

export default router;
