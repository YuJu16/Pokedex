import mongoose from 'mongoose';

// Schéma pour les équipes Pokémon
const teamSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'L\'utilisateur est requis']
    },
    name: {
        type: String,
        required: [true, 'Le nom de l\'équipe est requis'],
        trim: true,
        minlength: [3, 'Le nom de l\'équipe doit contenir au moins 3 caractères'],
        maxlength: [50, 'Le nom de l\'équipe ne peut pas dépasser 50 caractères']
    },
    pokemons: {
        type: [Number], // Tableau d'IDs de Pokémon
        validate: {
            validator: function (pokemons) {
                return pokemons.length <= 6;
            },
            message: 'Une équipe ne peut contenir que 6 Pokémon maximum'
        },
        default: []
    }
}, {
    timestamps: true
});

const Team = mongoose.model('Team', teamSchema);

export default Team;
