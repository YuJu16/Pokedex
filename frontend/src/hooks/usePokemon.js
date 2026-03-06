import { useState, useEffect } from 'react';
import axios from 'axios';

export const usePokemon = () => {
    const [pokemon, setPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPokemon = async () => {
            try {
                // Récupère les Pokémon depuis le backend local (limite haute pour tout récupérer)
                const response = await axios.get('http://localhost:3000/api/pokemons?limit=1500');
                setPokemon(response.data.data);
                setLoading(false);
            } catch (err) {
                console.error("Erreur lors du chargement des Pokémon:", err);
                setError(err);
                setLoading(false);
            }
        };

        fetchPokemon();
    }, []);

    return { pokemon, loading, error };
};
