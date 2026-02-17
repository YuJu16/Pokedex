import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MusicPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(0.1); // Low volume (10%)
    const audioRef = useRef(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;

            // Try autoplay
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    setIsPlaying(true);
                }).catch(error => {
                    // Auto-play was prevented
                    console.log("Autoplay prevented:", error);
                    setIsPlaying(false);
                });
            }
        }
    }, []);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2">
            <audio
                ref={audioRef}
                src="/ost/bgm.mp3"
                loop
            />

            <motion.button
                onClick={togglePlay}
                className={`glass-button rounded-full p-3 flex items-center justify-center gap-2 transition-all duration-300 ${isPlaying ? 'bg-primary/10 text-primary border-primary/30' : 'bg-white/50 text-muted-foreground'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {isPlaying ? (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                        <Music size={20} />
                    </motion.div>
                ) : (
                    <Music size={20} />
                )}
                <span className="text-xs font-bold hidden md:block">
                    {isPlaying ? 'Snowbelle City' : 'Music Paused'}
                </span>
            </motion.button>

            <AnimatePresence>
                {isPlaying && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 'auto', opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="glass-panel py-2 px-3 flex items-center gap-2 overflow-hidden"
                    >
                        <button onClick={toggleMute} className="hover:text-primary transition-colors">
                            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="0.5"
                            step="0.01"
                            value={isMuted ? 0 : volume}
                            onChange={(e) => {
                                const newVol = parseFloat(e.target.value);
                                setVolume(newVol);
                                if (audioRef.current) audioRef.current.volume = newVol;
                                if (newVol > 0 && isMuted) setIsMuted(false);
                            }}
                            className="w-20 h-1 bg-primary/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MusicPlayer;
