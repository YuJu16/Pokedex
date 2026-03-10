import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { Home, LayoutGrid, Users, LogIn, LogOut, Heart, Sparkles, User, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const location = useLocation();
    const { user, logout } = useAuth();

    const FloatingIcons = () => {
        return (
            <div className="absolute inset-0 pointer-events-none overflow-visible">
                {/* LEFT SIDE */}
                <motion.div
                    initial={{ opacity: 0, scale: 0, y: 10, x: -10 }}
                    animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5], y: -30, x: -25 }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    className="absolute top-0 left-0 text-pink-400"
                >
                    <Heart size={14} fill="currentColor" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0, y: 0, x: -5 }}
                    animate={{ opacity: [0, 1, 0], scale: [0, 0.8, 0], y: -35, x: -15 }}
                    transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 0.5, delay: 0.3 }}
                    className="absolute top-[-5px] left-2 text-pink-200"
                >
                    <Heart size={10} fill="currentColor" />
                </motion.div>

                {/* RIGHT SIDE */}
                <motion.div
                    initial={{ opacity: 0, scale: 0, y: 10, x: 10 }}
                    animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5], y: -35, x: 30 }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 0.5, delay: 0.5 }}
                    className="absolute top-0 right-0 text-yellow-300"
                >
                    <Sparkles size={12} fill="currentColor" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0, y: 5, x: 5 }}
                    animate={{ opacity: [0, 1, 0], scale: [0, 0.8, 0], y: -25, x: 20 }}
                    transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1, delay: 0.8 }}
                    className="absolute top-1 right-3 text-pink-300"
                >
                    <Heart size={9} fill="currentColor" />
                </motion.div>

                {/* CENTER / TOP */}
                <motion.div
                    initial={{ opacity: 0, scale: 0, y: 0 }}
                    animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], y: -40 }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 text-pink-500"
                >
                    <Heart size={12} fill="currentColor" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0, y: 0 }}
                    animate={{ opacity: [0, 0.8, 0], scale: [0, 0.8, 0], y: -30, x: 10 }}
                    transition={{ duration: 2.3, repeat: Infinity, repeatDelay: 2, delay: 1 }}
                    className="absolute -top-2 left-1/2 text-white/80"
                >
                    <Sparkles size={10} fill="currentColor" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0, y: 0 }}
                    animate={{ opacity: [0, 0.8, 0], scale: [0, 0.8, 0], y: -30, x: -10 }}
                    transition={{ duration: 2.7, repeat: Infinity, repeatDelay: 1.2, delay: 0.2 }}
                    className="absolute -top-2 left-1/2 text-white/80"
                >
                    <Heart size={8} fill="currentColor" />
                </motion.div>
            </div>
        );
    };

    const NavLink = ({ to, icon: Icon, label }) => {
        const isActive = location.pathname === to;

        return (
            <Link to={to} className="relative group px-6 py-2 rounded-full transition-colors duration-300 grid place-items-center">
                {isActive && (
                    <>
                        <motion.div
                            layoutId="navbar-active"
                            className="absolute inset-0 bg-primary rounded-full shadow-lg shadow-primary/30"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                        <FloatingIcons />
                    </>
                )}
                <div className={cn(
                    "relative z-10 flex items-center gap-2 font-medium transition-colors duration-200",
                    isActive ? "text-white" : "text-muted-foreground group-hover:text-primary"
                )}>
                    <Icon size={18} />
                    <span>{label}</span>
                </div>
            </Link>
        );
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] flex justify-center pt-6 px-4">
            <div className="glass-panel rounded-full px-6 py-3 flex items-center gap-8 shadow-soft border-2 border-white/50 bg-white/80 backdrop-blur-xl">
                <Link to="/" className="flex items-center gap-2 mr-4 group">
                    <img
                        src="/cutelogo.png"
                        alt="Logo"
                        className="w-16 h-16 object-contain drop-shadow-md group-hover:rotate-12 transition-transform duration-300"
                        onError={(e) => e.target.style.display = 'none'}
                    />
                    <span className="text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-poke-darkRed to-primary tracking-wider drop-shadow-sm">
                        POKÉVERSE
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-2">
                    <NavLink to="/" icon={Home} label="Accueil" />
                    <NavLink to="/pokedex" icon={LayoutGrid} label="Pokédex" />
                    <NavLink to="/team" icon={Users} label="Équipe" />
                    {/* Custom Akinator link with image */}
                    <Link to="/akinator" className="relative group px-4 py-2 rounded-full transition-colors duration-300 grid place-items-center">
                        {location.pathname === '/akinator' && (
                            <>
                                <motion.div
                                    layoutId="navbar-active"
                                    className="absolute inset-0 bg-primary rounded-full shadow-lg shadow-primary/30"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                                <FloatingIcons />
                            </>
                        )}
                        <div className={cn(
                            "relative z-10 flex items-center gap-1.5 font-medium transition-colors duration-200",
                            location.pathname === '/akinator' ? "text-white" : "text-muted-foreground group-hover:text-primary"
                        )}>
                            <img src="/img/metamorph.png" alt="" className="w-6 h-6 object-contain" />
                            <span className="text-xs">Quel est ce Pokémon ?</span>
                        </div>
                    </Link>
                </div>

                <div className="h-6 w-px bg-primary/20 hidden md:block" />

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <Link to="/settings" className="hidden sm:flex items-center gap-2 text-sm text-foreground/70 font-medium group hover:text-primary transition-colors">
                                <div className="relative">
                                    <img
                                        src={user.avatar || '/img/avatars/default.png'}
                                        alt={user.username}
                                        className="w-8 h-8 rounded-full object-contain bg-white/50 border-2 border-primary/30 shadow-sm group-hover:border-primary/60 transition-colors"
                                    />
                                    <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Settings size={10} className="text-primary" />
                                    </div>
                                </div>
                                <span>{user.username}</span>
                            </Link>
                            <button
                                onClick={logout}
                                className="glass-button rounded-full px-5 py-2 text-sm hover:shadow-md flex items-center gap-2 hover:bg-red-50 hover:text-red-500 hover:border-red-200"
                            >
                                <LogOut size={16} />
                                <span className="hidden sm:inline">Déconnexion</span>
                            </button>
                        </>
                    ) : (
                        <Link to="/login">
                            <button className="glass-button rounded-full px-6 py-2 text-sm hover:shadow-md flex items-center gap-2">
                                <LogIn size={16} />
                                Connexion
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
