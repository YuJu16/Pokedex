import jwt from 'jsonwebtoken';

// Middleware d'authentification JWT
// Ce middleware vérifie que l'utilisateur a un token valide avant d'accéder à une route protégée
const auth = async (req, res, next) => {
    try {
        // 1. Récupérer le token depuis le header Authorization
        // Format attendu : "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
        const authHeader = req.headers.authorization;

        // Vérifier que le header existe et commence par "Bearer "
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Accès refusé. Token manquant ou invalide.'
            });
        }

        // Extraire le token (enlever "Bearer " du début)
        const token = authHeader.substring(7); // ou authHeader.split(' ')[1]

        // 2. Vérifier et décoder le token avec la clé secrète
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Ajouter les informations de l'utilisateur décodées à la requête
        // Elles seront accessibles dans les routes qui utilisent ce middleware
        req.user = decoded;

        // 4. Passer au middleware/route suivante
        next();
    } catch (error) {
        // Gestion des erreurs JWT spécifiques
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Token invalide' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expiré' });
        }

        console.error('Auth middleware error:', error);
        res.status(401).json({ error: 'Erreur d\'authentification' });
    }
};

export default auth;
