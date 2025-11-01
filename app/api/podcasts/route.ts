
import { NextResponse } from 'next/server';
import { PodcastService } from '@/services/podcast-service';

export async function GET() {
  try {
    const podcasts = await PodcastService.getPodcasts();
    return NextResponse.json(podcasts);
  } catch (error) {
    console.error('Failed to fetch podcasts:', error);
    return NextResponse.json({ error: 'Failed to fetch podcasts' }, { status: 500 });
  }
}
