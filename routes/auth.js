import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const router = express.Router();

// Middleware pour vérifier le token JWT
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token manquant' });
    }
    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token invalide' });
    }
};

// GET /api/auth/me - Récupérer le profil de l'utilisateur connecté
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        res.json({
            id: user._id,
            username: user.username,
            avatar: user.avatar
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// PUT /api/auth/me - Mettre à jour le profil (avatar et/ou mot de passe)
router.put('/me', authMiddleware, async (req, res) => {
    try {
        const { avatar, currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        // Changement de mot de passe
        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ error: 'Le mot de passe actuel est requis' });
            }
            const isValid = await user.comparePassword(currentPassword);
            if (!isValid) {
                return res.status(401).json({ error: 'Mot de passe actuel incorrect' });
            }
            user.password = newPassword;
        }

        // Changement d'avatar
        if (avatar) {
            user.avatar = avatar;
        }

        await user.save();

        res.json({
            message: 'Profil mis à jour',
            user: { id: user._id, username: user.username, avatar: user.avatar }
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour du profil' });
    }
});

// POST /api/auth/register - Inscription d'un nouvel utilisateur
router.post('/register', async (req, res) => {
    try {
        const { username, password, avatar } = req.body;

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

        // Créer l'utilisateur avec l'avatar optionnel
        const userData = { username, password };
        if (avatar) userData.avatar = avatar;

        const newUser = await User.create(userData);

        // Retourner un message de succès (SANS le mot de passe)
        res.status(201).json({
            message: 'Utilisateur créé avec succès',
            user: {
                id: newUser._id,
                username: newUser.username,
                avatar: newUser.avatar
            }
        });
    } catch (error) {
        console.error('❌ Error during registration:', error);

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

        // Générer un JWT avec les infos utilisateur
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Retourner le token ET les infos utilisateur
        res.json({
            message: 'Connexion réussie',
            token,
            user: {
                id: user._id,
                username: user.username,
                avatar: user.avatar
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
});

export default router;
