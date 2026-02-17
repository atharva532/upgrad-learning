/**
 * Static Course Data
 * Realistic mock courses for the learning platform
 * Includes videoUrl for fallback when API is unavailable
 */

import { Video, Series } from '../types/content.types';

// Open-source sample video URLs (Creative Commons / Public Domain)
const VIDEOS = {
  bigBuckBunny:
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  elephantsDream:
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  sintel: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  tearsOfSteel:
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  forBiggerBlazes:
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  forBiggerEscapes:
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  forBiggerFun:
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  forBiggerJoyrides:
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
};

export const COURSES: Video[] = [
  // Web Development
  {
    id: 'course-1',
    title: 'Introduction to Web Development',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=225&fit=crop',
    duration: 7200,
    category: 'Web Development',
    description: 'Learn the fundamentals of HTML, CSS, and JavaScript to build modern websites.',
    videoUrl: VIDEOS.bigBuckBunny,
  },
  {
    id: 'course-2',
    title: 'React Fundamentals',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop',
    duration: 5400,
    category: 'Web Development',
    description: 'Master React.js from scratch. Build interactive user interfaces with components.',
    videoUrl: VIDEOS.sintel,
  },
  {
    id: 'course-3',
    title: 'TypeScript Essentials',
    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=225&fit=crop',
    duration: 4800,
    category: 'Web Development',
    description: 'Add type safety to your JavaScript projects with TypeScript.',
    videoUrl: VIDEOS.elephantsDream,
  },
  {
    id: 'course-4',
    title: 'Node.js Backend Development',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=225&fit=crop',
    duration: 6000,
    category: 'Web Development',
    description: 'Build scalable server-side applications with Node.js and Express.',
    videoUrl: VIDEOS.tearsOfSteel,
  },

  // Data Science
  {
    id: 'course-5',
    title: 'Python for Data Science',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=225&fit=crop',
    duration: 8400,
    category: 'Data Science',
    description: 'Learn Python programming with focus on data analysis and visualization.',
    videoUrl: VIDEOS.bigBuckBunny,
  },
  {
    id: 'course-6',
    title: 'Machine Learning Basics',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=225&fit=crop',
    duration: 9600,
    category: 'Artificial Intelligence',
    description: 'Introduction to machine learning algorithms and their applications.',
    videoUrl: VIDEOS.sintel,
  },
  {
    id: 'course-7',
    title: 'SQL and Database Design',
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=225&fit=crop',
    duration: 5400,
    category: 'Data Science',
    description: 'Master SQL queries and learn to design efficient database schemas.',
    videoUrl: VIDEOS.elephantsDream,
  },

  // Mobile Development
  {
    id: 'course-8',
    title: 'React Native Mobile Apps',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=225&fit=crop',
    duration: 7200,
    category: 'Mobile Development',
    description: 'Build cross-platform mobile applications with React Native.',
    videoUrl: VIDEOS.tearsOfSteel,
  },
  {
    id: 'course-9',
    title: 'iOS Development with Swift',
    thumbnail: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=400&h=225&fit=crop',
    duration: 10800,
    category: 'Mobile Development',
    description: 'Create beautiful iOS applications using Swift and SwiftUI.',
    videoUrl: VIDEOS.bigBuckBunny,
  },

  // Design
  {
    id: 'course-10',
    title: 'UI/UX Design Fundamentals',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=225&fit=crop',
    duration: 6600,
    category: 'Design',
    description: 'Learn the principles of user interface and user experience design.',
    videoUrl: VIDEOS.elephantsDream,
  },
  {
    id: 'course-11',
    title: 'Figma Masterclass',
    thumbnail: 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=400&h=225&fit=crop',
    duration: 4800,
    category: 'Design',
    description: 'Master Figma to create stunning designs and prototypes.',
    videoUrl: VIDEOS.sintel,
  },

  // Cloud & DevOps
  {
    id: 'course-12',
    title: 'AWS Cloud Practitioner',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=225&fit=crop',
    duration: 7800,
    category: 'Cloud Computing',
    description: 'Get started with Amazon Web Services cloud platform.',
    videoUrl: VIDEOS.tearsOfSteel,
  },
  {
    id: 'course-13',
    title: 'Docker & Kubernetes',
    thumbnail: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400&h=225&fit=crop',
    duration: 6000,
    category: 'DevOps',
    description: 'Learn containerization with Docker and orchestration with Kubernetes.',
    videoUrl: VIDEOS.bigBuckBunny,
  },

  // Exploration Content
  {
    id: 'course-14',
    title: 'Digital Marketing Essentials',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop',
    duration: 4200,
    category: 'Marketing',
    description: 'Learn SEO, social media marketing, and content strategy.',
    videoUrl: VIDEOS.elephantsDream,
  },
  {
    id: 'course-15',
    title: 'Financial Literacy',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=225&fit=crop',
    duration: 3600,
    category: 'Finance',
    description: 'Understand personal finance, investing, and wealth building.',
    videoUrl: VIDEOS.sintel,
  },
  {
    id: 'course-16',
    title: 'Public Speaking Mastery',
    thumbnail: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=225&fit=crop',
    duration: 3000,
    category: 'Communication',
    description: 'Overcome stage fright and deliver impactful presentations.',
    videoUrl: VIDEOS.tearsOfSteel,
  },
];

// Series data with interest tags for recommendations
export const SERIES_DATA: Series[] = [
  {
    id: 'series-react',
    title: 'React Mastery',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop',
    description: 'Master React from components to advanced patterns.',
    tags: ['React Framework'],
    category: 'Web Development',
    episodes: [
      {
        id: 'ep-r1',
        title: 'JSX & Components',
        duration: 2400,
        order: 1,
        videoUrl: VIDEOS.forBiggerBlazes,
        seriesId: 'series-react',
      },
      {
        id: 'ep-r2',
        title: 'State & Props',
        duration: 2700,
        order: 2,
        videoUrl: VIDEOS.forBiggerEscapes,
        seriesId: 'series-react',
      },
      {
        id: 'ep-r3',
        title: 'Hooks Deep Dive',
        duration: 3000,
        order: 3,
        videoUrl: VIDEOS.forBiggerFun,
        seriesId: 'series-react',
      },
      {
        id: 'ep-r4',
        title: 'Context & Reducers',
        duration: 2800,
        order: 4,
        videoUrl: VIDEOS.forBiggerJoyrides,
        seriesId: 'series-react',
      },
    ],
  },
  {
    id: 'series-python',
    title: 'Python for Data Analysis',
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=225&fit=crop',
    description: 'Learn Python fundamentals with a focus on data analysis libraries.',
    tags: ['Python Programming', 'Data Science'],
    category: 'Data Science',
    episodes: [
      {
        id: 'ep-p1',
        title: 'Python Basics',
        duration: 2400,
        order: 1,
        videoUrl: VIDEOS.forBiggerBlazes,
        seriesId: 'series-python',
      },
      {
        id: 'ep-p2',
        title: 'NumPy Essentials',
        duration: 2600,
        order: 2,
        videoUrl: VIDEOS.forBiggerEscapes,
        seriesId: 'series-python',
      },
      {
        id: 'ep-p3',
        title: 'Pandas DataFrames',
        duration: 3200,
        order: 3,
        videoUrl: VIDEOS.forBiggerFun,
        seriesId: 'series-python',
      },
      {
        id: 'ep-p4',
        title: 'Data Visualization with Matplotlib',
        duration: 2800,
        order: 4,
        videoUrl: VIDEOS.forBiggerJoyrides,
        seriesId: 'series-python',
      },
      {
        id: 'ep-p5',
        title: 'Real-World Analysis Project',
        duration: 3600,
        order: 5,
        videoUrl: VIDEOS.forBiggerBlazes,
        seriesId: 'series-python',
      },
    ],
  },
  {
    id: 'series-ds',
    title: 'Data Science Foundations',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
    description: 'Build a strong foundation in statistics and machine learning concepts.',
    tags: ['Data Science'],
    category: 'Data Science',
    episodes: [
      {
        id: 'ep-ds1',
        title: 'Descriptive Statistics',
        duration: 2200,
        order: 1,
        videoUrl: VIDEOS.forBiggerFun,
        seriesId: 'series-ds',
      },
      {
        id: 'ep-ds2',
        title: 'Probability & Distributions',
        duration: 2800,
        order: 2,
        videoUrl: VIDEOS.forBiggerEscapes,
        seriesId: 'series-ds',
      },
      {
        id: 'ep-ds3',
        title: 'Hypothesis Testing',
        duration: 2600,
        order: 3,
        videoUrl: VIDEOS.forBiggerJoyrides,
        seriesId: 'series-ds',
      },
      {
        id: 'ep-ds4',
        title: 'Regression Models',
        duration: 3000,
        order: 4,
        videoUrl: VIDEOS.forBiggerBlazes,
        seriesId: 'series-ds',
      },
    ],
  },
  {
    id: 'series-cloud',
    title: 'Cloud Infrastructure Essentials',
    thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=225&fit=crop',
    description: 'Deploy and manage cloud infrastructure with AWS fundamentals.',
    tags: ['Cloud Computing'],
    category: 'Cloud Computing',
    episodes: [
      {
        id: 'ep-c1',
        title: 'Cloud Concepts & AWS Intro',
        duration: 2000,
        order: 1,
        videoUrl: VIDEOS.forBiggerBlazes,
        seriesId: 'series-cloud',
      },
      {
        id: 'ep-c2',
        title: 'EC2 & Networking',
        duration: 2800,
        order: 2,
        videoUrl: VIDEOS.forBiggerEscapes,
        seriesId: 'series-cloud',
      },
      {
        id: 'ep-c3',
        title: 'S3 & Storage Solutions',
        duration: 2400,
        order: 3,
        videoUrl: VIDEOS.forBiggerFun,
        seriesId: 'series-cloud',
      },
      {
        id: 'ep-c4',
        title: 'IAM & Security',
        duration: 2600,
        order: 4,
        videoUrl: VIDEOS.forBiggerJoyrides,
        seriesId: 'series-cloud',
      },
    ],
  },
  {
    id: 'series-security',
    title: 'Cybersecurity Fundamentals',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=225&fit=crop',
    description: 'Understand threats, vulnerabilities, and defense strategies.',
    tags: ['Cybersecurity'],
    category: 'Cybersecurity',
    episodes: [
      {
        id: 'ep-s1',
        title: 'Threat Landscape',
        duration: 2200,
        order: 1,
        videoUrl: VIDEOS.forBiggerBlazes,
        seriesId: 'series-security',
      },
      {
        id: 'ep-s2',
        title: 'Network Security',
        duration: 2600,
        order: 2,
        videoUrl: VIDEOS.forBiggerEscapes,
        seriesId: 'series-security',
      },
      {
        id: 'ep-s3',
        title: 'Encryption & PKI',
        duration: 3000,
        order: 3,
        videoUrl: VIDEOS.forBiggerFun,
        seriesId: 'series-security',
      },
    ],
  },
  {
    id: 'series-uiux',
    title: 'UI/UX Design Principles',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=225&fit=crop',
    description: 'Design user-centered interfaces with modern UX methodologies.',
    tags: ['UI/UX Design'],
    category: 'Design',
    episodes: [
      {
        id: 'ep-u1',
        title: 'Design Thinking',
        duration: 2000,
        order: 1,
        videoUrl: VIDEOS.forBiggerJoyrides,
        seriesId: 'series-uiux',
      },
      {
        id: 'ep-u2',
        title: 'Wireframing & Prototyping',
        duration: 2400,
        order: 2,
        videoUrl: VIDEOS.forBiggerBlazes,
        seriesId: 'series-uiux',
      },
      {
        id: 'ep-u3',
        title: 'Color Theory & Typography',
        duration: 2200,
        order: 3,
        videoUrl: VIDEOS.forBiggerEscapes,
        seriesId: 'series-uiux',
      },
      {
        id: 'ep-u4',
        title: 'Usability Testing',
        duration: 2600,
        order: 4,
        videoUrl: VIDEOS.forBiggerFun,
        seriesId: 'series-uiux',
      },
    ],
  },
  {
    id: 'series-marketing',
    title: 'Digital Marketing Strategy',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop',
    description: 'Plan and execute digital campaigns across channels.',
    tags: ['Digital Marketing'],
    category: 'Marketing',
    episodes: [
      {
        id: 'ep-m1',
        title: 'Marketing Fundamentals',
        duration: 2000,
        order: 1,
        videoUrl: VIDEOS.forBiggerBlazes,
        seriesId: 'series-marketing',
      },
      {
        id: 'ep-m2',
        title: 'SEO & Content Strategy',
        duration: 2600,
        order: 2,
        videoUrl: VIDEOS.forBiggerEscapes,
        seriesId: 'series-marketing',
      },
      {
        id: 'ep-m3',
        title: 'Social Media Marketing',
        duration: 2400,
        order: 3,
        videoUrl: VIDEOS.forBiggerFun,
        seriesId: 'series-marketing',
      },
    ],
  },
  {
    id: 'series-finance',
    title: 'Personal Finance Mastery',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=225&fit=crop',
    description: 'Take control of your finances with budgeting, investing, and planning.',
    tags: ['Personal Finance'],
    category: 'Finance',
    episodes: [
      {
        id: 'ep-f1',
        title: 'Budgeting Basics',
        duration: 1800,
        order: 1,
        videoUrl: VIDEOS.forBiggerJoyrides,
        seriesId: 'series-finance',
      },
      {
        id: 'ep-f2',
        title: 'Investing Fundamentals',
        duration: 2400,
        order: 2,
        videoUrl: VIDEOS.forBiggerBlazes,
        seriesId: 'series-finance',
      },
      {
        id: 'ep-f3',
        title: 'Retirement Planning',
        duration: 2200,
        order: 3,
        videoUrl: VIDEOS.forBiggerEscapes,
        seriesId: 'series-finance',
      },
    ],
  },
];

// Map interest names (as stored in DB) to course categories
export const INTEREST_CATEGORY_MAP: Record<string, string[]> = {
  'Python Programming': ['Data Science', 'Artificial Intelligence'],
  'Data Science': ['Data Science'],
  'UI/UX Design': ['Design'],
  'Digital Marketing': ['Marketing'],
  'Cloud Computing': ['Cloud Computing'],
  Cybersecurity: ['Cybersecurity'],
  'React Framework': ['Web Development'],
  'Personal Finance': ['Finance'],
};

// Exploration categories (content outside typical tech interests)
export const EXPLORATION_CATEGORIES = ['Marketing', 'Finance', 'Communication'];
