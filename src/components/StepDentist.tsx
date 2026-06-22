import { motion } from 'motion/react';
import { Star, GraduationCap, Calendar, Check } from 'lucide-react';
import { Dentist } from '../types';
import { dentists } from '../data';

interface StepDentistProps {
  selectedDentistId: string;
  onSelect: (id: string) => void;
}

export default function StepDentist({ selectedDentistId, onSelect }: StepDentistProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } },
  };

  return (
    <div className="space-y-6">
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold font-heading text-gray-900 dark:text-white">
          Select Your Dentist
        </h2>
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
          Choose from our team of certified dental specialists for your personalized care.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {dentists.map((dentist: Dentist) => {
          const isSelected = selectedDentistId === dentist.id;
          return (
            <motion.div
              id={`dentist-card-${dentist.id}`}
              key={dentist.id}
              variants={itemVariants}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.995 }}
              onClick={() => onSelect(dentist.id)}
              className={`relative cursor-pointer rounded-2xl border-2 p-5 flex flex-col sm:flex-row gap-4.5 transition-all duration-200 outline-none
                ${
                  isSelected
                    ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/40 dark:bg-indigo-950/20 shadow-md ring-2 ring-indigo-500/20'
                    : 'border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-gray-300 dark:hover:border-slate-750 shadow-xs'
                }`}
            >
              {/* Checkmark indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-full p-1 shadow-sm">
                  <Check className="w-4 h-4" />
                </div>
              )}

              {/* Dentist Avatar */}
              <div className="relative shrink-0 mx-auto sm:mx-0">
                <img
                  src={dentist.avatar}
                  alt={dentist.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-sm bg-gray-100"
                />
              </div>

              {/* Details */}
              <div className="flex-1 flex flex-col justify-between text-center sm:text-left">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white font-heading">
                      {dentist.name}
                    </h3>
                    <div className="flex items-center justify-center sm:justify-start gap-1 text-sm font-semibold text-amber-500 self-center sm:self-auto">
                      <Star className="w-4 h-4 fill-amber-500" />
                      <span>{dentist.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {dentist.specialty}
                  </p>

                  <div className="mt-3.5 space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <GraduationCap className="w-4 h-4 text-gray-400 dark:text-slate-500 shrink-0" />
                      <span className="truncate">{dentist.education}</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <Calendar className="w-4 h-4 text-gray-400 dark:text-slate-500 shrink-0" />
                      <span>Available: {dentist.availability.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
