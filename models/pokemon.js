import mongoose from "mongoose";

// Liste des 18 types Pokémon autorisés
const POKEMON_TYPES = [
    'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice',
    'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug',
    'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'
];

const pokemonSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: [true, 'L\'ID du Pokémon est requis'],
        unique: true,
        min: [1, 'L\'ID doit être un nombre positif (minimum 1)']
    },
    name: {
        english: { type: String },
        japanese: { type: String },
        chinese: { type: String },
        french: {
            type: String,
            required: [true, 'Le nom français est requis']
        },
    },
    type: {
        type: [String],
        required: [true, 'Au moins un type est requis'],
        validate: {
            validator: function (types) {
                // Vérifie que tous les types sont dans la liste autorisée
                return types.every(type => POKEMON_TYPES.includes(type));
            },
            message: props => `Type invalide. Types autorisés : ${POKEMON_TYPES.join(', ')}`
        }
    },
    base: {
        HP: {
            type: Number,
            required: [true, 'Les HP sont requis'],
            min: [1, 'Les HP doivent être entre 1 et 255'],
            max: [255, 'Les HP doivent être entre 1 et 255']
        },
        Attack: {
            type: Number,
            required: [true, 'L\'Attaque est requise'],
            min: [1, 'L\'Attaque doit être entre 1 et 255'],
            max: [255, 'L\'Attaque doit être entre 1 et 255']
        },
        Defense: {
            type: Number,
            required: [true, 'La Défense est requise'],
            min: [1, 'La Défense doit être entre 1 et 255'],
            max: [255, 'La Défense doit être entre 1 et 255']
        },
        SpecialAttack: {
            type: Number,
            required: [true, 'L\'Attaque Spéciale est requise'],
            min: [1, 'L\'Attaque Spéciale doit être entre 1 et 255'],
            max: [255, 'L\'Attaque Spéciale doit être entre 1 et 255']
        },
        SpecialDefense: {
            type: Number,
            required: [true, 'La Défense Spéciale est requise'],
            min: [1, 'La Défense Spéciale doit être entre 1 et 255'],
            max: [255, 'La Défense Spéciale doit être entre 1 et 255']
        },
        Speed: {
            type: Number,
            required: [true, 'La Vitesse est requise'],
            min: [1, 'La Vitesse doit être entre 1 et 255'],
            max: [255, 'La Vitesse doit être entre 1 et 255']
        },
    },
    image: {
        type: String,
        required: [true, 'L\'image est requise'],
    },
});

//  pokemon est le nom de la collection dans la base de données MongoDB. il y aura une collection nommée "pokemons"
export default mongoose.model("pokemon", pokemonSchema);