import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import MusicPlayer from './MusicPlayer';
import Chatbot from './Chatbot';
import { motion } from 'framer-motion';

const Layout = () => {
    return (
        <div className="min-h-screen relative overflow-hidden text-foreground selection:bg-primary/20 bg-background">
            {/* Cute Background Animations */}
            <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[100px] animate-float" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 rounded-full blur-[100px] animate-float transition-all delay-1000" />

                {/* Floating Bubbles */}
                <div className="absolute top-[20%] right-[10%] w-20 h-20 bg-white/40 rounded-full blur-xl animate-bounce duration-[3000ms]" />
                <div className="absolute bottom-[30%] left-[5%] w-32 h-32 bg-white/40 rounded-full blur-xl animate-bounce duration-[5000ms]" />
            </div>

            <Navbar />
            <MusicPlayer />

            <main className="container mx-auto pt-44 px-4 pb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Outlet />
                </motion.div>
            </main>

            <Chatbot />

            <footer className="text-center py-8 text-foreground/60 text-sm font-medium">
                <p>© 2026 Pokéverse. Created with ❤️ for Pokémon fans.</p>
            </footer>
        </div>
    );
};

export default Layout;
