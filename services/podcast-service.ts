import prisma from '@/lib/prisma';
import type { Podcast } from '@prisma/client';

export class PodcastService {
  static async getPodcasts(): Promise<Podcast[]> {
    return prisma.podcast.findMany({
      orderBy: { publishedAt: 'desc' },
    });
  }

  static async getPodcastById(id: string): Promise<Podcast | null> {
    return prisma.podcast.findUnique({
      where: { id },
    });
  }

  static async createPodcast(data: Omit<Podcast, 'id' | 'createdAt' | 'updatedAt'>): Promise<Podcast> {
    return prisma.podcast.create({ data });
  }

  static async updatePodcast(id: string, data: Partial<Podcast>): Promise<Podcast> {
    return prisma.podcast.update({
      where: { id },
      data,
    });
  }

  static async deletePodcast(id: string): Promise<void> {
    await prisma.podcast.delete({
      where: { id },
    });
  }
}