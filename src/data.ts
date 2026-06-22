import { Dentist, Service } from './types';

export const dentists: Dentist[] = [
  {
    id: 'dentist-1',
    name: 'Dr. Emily Carter',
    specialty: 'General Dentistry & Aesthetics',
    rating: 4.9,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
    availability: ['Monday', 'Wednesday', 'Friday'],
    education: 'DDS, Columbia Dental Medicine',
  },
  {
    id: 'dentist-2',
    name: 'Dr. Marcus Vance',
    specialty: 'Orthodontics & Teeth Alignment',
    rating: 4.8,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
    availability: ['Tuesday', 'Thursday', 'Friday'],
    education: 'MSD in Orthodontics, Boston University',
  },
  {
    id: 'dentist-3',
    name: 'Dr. Sophia Patel',
    specialty: 'Pediatric Dentistry & Prevention',
    rating: 4.9,
    avatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=300',
    availability: ['Monday', 'Tuesday', 'Wednesday'],
    education: 'DDS, UCSF School of Dentistry',
  },
  {
    id: 'dentist-4',
    name: 'Dr. Alan Stone',
    specialty: 'Periodontist & Dental Implants',
    rating: 4.7,
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300',
    availability: ['Wednesday', 'Thursday', 'Friday'],
    education: 'DDS, Ph.D. in Oral Biology, NYU',
  },
];

export const services: Service[] = [
  {
    id: 'service-1',
    name: 'Routine Dental Exam & Cleaning',
    description: 'Comprehensive oral checkup, dental scaling, professional polishing, and necessary dental X-rays for healthy teeth maintenance.',
    duration: '45 Mins',
    price: 95,
    iconName: 'Shield',
  },
  {
    id: 'service-2',
    name: 'Teeth Whitening & Brightening',
    description: 'Advanced in-office professional laser teeth whitening to safely remove persistent stains and lighten your natural smile by several shades.',
    duration: '60 Mins',
    price: 180,
    iconName: 'Sparkles',
  },
  {
    id: 'service-3',
    name: 'Composite Dental Filling',
    description: 'Minimally-invasive cavity treatment using durable teeth-colored composite resins to restore functionality and aesthetic appearance.',
    duration: '30 Mins',
    price: 140,
    iconName: 'Layers',
  },
  {
    id: 'service-4',
    name: 'Orthodontic Consultation',
    description: 'Specialized evaluation for Traditional Braces or Clear Aligners (Invisalign) including 3D oral scans and structural timeline planning.',
    duration: '30 Mins',
    price: 0, // Free consultation
    iconName: 'Smile',
  },
  {
    id: 'service-5',
    name: 'Emergency Tooth Relief',
    description: 'Immediate diagnostic assessment and primary care for sudden intense toothaches, trauma, chip injuries, or crowns/fillings falling out.',
    duration: '45 Mins',
    price: 120,
    iconName: 'Activity',
  },
];

export const timeSlots: string[] = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:30 PM',
  '02:30 PM',
  '03:30 PM',
  '04:30 PM',
];
