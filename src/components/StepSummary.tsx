import { useMemo } from 'react';
import { Shield, Sparkles, Layers, Smile, Activity, Calendar, Clock, User, Mail, Phone, FileText, Stethoscope, Landmark } from 'lucide-react';
import { AppointmentFormValues } from '../types';
import { dentists, services } from '../data';

interface StepSummaryProps {
  values: AppointmentFormValues;
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

export default function StepSummary({ values }: StepSummaryProps) {
  const selectedDentist = useMemo(() => dentists.find(d => d.id === values.dentistId), [values.dentistId]);
  const selectedService = useMemo(() => services.find(s => s.id === values.serviceId), [values.serviceId]);

  const formattedDate = useMemo(() => {
    if (!values.date) return '';
    return new Date(values.date + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [values.date]);

  return (
    <div className="space-y-6">
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold font-heading text-gray-900 dark:text-white">
          Review Your Appointment Details
        </h2>
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
          Double-check your selection details before final placement confirmation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side: Summary Cards */}
        <div className="space-y-4">
          {/* Card 1: Dentist */}
          {selectedDentist && (
            <div className="p-4 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-150 dark:border-slate-800 rounded-xl flex items-center gap-4">
              <img
                src={selectedDentist.avatar}
                alt={selectedDentist.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-xl object-cover border border-gray-200 dark:border-slate-800"
              />
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Assigned Dentist
                </span>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                  {selectedDentist.name}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                  {selectedDentist.specialty}
                </p>
              </div>
            </div>
          )}

          {/* Card 2: Service */}
          {selectedService && (
            <div className="p-4 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-150 dark:border-slate-800 rounded-xl flex items-center gap-4">
              <div className="p-3 bg-indigo-100/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <ServiceIcon name={selectedService.iconName} className="w-5.5 h-5.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Selected Treatment
                </span>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                  {selectedService.name}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                  Duration: {selectedService.duration}
                </p>
              </div>
            </div>
          )}

          {/* Card 3: Date & Time */}
          <div className="p-4 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-150 dark:border-slate-800 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-indigo-100/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Calendar className="w-5.5 h-5.5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Appointment Schedule
              </span>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                {formattedDate}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5 inline text-gray-400" />
                Selected Slot: {values.timeSlot}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Account Patient Info & Cost Invoice */}
        <div className="space-y-4">
          {/* Card 4: Patient Info */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              Patient Information
            </h4>
            
            <div className="space-y-2.5 text-sm pt-1">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Full Name</span>
                <span className="font-semibold text-gray-900 dark:text-white text-right">{values.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Email Address</span>
                <span className="font-medium text-gray-900 dark:text-white text-right truncate max-w-[200px]">{values.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Phone Number</span>
                <span className="font-semibold text-gray-900 dark:text-white text-right">{values.phone}</span>
              </div>
              {values.notes ? (
                <div className="pt-2.5 border-t border-gray-150 dark:border-slate-800 text-xs">
                  <span className="font-semibold text-gray-500 dark:text-gray-400 block mb-1">Additional Notes:</span>
                  <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-gray-150 dark:border-slate-800 italic line-clamp-3">
                    {values.notes}
                  </p>
                </div>
              ) : (
                <div className="pt-2 border-t border-gray-150 dark:border-slate-800 text-xs text-gray-400 italic">
                  No medical notes specified.
                </div>
              )}
            </div>
          </div>

          {/* Pricing Estimation Reciept */}
          {selectedService && (
            <div className="p-5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-3.5">
              <h4 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Landmark className="w-4 h-4 text-gray-400" />
                Price Estimation Breakdown
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
                  <span>Dental Checkup/Service</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {selectedService.price === 0 ? 'Free' : `$${selectedService.price}.00`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
                  <span>Booking Registration</span>
                  <span className="text-green-600 dark:text-green-400 font-semibold uppercase text-xs bg-green-50 dark:bg-green-950/30 px-2 py-0.5 rounded-sm border border-green-100 dark:border-green-900/30">
                    Complimentary
                  </span>
                </div>
                <div className="h-px bg-gray-200 dark:bg-slate-800 my-2"></div>
                <div className="flex items-center justify-between text-base font-bold text-gray-950 dark:text-white">
                  <span>Total Due Today</span>
                  <span className="text-indigo-600 dark:text-indigo-400">
                    {selectedService.price === 0 ? '$0.00' : `$${selectedService.price}.00`}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
