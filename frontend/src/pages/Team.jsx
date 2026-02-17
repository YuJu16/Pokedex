import { useState } from 'react';
import { useTeams } from '../hooks/useTeams';
import { usePokemon } from '../hooks/usePokemon'; // To get pokemon details by ID
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Users, ChevronRight } from 'lucide-react';
import Loader from '../components/Loader';
import PokemonCard from '../components/PokemonCard';

export default function Team() {
    const { teams, loading, createTeam, deleteTeam, removePokemonFromTeam } = useTeams();
    const { pokemon: allPokemon } = usePokemon(); // Need full list to render details
    const [newTeamName, setNewTeamName] = useState('');
    const [selectedTeamId, setSelectedTeamId] = useState(null);

    const handleCreateTeam = async (e) => {
        e.preventDefault();
        if (!newTeamName.trim()) return;
        const success = await createTeam(newTeamName);
        if (success) setNewTeamName('');
    };

    const selectedTeam = teams.find(t => t._id === selectedTeamId);

    // Helper to get pokemon data from ID
    const getPokemonData = (id) => allPokemon.find(p => p.pokedexId === id);

    return (
        <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-150px)]">
            {/* Sidebar: Team List */}
            <div className="w-full lg:w-1/3 flex flex-col gap-6">
                <div className="glass-panel p-6 rounded-2xl">
                    <h2 className="text-2xl font-display font-bold mb-4 flex items-center gap-2">
                        <Users className="text-poke-blue" />
                        My Teams
                    </h2>

                    <form onSubmit={handleCreateTeam} className="flex gap-2 mb-6">
                        <input
                            type="text"
                            placeholder="New Team Name"
                            className="glass-input flex-1 text-sm"
                            value={newTeamName}
                            onChange={(e) => setNewTeamName(e.target.value)}
                        />
                        <button type="submit" className="glass-button px-3 py-2 bg-poke-blue/20 hover:bg-poke-blue/40 border-poke-blue/50">
                            <Plus size={18} />
                        </button>
                    </form>

                    <div className="space-y-3 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                        {loading ? <Loader /> : (
                            teams.map(team => (
                                <motion.div
                                    key={team._id}
                                    layout
                                    onClick={() => setSelectedTeamId(team._id)}
                                    className={`p-4 rounded-xl cursor-pointer border transition-all flex justify-between items-center group
                                        ${selectedTeamId === team._id
                                            ? 'bg-poke-blue/20 border-poke-blue/50 shadow-[0_0_15px_rgba(59,76,202,0.3)]'
                                            : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                                >
                                    <div>
                                        <h3 className="font-bold">{team.name}</h3>
                                        <p className="text-xs text-gray-400">{team.pokemons.length} / 6 Pokemon</p>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); deleteTeam(team._id); }}
                                            className="text-red-400 hover:text-red-300 p-1 bg-red-500/10 rounded-full"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                        <ChevronRight size={16} className="text-gray-400" />
                                    </div>
                                </motion.div>
                            ))
                        )}
                        {!loading && teams.length === 0 && (
                            <p className="text-center text-gray-500 text-sm py-4">No teams created yet.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content: Selected Team Details */}
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
                                    <h2 className="text-4xl font-display font-bold">{selectedTeam.name}</h2>
                                    <p className="text-gray-400">Manage your dream team</p>
                                </div>
                                <div className="text-2xl font-mono text-poke-yellow">
                                    {selectedTeam.pokemons.length}/6
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 overflow-y-auto pb-10 custom-scrollbar">
                                {selectedTeam.pokemons.map((pokemonId, index) => {
                                    const pokemon = getPokemonData(pokemonId);
                                    if (!pokemon) return null; // Should ideally show a loading state or placeholder

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

                                {/* Empty Slots Placeholders */}
                                {[...Array(6 - selectedTeam.pokemons.length)].map((_, i) => (
                                    <div key={`empty-${i}`} className="glass-card flex flex-col items-center justify-center border-dashed border-white/20 min-h-[250px] opacity-50">
                                        <div className="w-20 h-20 rounded-full border-2 border-white/10 flex items-center justify-center mb-4">
                                            <Plus size={32} className="text-white/20" />
                                        </div>
                                        <p className="text-white/30 font-medium">Empty Slot</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-center opacity-50">
                            <div>
                                <Users size={64} className="mx-auto mb-4 text-white/20" />
                                <h3 className="text-2xl font-bold text-white/40">Select a team to view details</h3>
                            </div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
