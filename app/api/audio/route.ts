import { NextResponse } from "next/server";
import { writeFile } from "fs/promises"; 
import { join } from "path";
import type { NextRequest } from "next/server";

const audioDirectory = join(process.cwd(), "public/uploads/audio");

// Ensure directory exists
import { mkdir } from "fs/promises";

export async function POST(request: NextRequest) {
  try {
    // Ensure upload directory exists
    try {
      await mkdir(audioDirectory, { recursive: true });
    } catch (error) {
      console.error("Error creating directory:", error);
      return NextResponse.json(
        { 
          error: "Server configuration error",
          details: "Failed to create upload directory"
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Support all common audio formats
    const supportedFormats = {
      'audio/mpeg': '.mp3',
      'audio/mp3': '.mp3',
      'audio/wav': '.wav',
      'audio/wave': '.wav',
      'audio/x-wav': '.wav',
      'audio/aac': '.aac',
      'audio/ogg': '.ogg',
      'audio/webm': '.webm',
      'audio/x-m4a': '.m4a',
      'audio/mp4': '.m4a'
    };

    if (!file.type || !supportedFormats[file.type as keyof typeof supportedFormats]) {
      return NextResponse.json(
        { 
          error: "Unsupported audio format", 
          details: `File type ${file.type} is not supported. Supported formats: MP3, WAV, AAC, OGG, WebM`
        }, 
        { status: 400 }
      );
    }

    // Create a safe filename with proper extension
    const timestamp = Date.now();
    const extension = supportedFormats[file.type as keyof typeof supportedFormats];
    const baseName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, "-");
    const filename = `${timestamp}-${baseName}${extension}`;
    const filepath = join(audioDirectory, filename);

    // Validate the file header to ensure it's really an audio file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Check file magic numbers for MP3 (ID3 or MPEG sync)
    const isMP3 = (
      (buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33) || // ID3
      (buffer[0] === 0xFF && (buffer[1] & 0xE0) === 0xE0) // MPEG sync
    );

    if (!isMP3) {
      return NextResponse.json({ 
        error: "Invalid audio file", 
        details: "The file does not appear to be a valid audio file" 
      }, { status: 400 });
    }

    console.log('Writing file to:', filepath);
    
    try {
      await writeFile(filepath, buffer);
      console.log('File written successfully');
    } catch (error) {
      console.error('Error writing file:', error);
      throw new Error(
        `Failed to write file: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    // Return the relative URL for the uploaded file
    const fileUrl = `/uploads/audio/${filename}`;
    console.log('Generated URL:', fileUrl);

    return NextResponse.json({ 
      success: true, 
      url: fileUrl,
      type: file.type
    });

  } catch (error) {
    console.error("Error handling audio upload:", error);
    return NextResponse.json(
      {
        error: "Failed to process audio file",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get the requested audio file name from the URL
    const audioFile = request.nextUrl.searchParams.get("file");
    if (!audioFile) {
      return NextResponse.json(
        { error: "Audio file parameter is required" },
        { status: 400 }
      );
    }

    // Since we're storing files in public/uploads/audio, we can redirect to the static URL
    const audioUrl = `/uploads/audio/${audioFile}`;
    
    // Return a redirect to the static file URL
    return NextResponse.redirect(new URL(audioUrl, request.url));
  } catch (error) {
    console.error("Error serving audio file:", error);
    return NextResponse.json(
      {
        error: "Failed to serve audio file",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
