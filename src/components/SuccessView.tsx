import { useMemo } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ChevronRight, Share2, Calendar, Clock, User, ClipboardCheck, Printer } from 'lucide-react';
import { AppointmentFormValues } from '../types';
import { dentists, services } from '../data';

interface SuccessViewProps {
  values: AppointmentFormValues;
  onReset: () => void;
}

export default function SuccessView({ values, onReset }: SuccessViewProps) {
  const selectedDentist = useMemo(() => dentists.find(d => d.id === values.dentistId), [values.dentistId]);
  const selectedService = useMemo(() => services.find(s => s.id === values.serviceId), [values.serviceId]);

  // Generate a random booking reference code
  const bookingRef = useMemo(() => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '01232456789';
    let res = 'DENT-';
    for (let i = 0; i < 3; i++) res += letters.charAt(Math.floor(Math.random() * letters.length));
    res += '-';
    for (let i = 0; i < 4; i++) res += nums.charAt(Math.floor(Math.random() * nums.length));
    return res;
  }, []);

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
    <div className="max-w-xl mx-auto py-4 text-center">
      {/* Animated Success Badge Check */}
      <div className="flex justify-center mb-6">
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 15 }}
          className="bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 p-5 rounded-full text-emerald-600 dark:text-emerald-400"
        >
          <CheckCircle2 className="w-14 h-14" />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <h2 className="text-3xl font-extrabold font-heading text-gray-900 dark:text-white tracking-tight">
          Appointment Confirmed!
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Your dental booking is completed. A confirmation invoice and prep instructions have been dispatched to your email address: <span className="font-semibold text-gray-700 dark:text-gray-300">{values.email}</span>.
        </p>
      </motion.div>

      {/* Grid summarizing details */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.35 }}
        className="mt-8 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 shadow-md text-left space-y-4"
      >
        <div className="flex items-center justify-between pb-3.5 border-b border-gray-150 dark:border-slate-800">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <ClipboardCheck className="w-4.5 h-4.5 text-indigo-500" />
            Booking Details
          </span>
          <span className="font-mono text-xs font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/30 px-3 py-1 rounded-sm">
            {bookingRef}
          </span>
        </div>

        <div className="space-y-3.5 text-sm">
          {selectedDentist && (
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400">Dentist Specialist</span>
              <span className="font-semibold text-gray-900 dark:text-white">{selectedDentist.name}</span>
            </div>
          )}

          {selectedService && (
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400">Treatment / Service</span>
              <span className="font-semibold text-gray-900 dark:text-white text-right">{selectedService.name}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">Scheduled Date</span>
            <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gray-400" />
              {formattedDate}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">Time Segment</span>
            <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gray-400" />
              {values.timeSlot}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">Registered Patient</span>
            <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
              <User className="w-4 h-4 text-gray-400" />
              {values.name}
            </span>
          </div>
        </div>

        {/* Suggesting some instructions pre exam */}
        <div className="pt-4 mt-2 border-t border-gray-150 dark:border-slate-800 text-xs text-gray-400 leading-relaxed bg-gray-50/60 dark:bg-slate-950/15 p-3 rounded-xl border border-dashed border-gray-200 dark:border-slate-800">
          <span className="font-bold text-gray-500 dark:text-gray-400 block mb-1">Pre-Appointment Guidelines:</span>
          Please arrive 10 minutes ahead of schedule to complete standard dental files. For teeth whitening or scaling, avoid staining foods or carbonated beverages 2 hours prior. Contact our desk at +1 (555) 001-0000 to reschedule or update notes.
        </div>
      </motion.div>

      {/* Options and Print buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
      >
        <button
          type="button"
          onClick={() => window.print()}
          className="w-full sm:w-auto px-5 py-3 rounded-xl border border-gray-250 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95"
        >
          <Printer className="w-4 h-4 text-gray-400" />
          Print Confirmation Receipt
        </button>

        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-xs font-bold text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
        >
          Schedule Another Appointment
          <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}
