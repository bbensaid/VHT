
import prisma from '@/lib/prisma';

export async function getPodcasts() {
  return await prisma.podcast.findMany();
}
