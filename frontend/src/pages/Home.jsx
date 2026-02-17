import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

const FloatingButtonIcons = () => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-visible">
            {/* Top Left Heart */}
            <motion.div
                initial={{ opacity: 0, scale: 0, y: 10, x: -5 }}
                animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5], y: -30, x: -20 }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
                className="absolute top-0 left-4 text-pink-400"
            >
                <Heart size={16} fill="currentColor" />
            </motion.div>

            {/* Top Right Sparkle */}
            <motion.div
                initial={{ opacity: 0, scale: 0, y: 10, x: 5 }}
                animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5], y: -35, x: 25 }}
                transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 0.2, delay: 0.3 }}
                className="absolute top-0 right-4 text-yellow-300"
            >
                <Sparkles size={14} fill="currentColor" />
            </motion.div>

            {/* Bottom Left Sparkle */}
            <motion.div
                initial={{ opacity: 0, scale: 0, y: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], y: -20, x: -15 }}
                transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.8, delay: 0.6 }}
                className="absolute bottom-2 left-2 text-pink-300"
            >
                <Sparkles size={10} fill="currentColor" />
            </motion.div>

            {/* Center Top Heart */}
            <motion.div
                initial={{ opacity: 0, scale: 0, y: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], y: -40 }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
                className="absolute -top-4 left-1/2 -translate-x-1/2 text-pink-500"
            >
                <Heart size={12} fill="currentColor" />
            </motion.div>
        </div>
    );
};

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h1 className="text-6xl font-display font-bold mb-6 text-primary drop-shadow-sm">
                Welcome to Pokéverse
            </h1>
            <p className="text-xl text-foreground/80 max-w-2xl mb-8 font-medium">
                Your ultimate cute Pokédex experience. Explore Generation 1 Pokémon with lovely visuals and manage your dream team.
            </p>
            <div className="flex gap-4 relative group">
                <Link to="/pokedex">
                    <button className="relative px-8 py-4 bg-white text-primary font-display font-bold text-xl rounded-full shadow-[0_0_30px_rgba(255,145,164,0.6)] hover:shadow-[0_0_50px_rgba(255,145,164,0.9)] hover:scale-105 transition-all duration-300 border-2 border-white/50 overflow-visible flex items-center gap-3">
                        Start Exploring
                        <img src="/mew_.gif" alt="Mew" className="w-8 h-8 object-contain" />

                        {/* Floating Hearts on Hover */}
                        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <FloatingButtonIcons />
                        </div>
                    </button>
                </Link>
            </div>
        </div>
    )
}
