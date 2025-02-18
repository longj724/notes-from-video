"use client";

// External Dependencies
import { useState, useRef } from "react";

// Internal Dependencies
import { useTranscript } from "@/hooks/use-get-transcriptions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { TranscriptViewer } from "@/components/transcript-viewer";
import { NotesEditor, NotesEditorRef } from "@/components/notes-editor";
import { YouTubePlayer, YouTubePlayerRef } from "@/components/youtube-player";

function HomePage() {
  const [url, setUrl] = useState("");
  const { mutate: fetchTranscript, data, isPending } = useTranscript();
  const playerRef = useRef<YouTubePlayerRef>(null);
  const editorRef = useRef<NotesEditorRef>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTranscript({ url });
  };

  const handleAddNote = (text: string, timestamp: number) => {
    editorRef.current?.insertTextWithTimestamp(text, timestamp);
  };

  const handleTimestampClick = (seconds: number) => {
    playerRef.current?.seekTo(seconds);
  };

  return (
    <div className="container mx-auto py-8">
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="Enter YouTube URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? "Loading..." : "Get Transcript"}
          </Button>
        </div>
      </form>

      <div className="grid grid-cols-2 gap-8">
        {/* Left Column: Video and Transcript */}
        <div className="space-y-4">
          {data?.videoId && (
            <Card className="p-4">
              <YouTubePlayer ref={playerRef} videoId={data.videoId} />
            </Card>
          )}

          {data?.transcript && (
            <TranscriptViewer
              transcript={data.transcript}
              onAddNote={handleAddNote}
            />
          )}
        </div>

        {/* Right Column: Notes Editor */}
        <div className="h-full">
          <NotesEditor
            ref={editorRef}
            onTimestampClick={handleTimestampClick}
          />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
