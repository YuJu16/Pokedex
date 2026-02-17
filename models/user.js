import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Schéma pour les utilisateurs
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Le nom d\'utilisateur est requis'],
        unique: true,
        trim: true, // Supprime les espaces avant/après
        minlength: [3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères']
    },
    password: {
        type: String,
        required: [true, 'Le mot de passe est requis'],
        minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères']
    },
    favorites: {
        type: [Number], // Tableau d'IDs de Pokémon
        default: []
    }
}, {
    timestamps: true // Ajoute automatiquement createdAt et updatedAt
});

// Middleware pre-save : hash le mot de passe AVANT de l'enregistrer en base
// Ce middleware s'exécute automatiquement avant chaque .save() ou .create()
userSchema.pre('save', async function () {
    // Si le mot de passe n'a pas été modifié, on passe au suivant
    if (!this.isModified('password')) {
        return;
    }

    // Génère un "salt" (chaîne aléatoire) pour renforcer le hash
    // Le nombre 10 indique le "coût" du hash (plus c'est élevé, plus c'est sécurisé mais lent)
    const salt = await bcrypt.genSalt(10);

    // Hash le mot de passe avec le salt
    this.password = await bcrypt.hash(this.password, salt);
});

// Méthode pour comparer un mot de passe en clair avec le hash en base
// Utile pour la connexion
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
