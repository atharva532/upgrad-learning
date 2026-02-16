/**
 * Static Course Data
 * Realistic mock courses for the learning platform
 */

import { Video } from '../types/content.types';

export const COURSES: Video[] = [
  // Web Development
  {
    id: 'course-1',
    title: 'Introduction to Web Development',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=225&fit=crop',
    duration: 7200,
    category: 'Web Development',
    description: 'Learn the fundamentals of HTML, CSS, and JavaScript to build modern websites.',
  },
  {
    id: 'course-2',
    title: 'React Fundamentals',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop',
    duration: 5400,
    category: 'Web Development',
    description: 'Master React.js from scratch. Build interactive user interfaces with components.',
  },
  {
    id: 'course-3',
    title: 'TypeScript Essentials',
    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=225&fit=crop',
    duration: 4800,
    category: 'Web Development',
    description: 'Add type safety to your JavaScript projects with TypeScript.',
  },
  {
    id: 'course-4',
    title: 'Node.js Backend Development',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=225&fit=crop',
    duration: 6000,
    category: 'Web Development',
    description: 'Build scalable server-side applications with Node.js and Express.',
  },

  // Data Science
  {
    id: 'course-5',
    title: 'Python for Data Science',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=225&fit=crop',
    duration: 8400,
    category: 'Data Science',
    description: 'Learn Python programming with focus on data analysis and visualization.',
  },
  {
    id: 'course-6',
    title: 'Machine Learning Basics',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=225&fit=crop',
    duration: 9600,
    category: 'Artificial Intelligence',
    description: 'Introduction to machine learning algorithms and their applications.',
  },
  {
    id: 'course-7',
    title: 'SQL and Database Design',
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=225&fit=crop',
    duration: 5400,
    category: 'Data Science',
    description: 'Master SQL queries and learn to design efficient database schemas.',
  },

  // Mobile Development
  {
    id: 'course-8',
    title: 'React Native Mobile Apps',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=225&fit=crop',
    duration: 7200,
    category: 'Mobile Development',
    description: 'Build cross-platform mobile applications with React Native.',
  },
  {
    id: 'course-9',
    title: 'iOS Development with Swift',
    thumbnail: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=400&h=225&fit=crop',
    duration: 10800,
    category: 'Mobile Development',
    description: 'Create beautiful iOS applications using Swift and SwiftUI.',
  },

  // Design
  {
    id: 'course-10',
    title: 'UI/UX Design Fundamentals',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=225&fit=crop',
    duration: 6600,
    category: 'Design',
    description: 'Learn the principles of user interface and user experience design.',
  },
  {
    id: 'course-11',
    title: 'Figma Masterclass',
    thumbnail: 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=400&h=225&fit=crop',
    duration: 4800,
    category: 'Design',
    description: 'Master Figma to create stunning designs and prototypes.',
  },

  // Cloud & DevOps
  {
    id: 'course-12',
    title: 'AWS Cloud Practitioner',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=225&fit=crop',
    duration: 7800,
    category: 'Cloud Computing',
    description: 'Get started with Amazon Web Services cloud platform.',
  },
  {
    id: 'course-13',
    title: 'Docker & Kubernetes',
    thumbnail: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400&h=225&fit=crop',
    duration: 6000,
    category: 'DevOps',
    description: 'Learn containerization with Docker and orchestration with Kubernetes.',
  },

  // Exploration Content
  {
    id: 'course-14',
    title: 'Digital Marketing Essentials',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop',
    duration: 4200,
    category: 'Marketing',
    description: 'Learn SEO, social media marketing, and content strategy.',
  },
  {
    id: 'course-15',
    title: 'Financial Literacy',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=225&fit=crop',
    duration: 3600,
    category: 'Finance',
    description: 'Understand personal finance, investing, and wealth building.',
  },
  {
    id: 'course-16',
    title: 'Public Speaking Mastery',
    thumbnail: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=225&fit=crop',
    duration: 3000,
    category: 'Communication',
    description: 'Overcome stage fright and deliver impactful presentations.',
  },
];

// Map interest names (as stored in DB) to course categories
export const INTEREST_CATEGORY_MAP: Record<string, string[]> = {
  'Python Programming': ['Data Science', 'Artificial Intelligence'],
  'Data Science': ['Data Science'],
  'UI/UX Design': ['Design'],
  'Digital Marketing': ['Marketing'],
  'Cloud Computing': ['Cloud Computing'],
  Cybersecurity: ['Cloud Computing', 'DevOps'],
  'React Framework': ['Web Development'],
  'Personal Finance': ['Finance'],
};

// Exploration categories (content outside typical tech interests)
export const EXPLORATION_CATEGORIES = ['Marketing', 'Finance', 'Communication'];
