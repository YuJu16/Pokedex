import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Shield, Zap, Sparkles, Scale, Ruler, Star } from 'lucide-react';
import { useTeams } from '../hooks/useTeams';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { cn } from '../lib/utils'; // Assure-toi que cet utilitaire existe

// Mapping type FR → couleur
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

// Stat mapping for icons and labels
const statConfig = {
    HP: { icon: Heart, label: 'PV', color: 'text-red-500' },
    attack: { icon: Zap, label: 'Attaque', color: 'text-orange-500' },
    defense: { icon: Shield, label: 'Défense', color: 'text-blue-500' },
    special_attack: { icon: Sparkles, label: 'Att. Spé', color: 'text-purple-500' },
    special_defense: { icon: Shield, label: 'Déf. Spé', color: 'text-indigo-500' },
    speed: { icon: Zap, label: 'Vitesse', color: 'text-yellow-500' },
};

const PokemonDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pokemon, setPokemon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { teams, addPokemonToTeam } = useTeams();
    const { addFavorite, removeFavorite, isFavorite } = useFavorites();
    const { user } = useAuth();
    const [showTeamSelect, setShowTeamSelect] = useState(false);

    useEffect(() => {
        const fetchPokemonDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/pokemons/${id}`);
                setPokemon(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Erreur chargement détails:", err);
                setError(err);
                setLoading(false);
            }
        };

        if (id) fetchPokemonDetails();
    }, [id]);

    const handleAddToTeam = async (teamId) => {
        if (!pokemon) return;
        await addPokemonToTeam(teamId, pokemon.id);
        setShowTeamSelect(false);
    };

    if (loading) return <Loader />;
    if (error || !pokemon) return <div className="text-center text-red-500 p-10">Pokémon introuvable... 😢 <br /><Link to="/pokedex" className="underline">Retour au Pokédex</Link></div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            {/* Back Button */}
            <motion.button
                whileHover={{ x: -5 }}
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-primary font-bold mb-6 hover:text-primary-dark transition-colors"
            >
                <ArrowLeft size={24} />
                Retour
            </motion.button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-start">
                {/* Left Column: Image & Basic Info */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-panel p-8 flex flex-col items-center relative"
                >
                    {/* Background decorations */}
                    <div className="absolute inset-0 overflow-hidden rounded-3xl -z-10">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-secondary/5" />
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-10 -left-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl" />
                    </div>

                    <div className="relative z-10 w-64 h-64 md:w-80 md:h-80 mb-6 group">
                        <motion.img
                            key={pokemon.image}
                            src={pokemon.image}
                            alt={pokemon.name}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className="w-full h-full object-contain drop-shadow-xl"
                        />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4 text-center">
                        {pokemon.name}
                    </h1>

                    <div className="flex gap-3 mb-6">
                        {pokemon.apiTypes && pokemon.apiTypes.map((typeObj) => (
                            <span
                                key={typeObj.name}
                                className={cn(
                                    "px-4 py-1.5 rounded-full text-sm font-bold shadow-sm border border-black/5",
                                    typeColors[typeObj.name] || 'bg-gray-300'
                                )}
                            >
                                {typeObj.name}
                            </span>
                        ))}
                    </div>

                    {/* Favorite + Team buttons (if user logged in) */}
                    {user && pokemon && (
                        <div className="w-full max-w-xs mt-4 space-y-3">
                            {/* Favorite Button */}
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => isFavorite(pokemon.id) ? removeFavorite(pokemon.id) : addFavorite(pokemon.id)}
                                className={cn(
                                    "w-full py-3 px-6 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2",
                                    isFavorite(pokemon.id)
                                        ? "bg-yellow-400 text-yellow-900 hover:bg-yellow-500"
                                        : "bg-white/80 text-foreground/70 border-2 border-yellow-300 hover:bg-yellow-50"
                                )}
                            >
                                <Star size={20} className={isFavorite(pokemon.id) ? "fill-yellow-900" : ""} />
                                {isFavorite(pokemon.id) ? "Retirer des favoris" : "Ajouter aux favoris ⭐"}
                            </motion.button>

                            {/* Team Button */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowTeamSelect(!showTeamSelect)}
                                    className="w-full py-3 px-6 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-dark transition-all flex items-center justify-center gap-2 active:scale-95"
                                >
                                    <Heart className={showTeamSelect ? "fill-white" : ""} />
                                    {showTeamSelect ? "Choisir une équipe..." : "Ajouter à mon équipe"}
                                </button>

                                {showTeamSelect && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, height: 0 }}
                                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-primary/20 overflow-hidden z-20"
                                    >
                                        {teams.length > 0 ? (
                                            teams.map(team => (
                                                <button
                                                    key={team._id}
                                                    onClick={() => handleAddToTeam(team._id)}
                                                    className="w-full text-left px-4 py-3 hover:bg-primary/5 border-b border-gray-100 last:border-0 flex justify-between items-center transition-colors"
                                                >
                                                    <span className="font-medium text-foreground">{team.name}</span>
                                                    <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded-full">{team.pokemons.length}/6</span>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-sm text-muted-foreground">
                                                Tu n'as pas encore d'équipe !
                                                <Link to="/team" className="block text-primary underline mt-1">En créer une</Link>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Right Column: Stats & Details */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                >
                    {/* Stats Card */}
                    <div className="glass-panel p-6">
                        <h2 className="text-2xl font-display font-bold text-primary mb-6 flex items-center gap-2">
                            <Scale size={24} /> Statistiques
                        </h2>

                        <div className="space-y-4">
                            {pokemon.stats && Object.entries(pokemon.stats).map(([statName, value]) => {
                                const config = statConfig[statName] || { icon: Zap, label: statName, color: 'text-gray-500' };
                                const Icon = config.icon;
                                const maxStat = 255; // Max possible stat value approx
                                const percentage = Math.min((value / maxStat) * 100 * 1.5, 100); // Scale up a bit for visual impact

                                return (
                                    <div key={statName} className="group">
                                        <div className="flex justify-between items-center mb-1">
                                            <div className="flex items-center gap-2 text-sm font-bold text-gray-600 w-32">
                                                <Icon size={16} className={config.color} />
                                                {config.label}
                                            </div>
                                            <span className="font-mono font-bold text-foreground">{value}</span>
                                        </div>
                                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                                                className={cn("h-full rounded-full transition-all",
                                                    "bg-gradient-to-r from-primary/60 to-primary"
                                                )}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Infos Pokédex */}
                    <div className="glass-panel p-6">
                        <h2 className="text-xl font-display font-bold text-secondary-foreground mb-4 flex items-center gap-2">
                            <Sparkles size={20} /> Infos Pokédex
                        </h2>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-white/50 p-3 rounded-xl border border-white/50">
                                <span className="block text-muted-foreground text-xs mb-1">ID National</span>
                                <span className="font-mono font-bold text-lg">#{String(pokemon.pokedexId || pokemon.id).padStart(3, '0')}</span>
                            </div>
                            <div className="bg-white/50 p-3 rounded-xl border border-white/50">
                                <span className="block text-muted-foreground text-xs mb-1">Génération</span>
                                <span className="font-mono font-bold text-lg">Gen {pokemon.apiGeneration || '?'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Évolutions */}
                    {pokemon.apiEvolutions && pokemon.apiEvolutions.length > 0 && (
                        <div className="glass-panel p-6">
                            <h2 className="text-xl font-display font-bold text-secondary-foreground mb-4 flex items-center gap-2">
                                <Sparkles size={20} /> Évolutions
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                {pokemon.apiEvolutions.map((evo) => (
                                    <Link
                                        key={evo.pokedexId}
                                        to={`/pokemon/${evo.pokedexId}`}
                                        className="flex items-center gap-2 bg-white/70 hover:bg-primary/10 px-4 py-2 rounded-xl border border-primary/20 transition-colors"
                                    >
                                        <img
                                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.pokedexId}.png`}
                                            alt={evo.name}
                                            className="w-10 h-10"
                                        />
                                        <span className="font-medium text-sm">{evo.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Pré-évolution */}
                    {pokemon.apiPreEvolution && pokemon.apiPreEvolution !== "none" && (
                        <div className="glass-panel p-6">
                            <h2 className="text-xl font-display font-bold text-secondary-foreground mb-4 flex items-center gap-2">
                                <Sparkles size={20} /> Pré-évolution
                            </h2>
                            <Link
                                to={`/pokemon/${pokemon.apiPreEvolution.pokedexIdd || pokemon.apiPreEvolution.pokedexId}`}
                                className="flex items-center gap-2 bg-white/70 hover:bg-primary/10 px-4 py-2 rounded-xl border border-primary/20 transition-colors w-fit"
                            >
                                <img
                                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.apiPreEvolution.pokedexIdd || pokemon.apiPreEvolution.pokedexId}.png`}
                                    alt={pokemon.apiPreEvolution.name}
                                    className="w-10 h-10"
                                />
                                <span className="font-medium text-sm">{pokemon.apiPreEvolution.name}</span>
                            </Link>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default PokemonDetails;
