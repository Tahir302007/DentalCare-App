import { Field, FormikProps } from 'formik';
import { User, Mail, Phone, FileText, AlertCircle } from 'lucide-react';
import { AppointmentFormValues } from '../types';

interface StepPersonalDetailsProps {
  formik: FormikProps<AppointmentFormValues>;
}

export default function StepPersonalDetails({ formik }: StepPersonalDetailsProps) {
  const { errors, touched } = formik;

  return (
    <div className="space-y-6">
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold font-heading text-gray-900 dark:text-white">
          Personal Information
        </h2>
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
          Please fill in your authentic contact information so we can confirm your placement.
        </p>
      </div>

      <div className="space-y-4">
        {/* Full Name input */}
        <div className="relative">
          <label htmlFor="name" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400 dark:text-slate-500">
              <User className="w-4.5 h-4.5" />
            </span>
            <Field
              id="name"
              name="name"
              type="text"
              placeholder="e.g. John Doe"
              className={`w-full py-3 pl-10 pr-4 rounded-xl border-2 bg-white dark:bg-slate-900 text-sm text-gray-900 dark:text-white outline-none transition-all duration-200
                ${
                  errors.name && touched.name
                    ? 'border-red-500 dark:border-red-500/80 focus:ring-2 focus:ring-red-500/20'
                    : 'border-gray-200 dark:border-slate-800 focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10'
                }
              `}
            />
          </div>
          {errors.name && touched.name && (
            <div className="flex items-center gap-1 mt-1 text-red-500 dark:text-red-400 text-xs font-semibold">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.name}</span>
            </div>
          )}
        </div>

        {/* Email Address input */}
        <div className="relative">
          <label htmlFor="email" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400 dark:text-slate-500">
              <Mail className="w-4.5 h-4.5" />
            </span>
            <Field
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              className={`w-full py-3 pl-10 pr-4 rounded-xl border-2 bg-white dark:bg-slate-900 text-sm text-gray-900 dark:text-white outline-none transition-all duration-200
                ${
                  errors.email && touched.email
                    ? 'border-red-500 dark:border-red-500/80 focus:ring-2 focus:ring-red-500/20'
                    : 'border-gray-200 dark:border-slate-800 focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10'
                }
              `}
            />
          </div>
          {errors.email && touched.email && (
            <div className="flex items-center gap-1 mt-1 text-red-500 dark:text-red-400 text-xs font-semibold">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.email}</span>
            </div>
          )}
        </div>

        {/* Phone Number input */}
        <div className="relative">
          <label htmlFor="phone" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
            Phone Number
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400 dark:text-slate-500">
              <Phone className="w-4.5 h-4.5" />
            </span>
            <Field
              id="phone"
              name="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              className={`w-full py-3 pl-10 pr-4 rounded-xl border-2 bg-white dark:bg-slate-900 text-sm text-gray-900 dark:text-white outline-none transition-all duration-200
                ${
                  errors.phone && touched.phone
                    ? 'border-red-500 dark:border-red-500/80 focus:ring-2 focus:ring-red-500/10'
                    : 'border-gray-200 dark:border-slate-800 focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10'
                }
              `}
            />
          </div>
          {errors.phone && touched.phone && (
            <div className="flex items-center gap-1 mt-1 text-red-500 dark:text-red-400 text-xs font-semibold">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.phone}</span>
            </div>
          )}
        </div>

        {/* Additional Notes input */}
        <div className="relative">
          <label htmlFor="notes" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
            Additional Medical Notes or Concerns (Optional)
          </label>
          <div className="relative">
            <span className="absolute top-3 left-3.5 pointer-events-none text-gray-400 dark:text-slate-500">
              <FileText className="w-4.5 h-4.5" />
            </span>
            <Field
              id="notes"
              name="notes"
              as="textarea"
              rows={4}
              placeholder="Please highlight any tooth pain, medical conditions, or alignment preferences..."
              className="w-full py-3 pl-10 pr-4 rounded-xl border-2 border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-gray-900 dark:text-white outline-none focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all duration-200 resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
