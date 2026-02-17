import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 3000);
    }, []);

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
                <AnimatePresence>
                    {toasts.map(toast => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 20, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            layout
                            className={`glass-panel pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg border-l-4 shadow-lg min-w-[300px]
                                ${toast.type === 'success' ? 'border-l-green-500 bg-green-500/10' :
                                    toast.type === 'error' ? 'border-l-red-500 bg-red-500/10' :
                                        'border-l-blue-500 bg-blue-500/10'}`}
                        >
                            {toast.type === 'success' && <CheckCircle size={20} className="text-green-500" />}
                            {toast.type === 'error' && <XCircle size={20} className="text-red-500" />}
                            {toast.type === 'info' && <Info size={20} className="text-blue-500" />}
                            <span className="text-sm font-medium text-white">{toast.message}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
