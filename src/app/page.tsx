"use client";

// External Dependencies
import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Internal Dependencies
import { useGetTranscript } from "@/hooks/use-get-transcriptions";
import { useGenerateSummary } from "@/hooks/use-generate-summary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TranscriptViewer } from "@/components/transcript-viewer";
import { NotesEditor, NotesEditorRef } from "@/components/notes-editor";
import { YouTubePlayer, YouTubePlayerRef } from "@/components/youtube-player";

function HomePage() {
  const [url, setUrl] = useState("");
  const [activeTab, setActiveTab] = useState("notes");
  const {
    mutate: fetchTranscript,
    data: transcriptionData,
    isPending,
  } = useGetTranscript();
  const {
    mutate: generateSummary,
    data: summaryData,
    isPending: isSummaryPending,
  } = useGenerateSummary();
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

  const handleGenerateSummary = () => {
    if (transcriptionData?.transcript) {
      generateSummary({ transcript: transcriptionData.transcript });
    }
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
          {transcriptionData?.videoId && (
            <Card className="p-4">
              <YouTubePlayer
                ref={playerRef}
                videoId={transcriptionData.videoId}
              />
            </Card>
          )}

          {transcriptionData?.transcript && (
            <TranscriptViewer
              transcript={transcriptionData.transcript}
              onAddNote={handleAddNote}
              onTimeClick={handleTimestampClick}
            />
          )}
        </div>

        {/* Right Column: Notes Editor and Summary */}
        <div className="h-full">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full"
          >
            <TabsList className="mb-4 grid w-full grid-cols-2">
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="summary">AI Summary</TabsTrigger>
            </TabsList>
            <TabsContent value="notes" className="h-full">
              <NotesEditor
                ref={editorRef}
                onTimestampClick={handleTimestampClick}
              />
            </TabsContent>
            <TabsContent value="summary" className="h-full">
              <Card className="h-full p-4">
                {transcriptionData?.transcript ? (
                  <div className="space-y-4">
                    <Button
                      onClick={handleGenerateSummary}
                      disabled={isSummaryPending || summaryData !== undefined}
                      className="w-full"
                    >
                      {isSummaryPending
                        ? "Generating Summary..."
                        : "Generate AI Summary"}
                    </Button>
                    {summaryData?.summary && (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {summaryData.summary}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center">
                    Get a transcript first to generate an AI summary
                  </p>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
