
import { NextResponse } from 'next/server';
import { createVideo } from '@/services/video-service';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('video') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No video file provided" }, { status: 400 });
    }

    console.log('File received:', file.name);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure the upload directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'videos');
    await mkdir(uploadDir, { recursive: true });

    // Save the file to the public directory
    const filename = `${Date.now()}-${file.name}`;
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);
    console.log('File saved to:', filepath);

    // Create the public URL for the video file
    const origin = new URL(request.url).origin;
    const videoUrl = `${origin}/uploads/videos/${filename}`;

    // Get other form data
    const title = data.get('title') as string;
    const description = data.get('description') as string;
    const duration = data.get('duration') ? parseInt(data.get('duration') as string, 10) : undefined;
    const author = data.get('author') as string | undefined;
    const tags = data.getAll('tags') as string[];

    const videoData = {
      title,
      description,
      videoUrl,
      duration,
      author,
      tags,
    };
    console.log('Saving video metadata:', videoData);

    // Save video metadata to the database
    const video = await createVideo(videoData);
    console.log('Video metadata saved:', video);

    return NextResponse.json(video);
  } catch (error) {
    console.error('Error uploading video:', error);
    return NextResponse.json({ error: 'Failed to upload video' }, { status: 500 });
  }
}
