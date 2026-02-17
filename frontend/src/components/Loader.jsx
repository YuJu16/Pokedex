import { motion } from 'framer-motion';

const Loader = () => {
    return (
        <div className="flex justify-center items-center h-64">
            <motion.div
                className="relative w-16 h-16"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
                <div className="absolute inset-0 border-4 border-t-poke-red border-b-white border-l-poke-red border-r-white rounded-full" />
                <div className="absolute inset-2 bg-poke-blue/20 rounded-full blur-sm" />
                <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-white border-2 border-gray-800 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg" />
            </motion.div>
        </div>
    );
};

export default Loader;
