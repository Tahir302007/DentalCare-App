import { motion } from 'motion/react';
import { Shield, Sparkles, Layers, Smile, Activity, Clock, DollarSign, Check } from 'lucide-react';
import { Service } from '../types';
import { services } from '../data';

interface StepServiceProps {
  selectedServiceId: string;
  onSelect: (id: string) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield,
  Sparkles,
  Layers,
  Smile,
  Activity,
};

function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = iconMap[name] || Shield;
  return <IconComponent className={className} />;
}

export default function StepService({ selectedServiceId, onSelect }: StepServiceProps) {
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
          Choose a Service
        </h2>
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
          Select the treatment or consultation you would like to schedule today.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-4"
      >
        {services.map((service: Service) => {
          const isSelected = selectedServiceId === service.id;
          return (
            <motion.div
              id={`service-card-${service.id}`}
              key={service.id}
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.995 }}
              onClick={() => onSelect(service.id)}
              className={`relative cursor-pointer rounded-2xl border-2 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all duration-200 outline-none
                ${
                  isSelected
                    ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/40 dark:bg-indigo-950/20 shadow-md ring-2 ring-indigo-500/20'
                    : 'border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-gray-300 dark:hover:border-slate-750'
                }`}
            >
              {/* Checkmark overlay */}
              {isSelected && (
                <div className="absolute top-4 right-4 bg-indigo-600 dark:bg-indigo-500 text-white rounded-full p-1 shadow-xs">
                  <Check className="w-4 h-4" />
                </div>
              )}

              {/* Icon */}
              <div className={`p-4 rounded-xl shrink-0 ${
                isSelected 
                  ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400' 
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400'
              }`}>
                <ServiceIcon name={service.iconName} className="w-7 h-7" />
              </div>

              {/* Content info */}
              <div className="flex-1 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pr-6">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white font-heading">
                    {service.name}
                  </h3>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-xl">
                  {service.description}
                </p>

                {/* Badges price + duration */}
                <div className="flex items-center gap-3.5 pt-2 text-xs">
                  <div className="flex items-center gap-1 font-medium text-gray-700 dark:text-slate-300">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{service.duration}</span>
                  </div>
                  <div className="h-3 w-px bg-gray-200 dark:bg-slate-700"></div>
                  <div className="flex items-center gap-1 font-semibold text-gray-900 dark:text-white">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                    <span>{service.price === 0 ? 'Free Consultation' : `$${service.price}`}</span>
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
