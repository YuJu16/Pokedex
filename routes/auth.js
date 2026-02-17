import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const router = express.Router();

// POST /api/auth/register - Inscription d'un nouvel utilisateur
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validation : vérifier que username et password sont fournis
        if (!username || !password) {
            return res.status(400).json({
                error: 'Le nom d\'utilisateur et le mot de passe sont requis'
            });
        }

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({
                error: 'Ce nom d\'utilisateur est déjà utilisé'
            });
        }

        // Créer l'utilisateur (le pre-save hashera automatiquement le mot de passe)
        const newUser = await User.create({ username, password });

        // Retourner un message de succès (SANS le mot de passe)
        res.status(201).json({
            message: 'Utilisateur créé avec succès',
            user: {
                id: newUser._id,
                username: newUser.username
            }
        });
    } catch (error) {
        console.error('❌ Error during registration:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Full error:', JSON.stringify(error, null, 2));

        // Gestion des erreurs de validation Mongoose
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                error: 'Données invalides',
                details: error.message
            });
        }

        res.status(500).json({ error: 'Erreur lors de l\'inscription' });
    }
});

// POST /api/auth/login - Connexion d'un utilisateur
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validation
        if (!username || !password) {
            return res.status(400).json({
                error: 'Le nom d\'utilisateur et le mot de passe sont requis'
            });
        }

        // Chercher l'utilisateur en base
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({
                error: 'Nom d\'utilisateur ou mot de passe incorrect'
            });
        }

        // Comparer le mot de passe fourni avec le hash en base
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Nom d\'utilisateur ou mot de passe incorrect'
            });
        }

        // Générer un JWT (JSON Web Token)
        // Le token contient l'ID de l'utilisateur et expire après 24h
        const token = jwt.sign(
            { id: user._id, username: user.username }, // Payload (données encodées dans le token)
            process.env.JWT_SECRET, // Clé secrète pour signer le token
            { expiresIn: '24h' } // Durée de validité
        );

        // Retourner le token
        res.json({
            message: 'Connexion réussie',
            token
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
});

export default router;
