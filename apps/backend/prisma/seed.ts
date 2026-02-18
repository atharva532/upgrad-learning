import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const interests = [
  'Python Programming',
  'Data Science',
  'UI/UX Design',
  'Digital Marketing',
  'Cloud Computing',
  'Cybersecurity',
  'React Framework',
  'Personal Finance',
];

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

// Standalone courses
const courses = [
  {
    title: 'Introduction to Web Development',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=225&fit=crop',
    duration: 596, // Big Buck Bunny actual duration ~9:56
    category: 'Web Development',
    description: 'Learn the fundamentals of HTML, CSS, and JavaScript to build modern websites.',
    videoUrl: VIDEOS.bigBuckBunny,
  },
  {
    title: 'React Fundamentals',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop',
    duration: 888, // Sintel actual duration ~14:48
    category: 'Web Development',
    description: 'Master React.js from scratch. Build interactive user interfaces with components.',
    videoUrl: VIDEOS.sintel,
  },
  {
    title: 'TypeScript Essentials',
    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=225&fit=crop',
    duration: 653, // Elephant's Dream actual duration ~10:53
    category: 'Web Development',
    description: 'Add type safety to your JavaScript projects with TypeScript.',
    videoUrl: VIDEOS.elephantsDream,
  },
  {
    title: 'Node.js Backend Development',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=225&fit=crop',
    duration: 734, // Tears of Steel actual duration ~12:14
    category: 'Web Development',
    description: 'Build scalable server-side applications with Node.js and Express.',
    videoUrl: VIDEOS.tearsOfSteel,
  },
  {
    title: 'Python for Data Science',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=225&fit=crop',
    duration: 596,
    category: 'Data Science',
    description: 'Learn Python programming with focus on data analysis and visualization.',
    videoUrl: VIDEOS.bigBuckBunny,
  },
  {
    title: 'Machine Learning Basics',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=225&fit=crop',
    duration: 888,
    category: 'Artificial Intelligence',
    description: 'Introduction to machine learning algorithms and their applications.',
    videoUrl: VIDEOS.sintel,
  },
  {
    title: 'SQL and Database Design',
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=225&fit=crop',
    duration: 653,
    category: 'Data Science',
    description: 'Master SQL queries and learn to design efficient database schemas.',
    videoUrl: VIDEOS.elephantsDream,
  },
  {
    title: 'React Native Mobile Apps',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=225&fit=crop',
    duration: 734,
    category: 'Mobile Development',
    description: 'Build cross-platform mobile applications with React Native.',
    videoUrl: VIDEOS.tearsOfSteel,
  },
  {
    title: 'iOS Development with Swift',
    thumbnail: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=400&h=225&fit=crop',
    duration: 596,
    category: 'Mobile Development',
    description: 'Create beautiful iOS applications using Swift and SwiftUI.',
    videoUrl: VIDEOS.bigBuckBunny,
  },
  {
    title: 'UI/UX Design Fundamentals',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=225&fit=crop',
    duration: 653,
    category: 'Design',
    description: 'Learn the principles of user interface and user experience design.',
    videoUrl: VIDEOS.elephantsDream,
  },
  {
    title: 'Figma Masterclass',
    thumbnail: 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=400&h=225&fit=crop',
    duration: 888,
    category: 'Design',
    description: 'Master Figma to create stunning designs and prototypes.',
    videoUrl: VIDEOS.sintel,
  },
  {
    title: 'AWS Cloud Practitioner',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=225&fit=crop',
    duration: 734,
    category: 'Cloud Computing',
    description: 'Get started with Amazon Web Services cloud platform.',
    videoUrl: VIDEOS.tearsOfSteel,
  },
  {
    title: 'Docker & Kubernetes',
    thumbnail: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400&h=225&fit=crop',
    duration: 596,
    category: 'DevOps',
    description: 'Learn containerization with Docker and orchestration with Kubernetes.',
    videoUrl: VIDEOS.bigBuckBunny,
  },
  {
    title: 'Digital Marketing Essentials',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop',
    duration: 653,
    category: 'Marketing',
    description: 'Learn SEO, social media marketing, and content strategy.',
    videoUrl: VIDEOS.elephantsDream,
  },
  {
    title: 'Financial Literacy',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=225&fit=crop',
    duration: 888,
    category: 'Finance',
    description: 'Understand personal finance, investing, and wealth building.',
    videoUrl: VIDEOS.sintel,
  },
  {
    title: 'Public Speaking Mastery',
    thumbnail: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=225&fit=crop',
    duration: 734,
    category: 'Communication',
    description: 'Overcome stage fright and deliver impactful presentations.',
    videoUrl: VIDEOS.tearsOfSteel,
  },
];

// Series with episodes
const seriesData = [
  {
    title: 'React Mastery',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop',
    description: 'Master React from components to advanced patterns.',
    tags: ['React Framework'],
    category: 'Web Development',
    episodes: [
      { title: 'JSX & Components', duration: 15, order: 1, videoUrl: VIDEOS.forBiggerBlazes },
      { title: 'State & Props', duration: 15, order: 2, videoUrl: VIDEOS.forBiggerEscapes },
      { title: 'Hooks Deep Dive', duration: 15, order: 3, videoUrl: VIDEOS.forBiggerFun },
      { title: 'Context & Reducers', duration: 15, order: 4, videoUrl: VIDEOS.forBiggerJoyrides },
    ],
  },
  {
    title: 'Python for Data Analysis',
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=225&fit=crop',
    description: 'Learn Python fundamentals with a focus on data analysis libraries.',
    tags: ['Python Programming', 'Data Science'],
    category: 'Data Science',
    episodes: [
      { title: 'Python Basics', duration: 15, order: 1, videoUrl: VIDEOS.forBiggerBlazes },
      { title: 'NumPy Essentials', duration: 15, order: 2, videoUrl: VIDEOS.forBiggerEscapes },
      { title: 'Pandas DataFrames', duration: 15, order: 3, videoUrl: VIDEOS.forBiggerFun },
      {
        title: 'Data Visualization with Matplotlib',
        duration: 15,
        order: 4,
        videoUrl: VIDEOS.forBiggerJoyrides,
      },
      {
        title: 'Real-World Analysis Project',
        duration: 15,
        order: 5,
        videoUrl: VIDEOS.forBiggerBlazes,
      },
    ],
  },
  {
    title: 'Data Science Foundations',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
    description: 'Build a strong foundation in statistics and machine learning concepts.',
    tags: ['Data Science'],
    category: 'Data Science',
    episodes: [
      { title: 'Descriptive Statistics', duration: 15, order: 1, videoUrl: VIDEOS.forBiggerFun },
      {
        title: 'Probability & Distributions',
        duration: 15,
        order: 2,
        videoUrl: VIDEOS.forBiggerEscapes,
      },
      { title: 'Hypothesis Testing', duration: 15, order: 3, videoUrl: VIDEOS.forBiggerJoyrides },
      { title: 'Regression Models', duration: 15, order: 4, videoUrl: VIDEOS.forBiggerBlazes },
    ],
  },
  {
    title: 'Cloud Infrastructure Essentials',
    thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=225&fit=crop',
    description: 'Deploy and manage cloud infrastructure with AWS fundamentals.',
    tags: ['Cloud Computing'],
    category: 'Cloud Computing',
    episodes: [
      {
        title: 'Cloud Concepts & AWS Intro',
        duration: 15,
        order: 1,
        videoUrl: VIDEOS.forBiggerBlazes,
      },
      { title: 'EC2 & Networking', duration: 15, order: 2, videoUrl: VIDEOS.forBiggerEscapes },
      { title: 'S3 & Storage Solutions', duration: 15, order: 3, videoUrl: VIDEOS.forBiggerFun },
      { title: 'IAM & Security', duration: 15, order: 4, videoUrl: VIDEOS.forBiggerJoyrides },
    ],
  },
  {
    title: 'Cybersecurity Fundamentals',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=225&fit=crop',
    description: 'Understand threats, vulnerabilities, and defense strategies.',
    tags: ['Cybersecurity'],
    category: 'Cybersecurity',
    episodes: [
      { title: 'Threat Landscape', duration: 15, order: 1, videoUrl: VIDEOS.forBiggerBlazes },
      { title: 'Network Security', duration: 15, order: 2, videoUrl: VIDEOS.forBiggerEscapes },
      { title: 'Encryption & PKI', duration: 15, order: 3, videoUrl: VIDEOS.forBiggerFun },
    ],
  },
  {
    title: 'UI/UX Design Principles',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=225&fit=crop',
    description: 'Design user-centered interfaces with modern UX methodologies.',
    tags: ['UI/UX Design'],
    category: 'Design',
    episodes: [
      { title: 'Design Thinking', duration: 15, order: 1, videoUrl: VIDEOS.forBiggerJoyrides },
      {
        title: 'Wireframing & Prototyping',
        duration: 15,
        order: 2,
        videoUrl: VIDEOS.forBiggerBlazes,
      },
      {
        title: 'Color Theory & Typography',
        duration: 15,
        order: 3,
        videoUrl: VIDEOS.forBiggerEscapes,
      },
      { title: 'Usability Testing', duration: 15, order: 4, videoUrl: VIDEOS.forBiggerFun },
    ],
  },
  {
    title: 'Digital Marketing Strategy',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop',
    description: 'Plan and execute digital campaigns across channels.',
    tags: ['Digital Marketing'],
    category: 'Marketing',
    episodes: [
      {
        title: 'Marketing Fundamentals',
        duration: 15,
        order: 1,
        videoUrl: VIDEOS.forBiggerBlazes,
      },
      {
        title: 'SEO & Content Strategy',
        duration: 15,
        order: 2,
        videoUrl: VIDEOS.forBiggerEscapes,
      },
      { title: 'Social Media Marketing', duration: 15, order: 3, videoUrl: VIDEOS.forBiggerFun },
    ],
  },
  {
    title: 'Personal Finance Mastery',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=225&fit=crop',
    description: 'Take control of your finances with budgeting, investing, and planning.',
    tags: ['Personal Finance'],
    category: 'Finance',
    episodes: [
      { title: 'Budgeting Basics', duration: 15, order: 1, videoUrl: VIDEOS.forBiggerJoyrides },
      {
        title: 'Investing Fundamentals',
        duration: 15,
        order: 2,
        videoUrl: VIDEOS.forBiggerBlazes,
      },
      { title: 'Retirement Planning', duration: 15, order: 3, videoUrl: VIDEOS.forBiggerEscapes },
    ],
  },
];

async function main() {
  // ---- Seed Interests ----
  console.log('Seeding interests...');
  for (const name of interests) {
    await prisma.interest.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log(`Seeded ${interests.length} interests`);

  // ---- Seed Courses ----
  console.log('Seeding courses...');
  for (const course of courses) {
    const existing = await prisma.course.findFirst({
      where: { title: course.title },
    });

    if (existing) {
      await prisma.course.update({
        where: { id: existing.id },
        data: {
          thumbnail: course.thumbnail,
          duration: course.duration,
          category: course.category,
          description: course.description,
          videoUrl: course.videoUrl,
        },
      });
    } else {
      await prisma.course.create({
        data: course,
      });
    }
  }
  console.log(`Seeded ${courses.length} courses`);

  // ---- Seed Series with Episodes ----
  console.log('Seeding series...');
  for (const series of seriesData) {
    const { episodes, ...seriesFields } = series;

    // Check if series already exists by title
    const existing = await prisma.series.findFirst({
      where: { title: seriesFields.title },
    });

    let seriesRecord;
    if (existing) {
      seriesRecord = await prisma.series.update({
        where: { id: existing.id },
        data: {
          thumbnail: seriesFields.thumbnail,
          description: seriesFields.description,
          category: seriesFields.category,
          tags: seriesFields.tags,
        },
      });
    } else {
      seriesRecord = await prisma.series.create({
        data: seriesFields,
      });
    }

    // Upsert episodes
    for (const ep of episodes) {
      const existingEp = await prisma.episode.findFirst({
        where: {
          seriesId: seriesRecord.id,
          order: ep.order,
        },
      });

      if (existingEp) {
        await prisma.episode.update({
          where: { id: existingEp.id },
          data: {
            title: ep.title,
            duration: ep.duration,
            videoUrl: ep.videoUrl,
          },
        });
      } else {
        await prisma.episode.create({
          data: {
            ...ep,
            seriesId: seriesRecord.id,
          },
        });
      }
    }
  }
  console.log(`Seeded ${seriesData.length} series with episodes`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
