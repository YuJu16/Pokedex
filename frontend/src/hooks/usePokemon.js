import { useState, useEffect } from 'react';
import axios from 'axios';

export const usePokemon = () => {
    const [pokemon, setPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPokemon = async () => {
            try {
                // Fetching Generation 1 Pokemon
                const response = await axios.get('https://tyradex.vercel.app/api/v1/gen/1');
                setPokemon(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching pokemon:", err);
                setError(err);
                setLoading(false);
            }
        };

        fetchPokemon();
    }, []);

    return { pokemon, loading, error };
};
