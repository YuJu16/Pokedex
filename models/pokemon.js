import mongoose from "mongoose";

// Liste des types autorisés selon le sujet
const allowedTypes = [
    'Normal', 'Feu', 'Eau', 'Électrik', 'Plante', 'Glace', 'Combat', 'Poison', 
    'Sol', 'Vol', 'Psy', 'Insecte', 'Roche', 'Spectre', 'Dragon', 'Ténèbres', 'Acier', 'Fée'
];

// Schéma flexible pour les types (objets avec name et image)
const apiTypeSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Le type est requis'],
        enum: {
            values: allowedTypes,
            message: '{VALUE} n\'est pas un type de Pokémon valide'
        }
    },
    image: { type: String }
}, { _id: false });

// Schéma pour les résistances
const resistanceSchema = new mongoose.Schema({
    name: { type: String },
    damage_multiplier: { type: Number },
    damage_relation: { type: String }
}, { _id: false });

// Schéma pour les évolutions
const evolutionSchema = new mongoose.Schema({
    name: { type: String },
    pokedexId: { type: Number }
}, { _id: false });

// Fonction de validation pour les stats (1 à 255)
const statValidation = {
    type: Number,
    required: true,
    min: [1, 'La statistique doit être d\'au moins 1'],
    max: [255, 'La statistique ne peut pas dépasser 255']
};

const pokemonSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: [true, 'L\'ID du Pokémon est requis'],
        unique: true,
        validate: {
            validator: Number.isInteger,
            message: 'L\'ID doit être un entier'
        },
        min: [1, 'L\'ID doit être un nombre positif (minimum 1)']
    },
    pokedexId: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: [true, 'Le nom du Pokémon est requis']
    },
    image: {
        type: String,
        required: [true, 'L\'image est requise']
    },
    sprite: {
        type: String
    },
    slug: {
        type: String
    },
    stats: {
        HP: statValidation,
        attack: statValidation,
        defense: statValidation,
        special_attack: statValidation,
        special_defense: statValidation,
        speed: statValidation
    },
    apiTypes: [apiTypeSchema],
    apiGeneration: {
        type: Number,
        default: 1
    },
    apiResistances: [resistanceSchema],
    resistanceModifyingAbilitiesForApi: {
        type: mongoose.Schema.Types.Mixed,
        default: []
    },
    apiEvolutions: [evolutionSchema],
    apiPreEvolution: {
        type: mongoose.Schema.Types.Mixed,
        default: "none"
    },
    apiResistancesWithAbilities: [resistanceSchema]
});

//  pokemon est le nom de la collection dans la base de données MongoDB. il y aura une collection nommée "pokemons"
export default mongoose.model("pokemon", pokemonSchema);