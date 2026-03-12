import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Layers, Flame, RefreshCw } from 'lucide-react';
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

    if (error) return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center"
        >
            <div className="glass-panel p-12 rounded-3xl max-w-md">
                <div className="relative w-36 h-36 mx-auto mb-6">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                    <img
                        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/19.png"
                        alt="Rattata"
                        className="w-full h-full object-contain relative z-10 drop-shadow-xl animate-float"
                    />
                </div>
                <h2 className="text-2xl font-display font-bold text-foreground/80 mb-2">
                    Oups ! Un problème... 😢
                </h2>
                <p className="text-muted-foreground mb-6">
                    Rattata n'a pas pu charger le Pokédex. Le serveur est peut-être éteint !
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="glass-button-primary px-6 py-3 flex items-center gap-2 mx-auto group"
                >
                    <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                    <span>Réessayer</span>
                </button>
            </div>
        </motion.div>
    );

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
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                >
                    <div className="glass-panel p-10 rounded-3xl max-w-sm">
                        <div className="relative w-28 h-28 mx-auto mb-5">
                            <div className="absolute inset-0 bg-secondary/20 rounded-full blur-xl animate-pulse" />
                            <img
                                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/19.png"
                                alt="Rattata"
                                className="w-full h-full object-contain relative z-10 drop-shadow-xl animate-float"
                            />
                        </div>
                        <h3 className="text-xl font-display font-bold text-foreground/70 mb-2">
                            Aucun Pokémon trouvé ! 🔍
                        </h3>
                        <p className="text-muted-foreground text-sm">
                            Même Rattata ne correspond pas à ta recherche...<br/>Essaie un autre nom ou type !
                        </p>
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedType(null); setSelectedGen(null); }}
                            className="mt-5 glass-button px-5 py-2 text-sm hover:bg-primary/10"
                        >
                            ✨ Tout effacer
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
