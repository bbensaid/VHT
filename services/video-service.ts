
import prisma from '@/lib/prisma';
import type { Video } from '@prisma/client';

export class VideoService {
  static async getVideos(): Promise<Video[]> {
    return prisma.video.findMany({
      orderBy: { publishedAt: 'desc' },
    });
  }

  static async getVideoById(id: string): Promise<Video | null> {
    return prisma.video.findUnique({
      where: { id },
    });
  }

  static async createVideo(data: Omit<Video, 'id' | 'createdAt' | 'updatedAt'>): Promise<Video> {
    return prisma.video.create({ data });
  }

  static async updateVideo(id: string, data: Partial<Video>): Promise<Video> {
    return prisma.video.update({
      where: { id },
      data,
    });
  }

  static async deleteVideo(id: string): Promise<void> {
    await prisma.video.delete({
      where: { id },
    });
  }
}
