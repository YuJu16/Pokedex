import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const useFavorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();
    const { addToast } = useToast();

    const authConfig = useMemo(() => ({
        headers: { Authorization: `Bearer ${token}` }
    }), [token]);

    const fetchFavorites = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:3000/api/favorites', authConfig);
            setFavorites(res.data.favorites || []);
        } catch (error) {
            console.error(error);
            addToast('Impossible de charger les favoris', 'error');
        } finally {
            setLoading(false);
        }
    }, [token, addToast, authConfig]);

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    const addFavorite = async (pokemonId) => {
        try {
            await axios.post(`http://localhost:3000/api/favorites/${pokemonId}`, {}, authConfig);
            await fetchFavorites();
            addToast('Ajouté aux favoris ! ⭐', 'success');
            return true;
        } catch (error) {
            addToast(error.response?.data?.error || 'Impossible d\'ajouter aux favoris', 'error');
            return false;
        }
    };

    const removeFavorite = async (pokemonId) => {
        try {
            await axios.delete(`http://localhost:3000/api/favorites/${pokemonId}`, authConfig);
            setFavorites(prev => prev.filter(p => p.id !== pokemonId));
            addToast('Retiré des favoris', 'success');
        } catch (error) {
            addToast('Impossible de retirer des favoris', 'error');
        }
    };

    const isFavorite = (pokemonId) => {
        return favorites.some(p => p.id === pokemonId);
    };

    return { favorites, loading, addFavorite, removeFavorite, isFavorite, refreshFavorites: fetchFavorites };
};
