"use client";

// External Dependencies
import { useState } from "react";

// Internal Dependencies
import { useTranscript } from "@/hooks/use-get-transcriptions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { TranscriptViewer } from "@/components/transcript-viewer";
import { NotesEditor } from "@/components/notes-editor";

function HomePage() {
  const [url, setUrl] = useState("");
  const { mutate: fetchTranscript, data, isPending } = useTranscript();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTranscript({ url });
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
              <iframe
                width="100%"
                height="315"
                src={`https://www.youtube-nocookie.com/embed/${data.videoId}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              />
            </Card>
          )}

          {data?.transcript && (
            <TranscriptViewer transcript={data.transcript} />
          )}
        </div>

        {/* Right Column: Notes Editor */}
        <div className="h-full">
          <NotesEditor />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
