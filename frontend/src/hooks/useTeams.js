import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const useTeams = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();
    const { addToast } = useToast();

    const fetchTeams = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:3000/api/teams');
            setTeams(res.data.teams);
        } catch (error) {
            console.error(error);
            addToast('Failed to load teams', 'error');
        } finally {
            setLoading(false);
        }
    }, [token, addToast]);

    useEffect(() => {
        fetchTeams();
    }, [fetchTeams]);

    const createTeam = async (name) => {
        try {
            const res = await axios.post('http://localhost:3000/api/teams', { name, pokemons: [] });
            setTeams(prev => [res.data, ...prev]);
            addToast('Team created successfully!', 'success');
            return true;
        } catch (error) {
            addToast(error.response?.data?.error || 'Failed to create team', 'error');
            return false;
        }
    };

    const deleteTeam = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/teams/${id}`);
            setTeams(prev => prev.filter(t => t._id !== id));
            addToast('Team deleted', 'success');
        } catch (error) {
            addToast('Failed to delete team', 'error');
        }
    };

    const addPokemonToTeam = async (teamId, pokemonId) => {
        const team = teams.find(t => t._id === teamId);
        if (!team) return;

        if (team.pokemons.length >= 6) {
            addToast('Team is full (max 6)', 'error');
            return;
        }
        if (team.pokemons.includes(pokemonId)) {
            addToast('Pokemon already in team', 'error');
            return;
        }

        const newPokemons = [...team.pokemons, pokemonId];
        try {
            const res = await axios.put(`http://localhost:3000/api/teams/${teamId}`, {
                name: team.name,
                pokemons: newPokemons
            });
            // Update local state
            setTeams(prev => prev.map(t => t._id === teamId ? res.data : t));
            addToast('Pokemon added to team!', 'success');
            return true;
        } catch (error) {
            addToast(error.response?.data?.error || 'Failed to add pokemon', 'error');
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
            });
            setTeams(prev => prev.map(t => t._id === teamId ? res.data : t));
            addToast('Pokemon removed', 'success');
        } catch (error) {
            addToast('Failed to remove pokemon', 'error');
        }
    };

    return { teams, loading, createTeam, deleteTeam, addPokemonToTeam, removePokemonFromTeam, refreshTeams: fetchTeams };
};
