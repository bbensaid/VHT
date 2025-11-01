
import { NextResponse } from 'next/server';
import { PodcastService } from '@/services/podcast-service';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('audio') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure the upload directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'audio');
    await mkdir(uploadDir, { recursive: true });

    // Save the file to the public directory
    const filename = `${Date.now()}-${file.name}`;
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Create the public URL for the audio file
    const audioUrl = `/uploads/audio/${filename}`;

    // Get other form data
    const title = data.get('title') as string;
    const description = data.get('description') as string;
    const duration = data.get('duration') ? parseInt(data.get('duration') as string, 10) : 0;

    // Save podcast metadata to the database
    const podcast = await PodcastService.createPodcast({
      title,
      description,
      audioUrl,
      duration,
      // Add other fields as necessary
    });

    return NextResponse.json(podcast);
  } catch (error) {
    console.error('Error uploading podcast:', error);
    return NextResponse.json({ error: 'Failed to upload podcast' }, { status: 500 });
  }
}
