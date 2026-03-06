import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const useTeams = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();
    const { addToast } = useToast();

    // Créer une config axios avec le token d'authentification
    const authConfig = useMemo(() => ({
        headers: { Authorization: `Bearer ${token}` }
    }), [token]);

    const fetchTeams = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:3000/api/teams', authConfig);
            setTeams(res.data.teams);
        } catch (error) {
            console.error(error);
            addToast('Impossible de charger les équipes', 'error');
        } finally {
            setLoading(false);
        }
    }, [token, addToast, authConfig]);

    useEffect(() => {
        fetchTeams();
    }, [fetchTeams]);

    const createTeam = async (name) => {
        try {
            const res = await axios.post('http://localhost:3000/api/teams', { name, pokemons: [] }, authConfig);
            setTeams(prev => [res.data, ...prev]);
            addToast('Équipe créée avec succès !', 'success');
            return true;
        } catch (error) {
            addToast(error.response?.data?.error || 'Impossible de créer l\'équipe', 'error');
            return false;
        }
    };

    const deleteTeam = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/teams/${id}`, authConfig);
            setTeams(prev => prev.filter(t => t._id !== id));
            addToast('Équipe supprimée', 'success');
        } catch (error) {
            addToast('Impossible de supprimer l\'équipe', 'error');
        }
    };

    const addPokemonToTeam = async (teamId, pokemonId) => {
        const team = teams.find(t => t._id === teamId);
        if (!team) return;

        if (team.pokemons.length >= 6) {
            addToast('Équipe complète (max 6)', 'error');
            return;
        }
        if (team.pokemons.includes(pokemonId)) {
            addToast('Pokémon déjà dans l\'équipe', 'error');
            return;
        }

        const newPokemons = [...team.pokemons, pokemonId];
        try {
            const res = await axios.put(`http://localhost:3000/api/teams/${teamId}`, {
                name: team.name,
                pokemons: newPokemons
            }, authConfig);
            setTeams(prev => prev.map(t => t._id === teamId ? res.data : t));
            addToast('Pokémon ajouté à l\'équipe !', 'success');
            return true;
        } catch (error) {
            addToast(error.response?.data?.error || 'Impossible d\'ajouter le Pokémon', 'error');
            return false;
        }
    };

    const removePokemonFromTeam = async (teamId, pokemonId) => {
        const team = teams.find(t => t._id === teamId);
        if (!team) return;

        const newPokemons = team.pokemons.filter(id => id !== pokemonId);
        try {
            const res = await axios.put(`http://localhost:3000/api/teams/${teamId}`, {
                name: team.name,
                pokemons: newPokemons
            }, authConfig);
            setTeams(prev => prev.map(t => t._id === teamId ? res.data : t));
            addToast('Pokémon retiré', 'success');
        } catch (error) {
            addToast('Impossible de retirer le Pokémon', 'error');
        }
    };

    return { teams, loading, createTeam, deleteTeam, addPokemonToTeam, removePokemonFromTeam, refreshTeams: fetchTeams };
};
