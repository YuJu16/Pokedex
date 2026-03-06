import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl -z-10" />

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10"
            >
                <div className="relative inline-block">
                    {/* Glow behind Mew */}
                    <div className="absolute inset-0 bg-white/40 blur-2xl rounded-full scale-110" />

                    <img
                        src="/img/mewSleep.gif"
                        alt="Mew sleeping"
                        className="relative z-10 w-64 h-64 object-contain drop-shadow-xl"
                    />

                    {/* Zzz animation */}
                    <motion.div
                        className="absolute -top-4 right-10 text-3xl font-display font-bold text-primary"
                        animate={{
                            opacity: [0, 1, 0],
                            y: [0, -20, -40],
                            x: [0, 10, 20],
                            rotate: [0, 10, -10]
                        }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            repeatDelay: 0.5
                        }}
                    >
                        Zzz...
                    </motion.div>
                </div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-poke-darkRed mb-2 mt-4"
                >
                    404
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-xl text-foreground/80 font-medium mb-8 max-w-md mx-auto"
                >
                    Chut... Mew dort ! <br />
                    On dirait que cette page n'existe pas.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <Link to="/">
                        <button className="glass-button-primary flex items-center gap-2 group mx-auto">
                            <Home size={20} className="group-hover:-translate-y-1 transition-transform" />
                            Retour à l'accueil
                        </button>
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default NotFound;
