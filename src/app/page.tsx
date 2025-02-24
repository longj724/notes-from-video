"use client";

// External Dependencies

// Internal Dependencies
import { TranscriptionEditor } from "@/components/transcription-editor";

function HomePage() {
  return (
    <div className="flex min-h-screen w-full">
      <TranscriptionEditor url={null} />
    </div>
  );
}

export default HomePage;
