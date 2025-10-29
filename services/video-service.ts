
import prisma from '@/lib/prisma';

export async function getVideos() {
  return await prisma.video.findMany();
}

export async function createVideo(data: {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  author?: string;
  tags?: string[];
}) {
  return await prisma.video.create({ data });
}
