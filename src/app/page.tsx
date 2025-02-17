"use client";

// External Dependencies
import { useState } from "react";

// Internal Dependencies
import { useTranscript } from "@/hooks/use-get-transcriptions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { TranscriptViewer } from "@/components/transcript-viewer";

function HomePage() {
  const [url, setUrl] = useState("");
  const { mutate: fetchTranscript, data, isPending } = useTranscript();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTranscript({ url });
  };

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <form onSubmit={handleSubmit} className="space-y-4">
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

      {data?.videoId && (
        <Card className="mt-4 p-4">
          <iframe
            width="100%"
            height="315"
            src={`https://www.youtube.com/embed/${data.videoId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
          />
        </Card>
      )}

      {data?.transcript && <TranscriptViewer transcript={data.transcript} />}
    </div>
  );
}

export default HomePage;
