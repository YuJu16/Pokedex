import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import axios from 'axios';

export default function WhosThatPokemon() {
    const [conversation, setConversation] = useState([]); // { role: 'user'|'model', text: string }
    const [currentQuestion, setCurrentQuestion] = useState(null); // { message, options, guess, confidence }
    const [isLoading, setIsLoading] = useState(true);
    const [gameOver, setGameOver] = useState(false);
    const [guessedPokemon, setGuessedPokemon] = useState(null);
    const [guessCorrect, setGuessCorrect] = useState(null);
    const [questionCount, setQuestionCount] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isShaking, setIsShaking] = useState(false);
    const [pokemonImageUrl, setPokemonImageUrl] = useState(null);
    const containerRef = useRef(null);

    // Start the game on mount
    useEffect(() => {
        startGame();
    }, []);

    const startGame = async () => {
        setConversation([]);
        setCurrentQuestion(null);
        setIsLoading(true);
        setGameOver(false);
        setGuessedPokemon(null);
        setGuessCorrect(null);
        setQuestionCount(0);
        setIsAnimating(false);
        setIsShaking(false);
        setPokemonImageUrl(null);

        try {
            const response = await axios.post('http://localhost:3000/api/akinator', {
                messages: [{ role: 'user', text: "Commençons le jeu ! Pose-moi ta première question." }]
            });

            setCurrentQuestion(response.data);
            setConversation([
                { role: 'user', text: "Commençons le jeu ! Pose-moi ta première question." }
            ]);
            setQuestionCount(1);
        } catch (error) {
            console.error('Erreur:', error);
            setCurrentQuestion({
                message: "Oups, je n'arrive pas à me connecter... 🫠 Réessaie !",
                options: ["Réessayer 🔄"],
                guess: null,
                confidence: 0
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleOptionClick = async (option) => {
        if (isLoading) return;

        // If guess was made and user responds
        if (currentQuestion?.guess) {
            if (option.includes("Oui") || option.includes("🎉")) {
                setIsAnimating(true);
                setGuessCorrect(true);
                setGameOver(true);
                setGuessedPokemon(currentQuestion.guess);
                fetchPokemonImage(currentQuestion.guess);
                
                // End animation class after 2 seconds
                setTimeout(() => {
                    setIsAnimating(false);
                }, 2000);
                return;
            }
            // Wrong guess logic
            if (option.includes("Non") || option.includes("😏")) {
                setIsShaking(true);
                setTimeout(() => setIsShaking(false), 500);
            }
        }

        // If user clicks "Réessayer" or "Recommencer"
        if (option.includes("recommence") || option.includes("Recommencer") || option.includes("Réessayer") || option.includes("🔄")) {
            startGame();
            return;
        }

        setIsLoading(true);

        const newConversation = [
            ...conversation,
            { role: 'model', text: JSON.stringify(currentQuestion) },
            { role: 'user', text: option }
        ];

        try {
            const response = await axios.post('http://localhost:3000/api/akinator', {
                messages: newConversation
            });

            setConversation(newConversation);
            setCurrentQuestion(response.data);
            setQuestionCount(prev => prev + 1);
        } catch (error) {
            console.error('Erreur:', error);
            setCurrentQuestion({
                message: "Oups, j'ai bugé ! 🫠 Clique pour réessayer !",
                options: ["Réessayer 🔄"],
                guess: null,
                confidence: 0
            });
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPokemonImage = async (pokemonName) => {
        try {
            const res = await axios.get(`http://localhost:3000/api/pokemons?name=${pokemonName}`);
            // L'API locale retourne souvent la liste dans res.data.data
            const pokemonsList = res.data.data || res.data;
            if (Array.isArray(pokemonsList) && pokemonsList.length > 0 && pokemonsList[0].image) {
                setPokemonImageUrl(pokemonsList[0].image);
            } else if (res.data && res.data.image) {
                setPokemonImageUrl(res.data.image);
            } else {
                throw new Error("Pas d'image trouvée localement");
            }
        } catch (err) {
            console.error("Erreur image locale, tentative PokeAPI :", err.message);
            try {
                // PokeAPI needs the english name or ID. Often the guessed name in FR might fail here 
                // but for 'mimiqui' we mapped it to 'mimikyu' in the test button.
                let searchName = pokemonName.toLowerCase().replace(/[^a-z0-9-]/g, '');
                // Handle specific french names for the demo if needed, but the search term is usually fine
                if (searchName === 'mimiqui') searchName = 'mimikyu';
                
                const pokeRes = await axios.get(`https://pokeapi.co/api/v2/pokemon/${searchName}`);
                if (pokeRes.data && pokeRes.data.sprites && pokeRes.data.sprites.other['official-artwork'].front_default) {
                    setPokemonImageUrl(pokeRes.data.sprites.other['official-artwork'].front_default);
                } else {
                    // Ultimate fallback
                    setPokemonImageUrl("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png");
                }
            } catch (pokeErr) {
                console.error("Erreur PokeAPI :", pokeErr.message);
                setPokemonImageUrl("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png");
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto py-4"
            ref={containerRef}
        >
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground/80 flex items-center justify-center gap-3">
                    <img src="/img/metamorph.png" alt="Métamorph" className="w-12 h-12 object-contain" />
                    Quel est ce Pokémon ?
                </h1>
                <p className="text-muted-foreground mt-2">Pense à un Pokémon et Métamorph va essayer de le deviner !</p>
                {questionCount > 0 && (
                    <div className="mt-2 flex items-center justify-center gap-4">
                        <span className="text-xs bg-primary/10 text-primary font-bold px-3 py-1 rounded-full">
                            Question {questionCount}
                        </span>
                        {currentQuestion?.confidence > 0 && (
                            <span className={cn(
                                "text-xs font-bold px-3 py-1 rounded-full",
                                currentQuestion.confidence >= 80 ? "bg-green-100 text-green-700" :
                                    currentQuestion.confidence >= 50 ? "bg-yellow-100 text-yellow-700" :
                                        "bg-gray-100 text-gray-600"
                            )}>
                                Confiance : {currentQuestion.confidence}%
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Game Over - Correct Guess */}
            <AnimatePresence>
                {gameOver && guessCorrect && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-panel p-8 rounded-3xl text-center mb-8"
                    >
                        <div className="relative w-40 h-40 mx-auto mb-4 flex items-center justify-center">
                            {/* The 'poof' Cloud Animation overlay layer */}
                            {isAnimating && (
                                <div className="absolute inset-0 z-20 animate-cloud w-full h-full" />
                            )}
                            
                            <motion.img
                                src={!isAnimating && pokemonImageUrl ? pokemonImageUrl : "/img/metamorph.png"}
                                alt={guessedPokemon}
                                className={cn(
                                    "w-32 h-32 object-contain drop-shadow-xl transition-opacity duration-300",
                                    isAnimating ? "opacity-0" : "opacity-100"
                                )}
                                animate={!isAnimating ? { rotate: [0, -5, 5, -5, 0] } : {}}
                                transition={{ duration: 0.5, delay: 0.1 }}
                            />
                        </div>
                        <h2 className="text-3xl font-display font-bold text-primary mb-2">
                            C'est {guessedPokemon} ! 🎉
                        </h2>
                        <p className="text-muted-foreground mb-2">
                            Métamorph a deviné en <strong>{questionCount}</strong> questions !
                        </p>
                        <div className="mb-6"></div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={startGame}
                            className="glass-button-primary px-8 py-3 flex items-center gap-2 mx-auto text-lg"
                        >
                            <RotateCcw size={20} />
                            Rejouer !
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Game Area */}
            {!gameOver && (
                <div className="space-y-6">
                    {/* Métamorph + Speech Bubble */}
                    <div className="flex items-start gap-4">
                        {/* Métamorph Avatar */}
                        <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                            className={cn("flex-shrink-0", isShaking && "animate-shake")}
                        >
                            <img
                                src="/img/metamorph.png"
                                alt="Métamorph"
                                className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-lg"
                            />
                        </motion.div>

                        {/* Speech Bubble */}
                        <div className="relative flex-1 min-w-0">
                            {/* Bubble triangle */}
                            <div className="absolute left-0 top-6 -translate-x-2 w-0 h-0 border-t-[10px] border-t-transparent border-r-[12px] border-r-white border-b-[10px] border-b-transparent" />

                            <AnimatePresence mode="wait">
                                {isLoading ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="glass-panel p-6 rounded-2xl rounded-tl-sm"
                                    >
                                        <div className="flex items-center gap-3 text-muted-foreground">
                                            <Loader2 className="animate-spin text-primary" size={20} />
                                            <span className="text-sm font-medium">Métamorph réfléchit...</span>
                                            <div className="flex gap-1">
                                                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : currentQuestion && (
                                    <motion.div
                                        key={questionCount}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="glass-panel p-6 rounded-2xl rounded-tl-sm"
                                    >
                                        {/* Guess indicator */}
                                        {currentQuestion.guess && (
                                            <div className="mb-3 flex items-center gap-2">
                                                <Sparkles size={16} className="text-yellow-500" />
                                                <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
                                                    PROPOSITION !
                                                </span>
                                            </div>
                                        )}
                                        <p className="text-foreground font-medium leading-relaxed">
                                            {currentQuestion.message}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Options Grid */}
                    <AnimatePresence mode="wait">
                        {!isLoading && currentQuestion?.options && (
                            <motion.div
                                key={questionCount + '-options'}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ delay: 0.2 }}
                                className="glass-panel p-6 rounded-3xl"
                            >
                                <p className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">
                                    Choisis ta réponse :
                                </p>
                                <div className={cn(
                                    "grid gap-3",
                                    currentQuestion.options.length <= 3 ? "grid-cols-1 sm:grid-cols-3" :
                                        currentQuestion.options.length <= 6 ? "grid-cols-2 sm:grid-cols-3" :
                                            "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                                )}>
                                    {currentQuestion.options.map((option, index) => (
                                        <motion.button
                                            key={option}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 + index * 0.05 }}
                                            whileHover={{ scale: 1.03, y: -2 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => handleOptionClick(option)}
                                            className={cn(
                                                "px-4 py-3 rounded-xl font-medium text-sm transition-all shadow-sm border-2",
                                                option.includes("🎉") || option.includes("Oui c'est ça")
                                                    ? "bg-green-50 border-green-300 text-green-700 hover:bg-green-100 hover:shadow-green-200/50"
                                                    : option.includes("Non") || option.includes("essaie encore")
                                                        ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                                                        : option.includes("sais pas")
                                                            ? "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
                                                            : "bg-white border-primary/20 text-foreground hover:bg-primary/5 hover:border-primary/40 hover:shadow-md"
                                            )}
                                        >
                                            {option}
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Restart button */}
                    {questionCount > 2 && !isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center"
                        >
                            <button
                                onClick={startGame}
                                className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 mx-auto"
                            >
                                <RotateCcw size={14} />
                                Recommencer avec un autre Pokémon
                            </button>
                        </motion.div>
                    )}

                </div>
            )}
        </motion.div>
    );
}
