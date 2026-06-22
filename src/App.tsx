import { useState, useEffect, useMemo } from 'react';
import { Formik, Form, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'motion/react';
import {
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Shield,
  Smile,
  Activity,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  Heart,
  Undo2
} from 'lucide-react';

import { AppointmentFormValues } from './types';
import { dentists, services } from './data';

import ThemeToggle from './components/ThemeToggle';
import StepDentist from './components/StepDentist';
import StepService from './components/StepService';
import StepDateTime from './components/StepDateTime';
import StepPersonalDetails from './components/StepPersonalDetails';
import StepSummary from './components/StepSummary';
import SuccessView from './components/SuccessView';

// Yup validation Schema for Step 4
const schemaStep4 = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name is too short (min 2 characters)')
    .required('Full name is required to book'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email address is required'),
  phone: Yup.string()
    .matches(
      /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]{6,15}$/,
      'Invalid phone format (e.g., +1 (555) 001-0010 or 10-digit number)'
    )
    .required('Phone number is required'),
});

// Empty default state for form inputs
const emptyInitialValues: AppointmentFormValues = {
  dentistId: '',
  serviceId: '',
  date: '',
  timeSlot: '',
  name: '',
  email: '',
  phone: '',
  notes: '',
};

// Formik persistence helper to save data reactively
function FormikLocalStoragePersist() {
  const { values } = useFormikContext<AppointmentFormValues>();

  useEffect(() => {
    localStorage.setItem('dentist-appt-values', JSON.stringify(values));
  }, [values]);

  return null;
}

export default function App() {
  // Theme Management (init from local preference)
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const stored = localStorage.getItem('dentist-theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply visual theme class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('dentist-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('dentist-theme', 'light');
    }
  }, [darkMode]);

  // Form step controls (1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(() => {
    const storedStep = localStorage.getItem('dentist-appt-step');
    if (storedStep) {
      const parsed = parseInt(storedStep, 10);
      if (parsed >= 1 && parsed <= 5) return parsed;
    }
    return 1;
  });

  // Check if final appointment submission succeeded
  const [isSubmitted, setIsSubmitted] = useState<boolean>(() => {
    return localStorage.getItem('dentist-appt-submitted') === 'true';
  });

  // Load wizard initial values from LocalStorage or fallback
  const initialValues = useMemo<AppointmentFormValues>(() => {
    const stored = localStorage.getItem('dentist-appt-values');
    if (stored) {
      try {
        return JSON.parse(stored) as AppointmentFormValues;
      } catch (err) {
        return emptyInitialValues;
      }
    }
    return emptyInitialValues;
  }, []);

  // Sync step tracking to localstorage
  useEffect(() => {
    localStorage.setItem('dentist-appt-step', String(currentStep));
  }, [currentStep]);

  // Visual text mappings for step indicators
  const steps = [
    { title: 'Dentist Specialist', desc: 'Choose a provider' },
    { title: 'Service Cleanse', desc: 'Choose a treatment' },
    { title: 'Appointment Schedule', desc: 'Pick date & slot' },
    { title: 'Patient Profile', desc: 'Personal credentials' },
    { title: 'Review & Verify', desc: 'Verify full receipt' },
  ];

  // Map to Service Icons inside Sidebar Summaries
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Shield,
    Sparkles,
    Smile,
    Activity,
  };

  const getSidebarDetail = (stepIdx: number, values: AppointmentFormValues) => {
    if (stepIdx === 0 && values.dentistId) {
      const doc = dentists.find(d => d.id === values.dentistId);
      return doc ? doc.name : null;
    }
    if (stepIdx === 1 && values.serviceId) {
      const srv = services.find(s => s.id === values.serviceId);
      return srv ? `${srv.name} ($${srv.price})` : null;
    }
    if (stepIdx === 2 && values.date && values.timeSlot) {
      const dateStr = new Date(values.date + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      return `${dateStr} @ ${values.timeSlot}`;
    }
    if (stepIdx === 3 && values.name) {
      return values.name;
    }
    return null;
  };

  // Check if fields for standard steps are valid before changing pages
  const isTransitionValid = async (
    step: number,
    values: AppointmentFormValues,
    setFieldTouched: any
  ) => {
    if (step === 1) return !!values.dentistId;
    if (step === 2) return !!values.serviceId;
    if (step === 3) return !!values.date && !!values.timeSlot;
    if (step === 4) {
      setFieldTouched('name', true);
      setFieldTouched('email', true);
      setFieldTouched('phone', true);
      try {
        await schemaStep4.validate(
          { name: values.name, email: values.email, phone: values.phone },
          { abortEarly: false }
        );
        return true;
      } catch (err) {
        return false;
      }
    }
    return true;
  };

  // Reset appointment states entirely
  const handleResetAppointment = () => {
    localStorage.removeItem('dentist-appt-values');
    localStorage.removeItem('dentist-appt-step');
    localStorage.removeItem('dentist-appt-submitted');
    setIsSubmitted(false);
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-300">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-gray-150 dark:border-slate-900 py-4.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600 dark:bg-indigo-500 text-white shadow-md shadow-indigo-600/10">
              <Stethoscope className="w-5.5 h-5.5" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight font-heading text-indigo-950 dark:text-white leading-tight">
                DentalCare
              </h1>
              <p className="text-[10px] font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">
                Appointment Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Dark Mode toggle */}
            <ThemeToggle darkMode={darkMode} onToggle={() => setDarkMode(!darkMode)} />
          </div>
        </div>
      </header>

      {/* Main Scheduler Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        {isSubmitted ? (
          <div className="w-full">
            <SuccessView
              values={
                JSON.parse(localStorage.getItem('dentist-appt-values') || '{}') as AppointmentFormValues
              }
              onReset={handleResetAppointment}
            />
          </div>
        ) : (
          <Formik
            initialValues={initialValues}
            onSubmit={(values) => {
              // Final submission function
              console.log('=== DENTAL APPOINTMENT PLACED SUCCESSFULLY ===');
              console.log('Timestamp:', new Date().toISOString());
              console.log('Review Selections:', values);
              
              const targetDoc = dentists.find(d => d.id === values.dentistId);
              const targetSrv = services.find(s => s.id === values.serviceId);
              
              console.log('Dentist:', targetDoc?.name || 'Unassigned');
              console.log('Service:', targetSrv?.name || 'Unchosen');
              console.log('Schedule:', values.date, '@', values.timeSlot);
              console.log('Invoice Charge:', targetSrv ? `$${targetSrv.price}` : '$0.00');
              console.log('==============================================');

              localStorage.setItem('dentist-appt-submitted', 'true');
              setIsSubmitted(true);
            }}
          >
            {(formik) => {
              const { values, setFieldValue, setFieldTouched, handleSubmit, dirty } = formik;

              const handleNext = async () => {
                const isValid = await isTransitionValid(currentStep, values, setFieldTouched);
                if (isValid && currentStep < 5) {
                  setCurrentStep((prev) => prev + 1);
                }
              };

              const handleBack = () => {
                if (currentStep > 1) {
                  setCurrentStep((prev) => prev - 1);
                }
              };

              // Quick skip helper to clear storage
              const handleClearWizard = () => {
                if (window.confirm('Are you sure you want to clear your selections and start over?')) {
                  formik.resetForm({ values: emptyInitialValues });
                  localStorage.removeItem('dentist-appt-values');
                  setCurrentStep(1);
                }
              };

              return (
                <Form onSubmit={handleSubmit} className="w-full">
                  {/* Dynamic Global values persistent mechanism */}
                  <FormikLocalStoragePersist />

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    
                    {/* Stepper Sidebar Navigation Indicator (Left 4 cols) */}
                    <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-gray-250 dark:border-slate-900/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 mb-6 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
                          <Heart className="w-3.5 h-3.5 animate-pulse" />
                          <span>Progress Steps</span>
                        </div>

                        <ul className="space-y-5">
                          {steps.map((step, idx) => {
                            const stepNum = idx + 1;
                            const isActive = currentStep === stepNum;
                            const isCompleted = currentStep > stepNum;
                            const selectionValue = getSidebarDetail(idx, values);

                            return (
                              <li
                                key={step.title}
                                className={`flex items-start gap-3.5 transition-all duration-300
                                  ${isActive ? 'opacity-100' : isCompleted ? 'opacity-90' : 'opacity-40'}
                                `}
                              >
                                <div
                                  className={`w-7 h-7 rounded-lg text-xs font-bold font-heading flex items-center justify-center shrink-0 border transition-all duration-200 mt-0.5
                                    ${
                                      isActive
                                        ? 'bg-indigo-600 dark:bg-indigo-500 text-white border-indigo-600 dark:border-indigo-500 scale-105 shadow-md shadow-indigo-500/10'
                                        : isCompleted
                                          ? 'bg-emerald-500 border-emerald-500 text-white'
                                          : 'bg-slate-50 dark:bg-slate-950 text-gray-400 dark:text-slate-600 border-gray-200 dark:border-slate-800'
                                    }
                                  `}
                                >
                                  {isCompleted ? '✓' : `0${stepNum}`}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h3
                                    className={`text-xs font-bold font-heading tracking-tight leading-none
                                      ${
                                        isActive
                                          ? 'text-indigo-950 dark:text-white text-[13px]'
                                          : isCompleted
                                            ? 'text-gray-700 dark:text-slate-300'
                                            : 'text-gray-400 dark:text-slate-600'
                                      }
                                    `}
                                  >
                                    {step.title}
                                  </h3>
                                  <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5 leading-snug truncate">
                                    {selectionValue ? (
                                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold italic flex items-center gap-1">
                                        {selectionValue}
                                      </span>
                                    ) : (
                                      step.desc
                                    )}
                                  </p>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>

                      {/* Discard changes footer */}
                      {dirty && (
                        <div className="mt-8 pt-4 border-t border-gray-150 dark:border-slate-800">
                          <button
                            type="button"
                            onClick={handleClearWizard}
                            className="text-[11px] font-bold text-red-500 hover:text-red-600 dark:text-red-400/80 dark:hover:text-red-400 flex items-center gap-1.5 cursor-pointer outline-none bg-transparent border-none py-1"
                          >
                            <Undo2 className="w-3.5 h-3.5" />
                            Discard Bookings Selection
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Step Content Container Panel (Right 8 cols) */}
                    <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-gray-250 dark:border-slate-900/80 rounded-3xl p-6 sm:p-8 shadow-md flex flex-col justify-between min-h-[480px]">
                      
                      {/* Step components wrapped in AnimatePresence transitions */}
                      <div className="flex-1">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.22, ease: 'easeOut' }}
                          >
                            {currentStep === 1 && (
                              <StepDentist
                                selectedDentistId={values.dentistId}
                                onSelect={(id) => setFieldValue('dentistId', id)}
                              />
                            )}

                            {currentStep === 2 && (
                              <StepService
                                selectedServiceId={values.serviceId}
                                onSelect={(id) => setFieldValue('serviceId', id)}
                              />
                            )}

                            {currentStep === 3 && (
                              <StepDateTime
                                selectedDentistId={values.dentistId}
                                selectedDate={values.date}
                                selectedTimeSlot={values.timeSlot}
                                onSelectDate={(date) => setFieldValue('date', date)}
                                onSelectTimeSlot={(slot) => setFieldValue('timeSlot', slot)}
                              />
                            )}

                            {currentStep === 4 && (
                              <StepPersonalDetails formik={formik} />
                            )}

                            {currentStep === 5 && (
                              <StepSummary values={values} />
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </div>

                      {/* Stepper Navigation Actions */}
                      <div className="mt-8 pt-6 border-t border-gray-150 dark:border-slate-800 flex items-center justify-between">
                        {/* Back Button */}
                        <button
                          type="button"
                          onClick={handleBack}
                          disabled={currentStep === 1}
                          className="px-5 py-3 rounded-xl border border-gray-250 dark:border-slate-800 text-xs font-bold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer flex items-center gap-1 transition-all"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Back
                        </button>

                        {/* Next or Submit Button */}
                        {currentStep < 5 ? (
                          <button
                            id="nxt-btn"
                            type="button"
                            onClick={handleNext}
                            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-xs font-bold text-white shadow-sm flex items-center gap-1 cursor-pointer transition-all active:scale-[0.98]"
                          >
                            Next Step
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            id="submit-form-btn"
                            type="submit"
                            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-xs font-extrabold text-white shadow-md shadow-indigo-600/10 flex items-center gap-1.5 cursor-pointer transition-all animate-pulse active:scale-[0.98]"
                          >
                            Confirm Booking Placement
                            <CheckCircle2 className="w-4.5 h-4.5" />
                          </button>
                        )}
                      </div>

                    </div>

                  </div>
                </Form>
              );
            }}
          </Formik>
        )}
      </main>

      {/* Styled clean Page Footer */}
      <footer className="py-6 px-4 border-t border-gray-150 dark:border-slate-900 text-center text-xs text-gray-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 DentalCare Professional. All treatment plans protected.</p>
          <div className="flex items-center gap-2.5">
            <span>Operational Hours: Mon - Fri (09:00 AM - 05:00 PM)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
