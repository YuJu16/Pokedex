import { useState } from 'react';
import { useTeams } from '../hooks/useTeams';
import { useFavorites } from '../hooks/useFavorites';
import { usePokemon } from '../hooks/usePokemon';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Users, ChevronRight, Heart, Star, LogIn, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import PokemonCard from '../components/PokemonCard';
import { cn } from '../lib/utils';

export default function Team() {
    const { user } = useAuth();
    const { teams, loading: teamsLoading, createTeam, deleteTeam, removePokemonFromTeam } = useTeams();
    const { favorites, loading: favsLoading, removeFavorite } = useFavorites();
    const { pokemon: allPokemon } = usePokemon();
    const [newTeamName, setNewTeamName] = useState('');
    const [selectedTeamId, setSelectedTeamId] = useState(null);
    const [activeTab, setActiveTab] = useState('favorites');

    const handleCreateTeam = async (e) => {
        e.preventDefault();
        if (!newTeamName.trim()) return;
        const success = await createTeam(newTeamName);
        if (success) setNewTeamName('');
    };

    const selectedTeam = teams.find(t => t._id === selectedTeamId);
    const getPokemonData = (id) => allPokemon.find(p => p.id === id);

    // Si non connecté → message d'invitation
    if (!user) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center min-h-[60vh] text-center"
            >
                <div className="glass-panel p-12 rounded-3xl max-w-md">
                    <div className="relative w-32 h-32 mx-auto mb-6">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                        <img
                            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png"
                            alt="Psykokwak"
                            className="w-full h-full object-contain relative z-10 drop-shadow-xl animate-float"
                        />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-foreground/80 mb-2">
                        Connecte-toi ! 💖
                    </h2>
                    <p className="text-muted-foreground mb-6">
                        Tu dois être connecté pour gérer tes équipes et tes Pokémon favoris.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Link to="/login">
                            <button className="glass-button-primary px-6 py-3 flex items-center gap-2 group">
                                <LogIn size={18} />
                                <span>Se connecter</span>
                            </button>
                        </Link>
                        <Link to="/register">
                            <button className="glass-button px-6 py-3 flex items-center gap-2 group">
                                <Sparkles size={18} />
                                <span>S'inscrire</span>
                            </button>
                        </Link>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 justify-center">
                <button
                    onClick={() => setActiveTab('favorites')}
                    className={cn(
                        "px-6 py-3 rounded-full font-bold text-sm transition-all flex items-center gap-2",
                        activeTab === 'favorites'
                            ? "bg-primary text-white shadow-lg shadow-primary/30"
                            : "glass-button hover:bg-primary/10"
                    )}
                >
                    <Star size={16} />
                    Favoris ({favorites.length})
                </button>
                <button
                    onClick={() => setActiveTab('teams')}
                    className={cn(
                        "px-6 py-3 rounded-full font-bold text-sm transition-all flex items-center gap-2",
                        activeTab === 'teams'
                            ? "bg-secondary text-white shadow-lg shadow-secondary/30"
                            : "glass-button hover:bg-secondary/10"
                    )}
                >
                    <Users size={16} />
                    Équipes ({teams.length})
                </button>
            </div>

            <AnimatePresence mode="wait">
                {/* ============== FAVORIS TAB ============== */}
                {activeTab === 'favorites' && (
                    <motion.div
                        key="favorites"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        <div className="glass-panel p-6 rounded-3xl">
                            <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2 text-primary">
                                <img src="/img/favoris.png" alt="" className="w-12 h-12 object-contain" />
                                Mes Favoris
                                <img src="/img/favoris.png" alt="" className="w-12 h-12 object-contain" />
                            </h2>

                            {favsLoading ? <Loader /> : favorites.length === 0 ? (
                                <div className="text-center py-12">
                                    <Heart size={48} className="mx-auto mb-4 text-primary/20" />
                                    <p className="text-muted-foreground text-lg">Aucun favori pour l'instant...</p>
                                    <p className="text-muted-foreground/60 text-sm mt-2">
                                        Va dans le Pokédex et clique sur ❤️ pour ajouter des favoris !
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {favorites.map((pokemon, index) => (
                                        <div key={pokemon.id || pokemon._id} className="relative">
                                            <div className="absolute -top-2 -right-2 z-50 pointer-events-auto">
                                                <button
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFavorite(pokemon.id); }}
                                                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-xl hover:scale-110 transition-all border-2 border-white"
                                                    title="Retirer des favoris"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                            <PokemonCard pokemon={pokemon} index={index} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* ============== ÉQUIPES TAB ============== */}
                {activeTab === 'teams' && (
                    <motion.div
                        key="teams"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-350px)]"
                    >
                        {/* Sidebar : Liste des équipes */}
                        <div className="w-full lg:w-1/3 flex flex-col gap-6">
                            <div className="glass-panel p-6 rounded-3xl">
                                <h2 className="text-2xl font-display font-bold mb-4 flex items-center gap-2 text-secondary">
                                    <Users className="text-secondary" />
                                    Mes Équipes
                                    <img src="/img/wingRight.gif" alt="" className="w-8 h-8" />
                                </h2>

                                <form onSubmit={handleCreateTeam} className="flex gap-2 mb-6">
                                    <input
                                        type="text"
                                        placeholder="Nom de l'équipe..."
                                        className="glass-input flex-1 text-sm"
                                        value={newTeamName}
                                        onChange={(e) => setNewTeamName(e.target.value)}
                                    />
                                    <button type="submit" className="glass-button px-3 py-2 bg-secondary/20 hover:bg-secondary/40 border-secondary/50">
                                        <Plus size={18} />
                                    </button>
                                </form>

                                <div className="space-y-3 overflow-y-auto max-h-[500px] pr-2">
                                    {teamsLoading ? <Loader /> : (
                                        teams.map(team => (
                                            <motion.div
                                                key={team._id}
                                                layout
                                                onClick={() => setSelectedTeamId(team._id)}
                                                className={`p-4 rounded-2xl cursor-pointer border-2 transition-all flex justify-between items-center group
                                                    ${selectedTeamId === team._id
                                                        ? 'bg-secondary/15 border-secondary/40 shadow-soft'
                                                        : 'bg-white/50 border-white/60 hover:bg-white/70 hover:border-secondary/20'}`}
                                            >
                                                <div>
                                                    <h3 className="font-bold text-foreground">{team.name}</h3>
                                                    <p className="text-xs text-muted-foreground">{team.pokemons.length} / 6 Pokémon</p>
                                                </div>
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); deleteTeam(team._id); }}
                                                        className="text-red-500 hover:text-red-400 p-1.5 bg-red-50 hover:bg-red-100 rounded-full transition-colors"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                    <ChevronRight size={16} className="text-secondary/50" />
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                    {!teamsLoading && teams.length === 0 && (
                                        <div className="text-center py-8">
                                            <Heart size={32} className="mx-auto mb-3 text-secondary/30" />
                                            <p className="text-muted-foreground text-sm">Aucune équipe créée...</p>
                                            <p className="text-muted-foreground/60 text-xs mt-1">Crée ta première équipe ci-dessus !</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Contenu principal : Détails de l'équipe sélectionnée */}
                        <div className="w-full lg:w-2/3">
                            <AnimatePresence mode="wait">
                                {selectedTeam ? (
                                    <motion.div
                                        key={selectedTeam._id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="h-full flex flex-col"
                                    >
                                        <div className="flex justify-between items-end mb-6">
                                            <div>
                                                <h2 className="text-4xl font-display font-bold text-foreground">{selectedTeam.name}</h2>
                                                <p className="text-muted-foreground">Gère ton équipe de rêve 🌟</p>
                                            </div>
                                            <div className="text-2xl font-display font-bold text-secondary">
                                                {selectedTeam.pokemons.length}/6
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 overflow-y-auto pb-10">
                                            {selectedTeam.pokemons.map((pokemonId, index) => {
                                                const pokemon = getPokemonData(pokemonId);
                                                if (!pokemon) return null;

                                                return (
                                                    <div key={`${selectedTeam._id}-${pokemonId}-${index}`} className="relative group">
                                                        <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => removePokemonFromTeam(selectedTeam._id, pokemonId)}
                                                                className="bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-full shadow-lg backdrop-blur-sm"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                        <PokemonCard pokemon={pokemon} index={index} />
                                                    </div>
                                                );
                                            })}

                                            {/* Emplacements vides */}
                                            {[...Array(6 - selectedTeam.pokemons.length)].map((_, i) => (
                                                <div key={`empty-${i}`} className="glass-card flex flex-col items-center justify-center border-dashed border-secondary/20 min-h-[250px] opacity-60">
                                                    <div className="w-20 h-20 rounded-full border-2 border-secondary/15 flex items-center justify-center mb-4 bg-secondary/5">
                                                        <Plus size={32} className="text-secondary/30" />
                                                    </div>
                                                    <p className="text-muted-foreground font-medium text-sm">Emplacement vide</p>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-center min-h-[400px]">
                                        <div>
                                            <Users size={64} className="mx-auto mb-4 text-secondary/20" />
                                            <h3 className="text-2xl font-display font-bold text-foreground/40">Sélectionne une équipe</h3>
                                            <p className="text-muted-foreground text-sm mt-2">Choisis une équipe à gauche pour voir les détails 💫</p>
                                        </div>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
