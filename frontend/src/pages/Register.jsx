import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Loader2, PlusCircle, Sparkles, Star, Check } from 'lucide-react';
import { cn } from '../lib/utils';

// Avatars disponibles (Pokémon populaires via PokeAPI sprites)
const AVATARS = [
    { id: 1, name: 'Pikachu', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png' },
    { id: 2, name: 'Psykokwak', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png' },
    { id: 3, name: 'Mew', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png' },
    { id: 4, name: 'Bulbizarre', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png' },
    { id: 5, name: 'Salamèche', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png' },
    { id: 6, name: 'Carapuce', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png' },
    { id: 7, name: 'Rondoudou', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png' },
    { id: 8, name: 'Nymphali', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/700.png' },
    { id: 9, name: 'Mimiqui', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/778.png' },
];

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0].url);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = await register(username, password, selectedAvatar);

        if (result.success) {
            navigate('/login');
        } else {
            setError(result.error);
        }
        setIsLoading(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center min-h-[70vh] w-full"
        >
            <div className="glass-panel w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 overflow-hidden shadow-2xl border-white/40">
                {/* Left Side - Avatar Picker */}
                <div className="relative bg-gradient-to-br from-secondary/20 to-primary/20 p-8 flex flex-col justify-center items-center text-center overflow-hidden">
                    {/* Animated Background blobs */}
                    <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-secondary/30 rounded-full blur-[60px] animate-float" />
                    <div className="absolute bottom-[-20%] left-[-20%] w-[80%] h-[80%] bg-white/40 rounded-full blur-[60px] animate-float transition-all delay-1000" />

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="relative z-10 w-full"
                    >
                        {/* Selected Avatar Preview */}
                        <div className="relative w-32 h-32 mx-auto mb-4">
                            <div className="absolute inset-0 bg-white/50 rounded-full blur-xl animate-pulse" />
                            <img
                                src={selectedAvatar}
                                alt="Avatar sélectionné"
                                className="w-full h-full object-contain relative z-10 drop-shadow-xl"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 z-0"
                            >
                                <div className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-4 text-secondary">
                                    <Star fill="currentColor" size={24} />
                                </div>
                            </motion.div>
                        </div>

                        <h2 className="text-2xl font-display font-bold text-secondary mb-1 drop-shadow-sm">
                            Choisis ton avatar !
                        </h2>
                        <p className="text-muted-foreground font-medium text-sm mb-4">
                            Quel Pokémon te représente ?
                        </p>

                        {/* Avatar Grid */}
                        <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto">
                            {AVATARS.map((avatar) => (
                                <motion.button
                                    key={avatar.id}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedAvatar(avatar.url)}
                                    className={cn(
                                        "relative w-20 h-20 rounded-2xl p-2 transition-all border-3",
                                        selectedAvatar === avatar.url
                                            ? "bg-white shadow-lg border-primary ring-2 ring-primary/30"
                                            : "bg-white/50 border-transparent hover:bg-white/80 hover:shadow-md"
                                    )}
                                >
                                    <img
                                        src={avatar.url}
                                        alt={avatar.name}
                                        className="w-full h-full object-contain"
                                    />
                                    {selectedAvatar === avatar.url && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-1 -right-1 bg-primary text-white rounded-full p-0.5 shadow-md"
                                        >
                                            <Check size={12} strokeWidth={3} />
                                        </motion.div>
                                    )}
                                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-bold text-foreground/60 bg-white/80 px-1.5 rounded-full">
                                        {avatar.name}
                                    </span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Right Side - Form */}
                <div className="p-8 md:p-12 bg-white/40 backdrop-blur-sm flex flex-col justify-center">
                    <div className="mb-8 text-center md:text-left">
                        <h3 className="text-2xl font-bold text-foreground/80 mb-1">Créer un compte</h3>
                        <p className="text-sm text-muted-foreground">Rejoins la communauté de Dresseurs Pokémon !</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="bg-red-100/80 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2"
                        >
                            <Sparkles size={16} />
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-foreground/70 ml-1">Nom d'utilisateur</label>
                            <input
                                type="text"
                                className="glass-input w-full bg-white/60 focus:bg-white transition-colors"
                                placeholder="SachaKetchum"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-bold text-foreground/70 ml-1">Mot de passe</label>
                            <input
                                type="password"
                                className="glass-input w-full bg-white/60 focus:bg-white transition-colors"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="glass-button-primary w-full flex justify-center items-center gap-2 mt-2 group shadow-lg shadow-primary/20 hover:shadow-primary/40"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <span>Créer mon compte</span>
                                    <PlusCircle size={18} className="group-hover:rotate-90 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center flex flex-col gap-2 items-center">
                        <span className="text-sm text-muted-foreground">Déjà un compte ?</span>
                        <Link to="/login">
                            <button className="text-primary font-bold hover:text-primary/80 transition-colors flex items-center gap-1 group">
                                Se connecter
                                <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
