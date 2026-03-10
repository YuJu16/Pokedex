import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Layers, Flame } from 'lucide-react';
import { usePokemon } from '../hooks/usePokemon';
import { useTeams } from '../hooks/useTeams';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../context/AuthContext';
import PokemonCard from '../components/PokemonCard';
import Loader from '../components/Loader';
import CuteSelect from '../components/CuteSelect';

// Types en français (comme dans le nouveau backend) 
const types = [
    'Normal', 'Feu', 'Eau', 'Plante', 'Électrik', 'Glace',
    'Combat', 'Poison', 'Sol', 'Vol', 'Psy', 'Insecte',
    'Roche', 'Spectre', 'Dragon', 'Ténèbres', 'Acier', 'Fée',
];

// Générations disponibles
const generations = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function Pokedex() {
    const { pokemon, loading, error } = usePokemon();
    const { user } = useAuth();
    // Call hooks once here, pass down to cards (avoids 898 API calls if called per card)
    const { teams, addPokemonToTeam } = useTeams();
    const { addFavorite, removeFavorite, isFavorite } = useFavorites();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState(null);
    const [selectedGen, setSelectedGen] = useState(null);

    // Restore scroll position when returning from a Pokémon details page
    useEffect(() => {
        if (!loading) {
            const savedScroll = sessionStorage.getItem('pokedex-scroll');
            if (savedScroll) {
                window.scrollTo({ top: parseInt(savedScroll), behavior: 'instant' });
                sessionStorage.removeItem('pokedex-scroll');
            }
        }
    }, [loading]);

    const filteredPokemon = pokemon.filter(p => {
        // Cherche dans le nom (maintenant un string direct)
        const matchesName = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        // Cherche aussi par numéro Pokédex
        const pokedexNum = String(p.pokedexId || p.id);
        const matchesNumber = pokedexNum.includes(searchTerm.trim());
        // Filtre par type (en français, format apiTypes)
        const matchesType = selectedType
            ? p.apiTypes && p.apiTypes.some(t => t.name === selectedType)
            : true;
        // Filtre par génération
        const matchesGen = selectedGen
            ? p.apiGeneration === selectedGen
            : true;
        return (matchesName || matchesNumber) && matchesType && matchesGen;
    });

    if (error) return <div className="text-center text-red-500">Erreur lors du chargement des Pokémon 😢</div>;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-4xl font-display font-bold text-primary tracking-wide drop-shadow-sm flex items-center gap-4">
                    <img src="/img/wingLeft.png" alt="" className="h-8 w-auto drop-shadow-md" />
                    Pokédex
                    <img src="/img/wingRight.png" alt="" className="h-8 w-auto drop-shadow-md" />
                </h1>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    {/* Barre de recherche */}
                    <div className="relative group w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Rechercher un Pokémon..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="glass-input w-full pl-10 pr-4"
                        />
                        <Search className="absolute left-3 top-3.5 text-primary/50 w-4 h-4" />
                    </div>

                    {/* Filtre par type */}
                    <CuteSelect
                        value={selectedType || ''}
                        onChange={(val) => setSelectedType(val || null)}
                        placeholder="Tous les types"
                        icon={<Flame size={14} />}
                        options={types.map(type => ({ value: type, label: type }))}
                    />

                    {/* Filtre par génération */}
                    <CuteSelect
                        value={selectedGen ? String(selectedGen) : ''}
                        onChange={(val) => setSelectedGen(val ? parseInt(val) : null)}
                        placeholder="Toutes les générations"
                        icon={<Layers size={14} />}
                        options={generations.map(gen => ({ value: String(gen), label: `Génération ${gen}` }))}
                    />
                </div>
            </div>

            {/* Filtres actifs */}
            <AnimatePresence>
                {(searchTerm || selectedType || selectedGen) && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex gap-2"
                    >
                        {searchTerm && (
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-primary/20">
                                "{searchTerm}"
                                <button onClick={() => setSearchTerm('')} className="hover:text-primary-dark"><X size={14} /></button>
                            </span>
                        )}
                        {selectedType && (
                            <span className="bg-secondary/10 text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-secondary/20">
                                {selectedType}
                                <button onClick={() => setSelectedType(null)} className="hover:text-secondary-foreground/80"><X size={14} /></button>
                            </span>
                        )}
                        {selectedGen && (
                            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-purple-200">
                                Gen {selectedGen}
                                <button onClick={() => setSelectedGen(null)} className="hover:text-purple-900"><X size={14} /></button>
                            </span>
                        )}
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedType(null); setSelectedGen(null); }}
                            className="text-xs text-muted-foreground hover:text-primary underline"
                        >
                            Tout effacer
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {loading ? (
                <Loader />
            ) : (
                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                >
                    <AnimatePresence>
                        {filteredPokemon.map((p, index) => (
                            <PokemonCard
                                key={p.id}
                                pokemon={p}
                                index={index}
                                teams={teams}
                                addPokemonToTeam={addPokemonToTeam}
                                isFavorite={isFavorite}
                                addFavorite={addFavorite}
                                removeFavorite={removeFavorite}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {!loading && filteredPokemon.length === 0 && (
                <div className="text-center py-20 text-muted-foreground bg-white/30 rounded-3xl border border-white/50 border-dashed">
                    <p className="text-xl font-display">Aucun Pokémon trouvé... 😢</p>
                </div>
            )}
        </div>
    );
}
