import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Loader2, LogIn, Sparkles, Heart } from 'lucide-react';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = await login(username, password);

        if (result.success) {
            navigate('/pokedex');
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
                {/* Left Side - Visuals */}
                <div className="relative bg-gradient-to-br from-primary/20 to-secondary/20 p-8 flex flex-col justify-center items-center text-center overflow-hidden">
                    {/* Animated Background blobs for left side */}
                    <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-primary/30 rounded-full blur-[60px] animate-float" />
                    <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-white/40 rounded-full blur-[60px] animate-float transition-all delay-1000" />

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="relative z-10"
                    >
                        <div className="relative w-48 h-48 mx-auto mb-6">
                            <div className="absolute inset-0 bg-white/50 rounded-full blur-xl animate-pulse" />
                            <img
                                src="/cutelogo.png"
                                alt="Mascot"
                                className="w-full h-full object-contain relative z-10 drop-shadow-xl animate-float"
                            />
                            {/* Orbiting Elements */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 z-0"
                            >
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 text-primary">
                                    <Heart fill="currentColor" size={24} />
                                </div>
                            </motion.div>
                        </div>

                        <h2 className="text-3xl font-display font-bold text-primary mb-2 drop-shadow-sm">
                            Welcome Trainer!
                        </h2>
                        <p className="text-muted-foreground font-medium max-w-xs mx-auto">
                            Ready to continue your journey in the Pokéverse?
                        </p>
                    </motion.div>
                </div>

                {/* Right Side - Form */}
                <div className="p-8 md:p-12 bg-white/40 backdrop-blur-sm flex flex-col justify-center">
                    <div className="mb-8 text-center md:text-left">
                        <h3 className="text-2xl font-bold text-foreground/80 mb-1">Sign In</h3>
                        <p className="text-sm text-muted-foreground">Enter your credentials to access your Pokedex.</p>
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
                            <label className="text-sm font-bold text-foreground/70 ml-1">Username</label>
                            <input
                                type="text"
                                className="glass-input w-full bg-white/60 focus:bg-white transition-colors"
                                placeholder="Ash Ketchum"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-bold text-foreground/70 ml-1">Password</label>
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
                                    <span>Let's Go!</span>
                                    <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center flex flex-col gap-2 items-center">
                        <span className="text-sm text-muted-foreground">New to Pokéverse?</span>
                        <Link to="/register">
                            <button className="text-primary font-bold hover:text-primary/80 transition-colors flex items-center gap-1 group">
                                Create an account
                                <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
