import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { Check, Lock, KeyRound, Sparkles, Eye, EyeOff, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import axios from 'axios';

// Mêmes avatars que Register
const AVATARS = [
    { id: 1, name: 'Pikachu', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png' },
    { id: 2, name: 'Psykokwak', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png' },
    { id: 3, name: 'Mew', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png' },
    { id: 4, name: 'Bulbizarre', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png' },
    { id: 5, name: 'Salamèche', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png' },
    { id: 6, name: 'Carapuce', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png' },
    { id: 7, name: 'Rondoudou', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png' },
    { id: 8, name: 'Nymphali', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/700.png' },
    { id: 9, name: 'Mimiqui', url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/778.png' },
];

export default function Settings() {
    const { user, token, logout } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();

    const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || AVATARS[0].url);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPw, setShowCurrentPw] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);
    const [savingAvatar, setSavingAvatar] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    const [avatarSuccess, setAvatarSuccess] = useState(false);

    if (!user) {
        navigate('/login');
        return null;
    }

    const handleSaveAvatar = async () => {
        setSavingAvatar(true);
        setAvatarSuccess(false);
        try {
            const res = await axios.put('http://localhost:3000/api/auth/me',
                { avatar: selectedAvatar },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Update user in state - we need to refresh
            addToast('Avatar mis à jour ! ✨', 'success');
            setAvatarSuccess(true);
            // Force reload to refresh user data
            setTimeout(() => window.location.reload(), 800);
        } catch (error) {
            addToast(error.response?.data?.error || 'Erreur lors de la mise à jour', 'error');
        } finally {
            setSavingAvatar(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            addToast('Les mots de passe ne correspondent pas', 'error');
            return;
        }
        if (newPassword.length < 6) {
            addToast('Le nouveau mot de passe doit faire au moins 6 caractères', 'error');
            return;
        }
        setSavingPassword(true);
        try {
            await axios.put('http://localhost:3000/api/auth/me',
                { currentPassword, newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            addToast('Mot de passe changé avec succès ! 🔒', 'success');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            addToast(error.response?.data?.error || 'Erreur lors du changement', 'error');
        } finally {
            setSavingPassword(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto space-y-8"
        >
            <div className="text-center">
                <h1 className="text-3xl font-display font-bold text-foreground/80 flex items-center justify-center gap-2">
                    Réglages
                    <img src="/img/reglage.png" alt="" className="w-10 h-10 object-contain" />
                </h1>
                <p className="text-muted-foreground mt-1">Personnalise ton profil de dresseur</p>
            </div>

            {/* Section Avatar */}
            <div className="glass-panel p-8 rounded-3xl">
                <h2 className="text-xl font-display font-bold text-primary mb-2 flex items-center gap-2">
                    <Sparkles size={20} />
                    Photo de profil
                </h2>
                <p className="text-muted-foreground text-sm mb-6">Choisis le Pokémon qui te représente !</p>

                {/* Current avatar preview */}
                <div className="flex items-center gap-4 mb-6 p-4 bg-white/50 rounded-2xl">
                    <img
                        src={user.avatar || AVATARS[0].url}
                        alt="Avatar actuel"
                        className="w-16 h-16 rounded-full object-contain bg-white border-2 border-primary/30 shadow-md"
                    />
                    <div>
                        <p className="font-bold text-foreground">{user.username}</p>
                        <p className="text-xs text-muted-foreground">Avatar actuel</p>
                    </div>
                    {selectedAvatar !== user.avatar && (
                        <div className="ml-auto flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">→</span>
                            <img
                                src={selectedAvatar}
                                alt="Nouvel avatar"
                                className="w-16 h-16 rounded-full object-contain bg-white border-2 border-secondary/50 shadow-md ring-2 ring-secondary/30"
                            />
                        </div>
                    )}
                </div>

                {/* Avatar Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-6">
                    {AVATARS.map((avatar) => (
                        <motion.button
                            key={avatar.id}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedAvatar(avatar.url)}
                            className={cn(
                                "relative w-full aspect-square rounded-2xl p-2 transition-all border-2",
                                selectedAvatar === avatar.url
                                    ? "bg-white shadow-lg border-primary ring-2 ring-primary/30"
                                    : "bg-white/50 border-transparent hover:bg-white/80 hover:shadow-md"
                            )}
                        >
                            <img src={avatar.url} alt={avatar.name} className="w-full h-full object-contain" />
                            {selectedAvatar === avatar.url && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 bg-primary text-white rounded-full p-0.5 shadow-md">
                                    <Check size={12} strokeWidth={3} />
                                </motion.div>
                            )}
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-bold text-foreground/60 bg-white/80 px-1.5 rounded-full whitespace-nowrap">
                                {avatar.name}
                            </span>
                        </motion.button>
                    ))}
                </div>

                <button
                    onClick={handleSaveAvatar}
                    disabled={savingAvatar || selectedAvatar === user.avatar}
                    className={cn(
                        "glass-button-primary w-full flex justify-center items-center gap-2 transition-all",
                        (selectedAvatar === user.avatar) && "opacity-50 cursor-not-allowed"
                    )}
                >
                    {savingAvatar ? (
                        <Loader2 className="animate-spin" size={18} />
                    ) : avatarSuccess ? (
                        <><Check size={18} /> Sauvegardé !</>
                    ) : (
                        <><Sparkles size={18} /> Changer mon avatar</>
                    )}
                </button>
            </div>

            {/* Section Mot de passe */}
            <div className="glass-panel p-8 rounded-3xl">
                <h2 className="text-xl font-display font-bold text-primary mb-2 flex items-center gap-2">
                    <Lock size={20} />
                    Changer le mot de passe
                </h2>
                <p className="text-muted-foreground text-sm mb-6">Sécurise ton compte de dresseur !</p>

                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-foreground/70 ml-1">Mot de passe actuel</label>
                        <div className="relative">
                            <input
                                type={showCurrentPw ? 'text' : 'password'}
                                className="glass-input w-full bg-white/60 focus:bg-white pr-10"
                                placeholder="••••••••"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                            <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-bold text-foreground/70 ml-1">Nouveau mot de passe</label>
                        <div className="relative">
                            <input
                                type={showNewPw ? 'text' : 'password'}
                                className="glass-input w-full bg-white/60 focus:bg-white pr-10"
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                            <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-bold text-foreground/70 ml-1">Confirmer le mot de passe</label>
                        <input
                            type="password"
                            className={cn(
                                "glass-input w-full bg-white/60 focus:bg-white",
                                confirmPassword && confirmPassword !== newPassword && "border-red-300 focus:ring-red-300"
                            )}
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        {confirmPassword && confirmPassword !== newPassword && (
                            <p className="text-red-400 text-xs ml-1 mt-1">Les mots de passe ne correspondent pas</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={savingPassword || !currentPassword || !newPassword || newPassword !== confirmPassword}
                        className="glass-button w-full flex justify-center items-center gap-2 bg-primary/10 hover:bg-primary/20 border-primary/30 disabled:opacity-50"
                    >
                        {savingPassword ? (
                            <Loader2 className="animate-spin" size={18} />
                        ) : (
                            <><KeyRound size={18} /> Changer le mot de passe</>
                        )}
                    </button>
                </form>
            </div>
        </motion.div>
    );
}
