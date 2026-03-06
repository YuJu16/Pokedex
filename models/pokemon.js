import mongoose from "mongoose";

// Schéma flexible pour les types (objets avec name et image)
const apiTypeSchema = new mongoose.Schema({
    name: { type: String, required: true },
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

const pokemonSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: [true, 'L\'ID du Pokémon est requis'],
        unique: true,
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
        HP: { type: Number, default: 0 },
        attack: { type: Number, default: 0 },
        defense: { type: Number, default: 0 },
        special_attack: { type: Number, default: 0 },
        special_defense: { type: Number, default: 0 },
        speed: { type: Number, default: 0 }
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