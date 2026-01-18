import { motion } from 'framer-motion';

export function CarteKPI({ titre, valeur, borderColor = 'border-blue-500', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`card bg-white rounded-xl shadow-md p-3 sm:p-4 border-l-4 border ${borderColor}`}
    >
      <p className="text-xs sm:text-sm text-slate-600 mb-1">{titre}</p>
      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">{valeur}</p>
    </motion.div>
  );
}
