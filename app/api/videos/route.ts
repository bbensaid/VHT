
import { NextResponse } from 'next/server';
import { getVideos } from '@/services/video-service';

export async function GET() {
  try {
    const videos = await getVideos();
    return NextResponse.json(videos);
  } catch (error) {
    console.error('Failed to fetch videos:', error);
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
  }
}
