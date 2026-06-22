export interface Dentist {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  avatar: string;
  availability: string[];
  education: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  iconName: string; // Map to a Lucide Icon
}

export interface AppointmentFormValues {
  dentistId: string;
  serviceId: string;
  date: string;
  timeSlot: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
}
