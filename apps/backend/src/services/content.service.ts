/**
 * Content Service
 * Handles content data operations (courses, series, episodes)
 */

import { prisma } from '../lib/prisma.js';

/**
 * Get all standalone courses
 */
export async function getAllCourses() {
  return prisma.course.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Get a single course by ID
 */
export async function getCourseById(id: string) {
  return prisma.course.findUnique({
    where: { id },
  });
}

/**
 * Get all series with their episodes (ordered by position)
 */
export async function getAllSeries() {
  return prisma.series.findMany({
    include: {
      episodes: {
        orderBy: { order: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Get a single series by ID with episodes
 */
export async function getSeriesById(id: string) {
  return prisma.series.findUnique({
    where: { id },
    include: {
      episodes: {
        orderBy: { order: 'asc' },
      },
    },
  });
}

/**
 * Get a single episode by ID within a series
 */
export async function getEpisodeById(seriesId: string, episodeId: string) {
  return prisma.episode.findFirst({
    where: {
      id: episodeId,
      seriesId,
    },
    include: {
      series: {
        select: {
          id: true,
          title: true,
          thumbnail: true,
          description: true,
          category: true,
        },
      },
    },
  });
}
