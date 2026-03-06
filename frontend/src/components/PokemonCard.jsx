import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Plus, Star } from 'lucide-react';
import { useState } from 'react';
import { useTeams } from '../hooks/useTeams';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../context/AuthContext';

// Mapping type FR → couleur (les types dans le nouveau backend sont en français)
const typeColors = {
    Normal: 'bg-gray-300 text-gray-700',
    Feu: 'bg-orange-300 text-orange-800',
    Eau: 'bg-blue-300 text-blue-800',
    Plante: 'bg-green-300 text-green-800',
    'Électrik': 'bg-yellow-200 text-yellow-800',
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
    'Ténèbres': 'bg-gray-600 text-gray-100',
    Acier: 'bg-slate-300 text-slate-700',
    'Fée': 'bg-pink-200 text-pink-800',
};

const PokemonCard = ({ pokemon, index }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { teams, addPokemonToTeam } = useTeams();
    const { addFavorite, removeFavorite, isFavorite } = useFavorites();
    const [showTeamSelect, setShowTeamSelect] = useState(false);

    const handleToggleFavorite = (e) => {
        e.stopPropagation();
        if (isFavorite(pokemon.id)) {
            removeFavorite(pokemon.id);
        } else {
            addFavorite(pokemon.id);
        }
    };

    const handleCardClick = () => {
        navigate(`/pokemon/${pokemon.id}`);
    };

    const handleAddToTeam = async (e, teamId) => {
        e.stopPropagation();
        await addPokemonToTeam(teamId, pokemon.id);
        setShowTeamSelect(false);
    };

    return (
        <motion.div
            layout // Keep layout for list reordering animations
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={handleCardClick}
            className="relative group cursor-pointer z-0 hover:z-40"
        >
            {/* Cute Glow behind card */}
            <div className="absolute inset-2 bg-primary/30 rounded-[2rem] blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />

            <div className="glass-card relative overflow-hidden h-full flex flex-col items-center p-6 border-4 border-white group-hover:border-primary/50 transition-colors bg-gradient-to-b from-white to-background rounded-[2rem] shadow-soft">

                {/* ID Badge - Cute Pill */}
                <div className="absolute top-4 left-4 text-xs font-bold text-primary bg-white px-3 py-1.5 rounded-full shadow-sm border border-primary/20">
                    No. {pokemon.pokedexId || pokemon.id}
                </div>

                {/* Action Buttons (Favorite + Add to Team) */}
                {user && (
                    <div className="absolute top-4 right-4 z-20 flex gap-1.5">
                        {/* Star Favorite Button */}
                        <button
                            onClick={handleToggleFavorite}
                            className={cn(
                                "p-2 rounded-full transition-all shadow-sm border",
                                isFavorite(pokemon.id)
                                    ? "bg-yellow-400 text-yellow-900 border-yellow-500 hover:bg-yellow-500 shadow-yellow-300/50"
                                    : "bg-white text-yellow-400 border-yellow-300/50 hover:bg-yellow-50 hover:border-yellow-400"
                            )}
                        >
                            <Star size={16} className={isFavorite(pokemon.id) ? "fill-yellow-900" : ""} />
                        </button>

                        {/* Team Select Button */}
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
                                        <p className="text-xs text-primary font-bold px-2 py-1 mb-1 text-center">Ajouter à l'équipe 💖</p>
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
                                            <div className="text-xs text-muted-foreground text-center py-2">Pas encore d'équipe...</div>
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
                            src={pokemon.image}
                            alt={pokemon.name}
                            className="w-full h-full object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-110"
                            loading="lazy"
                        />
                    </motion.div>
                </div>

                {/* Name */}
                <h3 className="text-xl font-display font-bold text-center mb-2 text-foreground group-hover:text-primary transition-colors"
                    style={{ transform: "translateZ(10px)" }}>
                    {pokemon.name}
                </h3>

                {/* Types */}
                <div className="flex gap-2" style={{ transform: "translateZ(5px)" }}>
                    {pokemon.apiTypes && pokemon.apiTypes.map((typeObj) => (
                        <span
                            key={typeObj.name}
                            className={cn(
                                "px-3 py-1 rounded-full text-xs font-bold shadow-sm border-b-2 border-black/5",
                                typeColors[typeObj.name] || 'bg-gray-300'
                            )}
                        >
                            {typeObj.name}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default PokemonCard;
