import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { Plus, Check, Users } from 'lucide-react';
import { useState } from 'react';
import { useTeams } from '../hooks/useTeams';
import { useAuth } from '../context/AuthContext';

const typeColors = {
    Normal: 'bg-gray-300 text-gray-700',
    Feu: 'bg-orange-300 text-orange-800',
    Eau: 'bg-blue-300 text-blue-800',
    Plante: 'bg-green-300 text-green-800',
    Électrik: 'bg-yellow-200 text-yellow-800',
    Glace: 'bg-cyan-200 text-cyan-800',
    Combat: 'bg-red-300 text-red-800',
    Poison: 'bg-purple-300 text-purple-800',
    Sol: 'bg-amber-300 text-amber-800',
    Vol: 'bg-indigo-300 text-indigo-800',
    Psy: 'bg-pink-300 text-pink-800',
    Insecte: 'bg-lime-300 text-lime-800',
    Roche: 'bg-stone-400 text-stone-800',
    Spectre: 'bg-violet-300 text-violet-800',
    Dragon: 'bg-indigo-400 text-indigo-900',
    Acier: 'bg-slate-300 text-slate-700',
    Fée: 'bg-pink-200 text-pink-800',
};

const PokemonCard = ({ pokemon, index }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    const { user } = useAuth();
    const { teams, addPokemonToTeam } = useTeams();
    const [showTeamSelect, setShowTeamSelect] = useState(false);

    function onMouseMove({ currentTarget, clientX, clientY }) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        x.set(clientX - left - width / 2);
        y.set(clientY - top - height / 2);
    }

    function onMouseLeave() {
        x.set(0);
        y.set(0);
        setShowTeamSelect(false);
    }

    const rotateX = useTransform(mouseY, [-100, 100], [5, -5]);
    const rotateY = useTransform(mouseX, [-100, 100], [-5, 5]);

    const handleAddToTeam = async (e, teamId) => {
        e.stopPropagation();
        await addPokemonToTeam(teamId, pokemon.pokedexId);
        setShowTeamSelect(false);
    };

    return (
        <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            className="relative group cursor-pointer z-0 hover:z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
        >
            {/* Cute Glow behind card */}
            <div className="absolute inset-2 bg-primary/30 rounded-[2rem] blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />

            <div className="glass-card relative overflow-hidden h-full flex flex-col items-center p-6 border-4 border-white group-hover:border-primary/50 transition-colors bg-gradient-to-b from-white to-background rounded-[2rem] shadow-soft">

                {/* ID Badge - Cute Pill */}
                <div className="absolute top-4 left-4 text-xs font-bold text-primary bg-white px-3 py-1.5 rounded-full shadow-sm border border-primary/20">
                    No. {pokemon.pokedexId}
                </div>

                {/* Action Button (Add to Team) */}
                {user && (
                    <div className="absolute top-4 right-4 z-20">
                        <div className="relative">
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowTeamSelect(!showTeamSelect); }}
                                className="p-2 bg-white hover:bg-primary hover:text-white rounded-full text-primary transition-all shadow-sm border border-primary/20"
                            >
                                <Plus size={18} />
                            </button>

                            <AnimatePresence>
                                {showTeamSelect && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                                        className="absolute right-0 top-full mt-2 w-48 bg-white border-2 border-primary/20 rounded-2xl shadow-xl overflow-hidden z-50 p-2"
                                    >
                                        <p className="text-xs text-primary font-bold px-2 py-1 mb-1 text-center">Add to Squad 💖</p>
                                        {teams.length > 0 ? (
                                            teams.map(team => (
                                                <button
                                                    key={team._id}
                                                    onClick={(e) => handleAddToTeam(e, team._id)}
                                                    className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-primary/10 rounded-xl flex justify-between items-center group/item transition-colors"
                                                >
                                                    <span className="truncate font-medium">{team.name}</span>
                                                    <span className="text-xs text-primary/70">{team.pokemons.length}/6</span>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="text-xs text-muted-foreground text-center py-2">No teams yet...</div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                )}

                {/* Image Area with Circle Background */}
                <div className="relative w-40 h-40 mb-2 flex items-center justify-center">
                    <div className="absolute inset-4 bg-secondary/20 rounded-full blur-md" />
                    <motion.div
                        className="w-32 h-32 relative z-10"
                        style={{ transform: "translateZ(20px)" }}
                    >
                        <img
                            src={pokemon.sprites.regular}
                            alt={pokemon.name.fr}
                            className="w-full h-full object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-110"
                            loading="lazy"
                        />
                    </motion.div>
                </div>

                {/* Name */}
                <h3 className="text-xl font-display font-bold text-center mb-2 text-foreground group-hover:text-primary transition-colors"
                    style={{ transform: "translateZ(10px)" }}>
                    {pokemon.name.fr}
                </h3>

                {/* Types */}
                <div className="flex gap-2" style={{ transform: "translateZ(5px)" }}>
                    {pokemon.types.map((type) => (
                        <span
                            key={type.name}
                            className={cn(
                                "px-3 py-1 rounded-full text-xs font-bold shadow-sm border-b-2 border-black/5",
                                typeColors[type.name] || 'bg-gray-300'
                            )}
                        >
                            {type.name}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default PokemonCard;
