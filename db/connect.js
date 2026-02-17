import mongoose from 'mongoose';

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connecté à MongoDB !');
    } catch (error) {
        console.error('Erreur de connexion à MongoDB:', error);
        process.exit(1); // Arrête le serveur si la connexion échoue
    }
};

export default connect;
