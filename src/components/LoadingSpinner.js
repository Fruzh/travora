import { motion } from 'framer-motion';

export default function LoadingSpinner() {
    return (
        <div className="flex justify-center items-center h-64">
            <motion.div
                className="w-16 h-16 border-4 border-teal-400 border-t-cyan-600 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
        </div>
    );
}