"use client";

// External Dependencies
import { useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Internal Dependencies
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TranscriptViewer } from "@/components/transcript-viewer";
import { NotesEditor, NotesEditorRef } from "@/components/notes-editor";
import { YouTubePlayer, YouTubePlayerRef } from "@/components/youtube-player";

interface TranscriptionEditorProps {
  url: string;
  onUrlChange?: (url: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
  videoId?: string;
  transcript?: {
    text: string;
    duration: number;
    offset: number;
    isMatch?: boolean;
    matchCount?: number;
  }[];
  summaryData?: { summary: string };
  isSummaryPending?: boolean;
  onGenerateSummary?: () => void;
  initialContent?: string;
  isUrlDisabled?: boolean;
}

export function TranscriptionEditor({
  url,
  onUrlChange,
  onSubmit,
  isPending,
  videoId,
  transcript,
  summaryData,
  isSummaryPending,
  onGenerateSummary,
  initialContent,
  isUrlDisabled,
}: TranscriptionEditorProps) {
  const playerRef = useRef<YouTubePlayerRef>(null);
  const editorRef = useRef<NotesEditorRef>(null);

  const handleAddNote = (text: string, timestamp: number) => {
    editorRef.current?.insertTextWithTimestamp(text, timestamp);
  };

  const handleTimestampClick = (seconds: number) => {
    playerRef.current?.seekTo(seconds);
  };

  return (
    <div className="container py-8">
      <form onSubmit={onSubmit} className="mb-8 flex gap-2">
        <Input
          type="url"
          placeholder="Enter YouTube URL..."
          value={url}
          onChange={(e) => onUrlChange?.(e.target.value)}
          disabled={isUrlDisabled}
          className="flex-1"
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Loading..." : "Get Transcript"}
        </Button>
      </form>

      <div className="grid grid-cols-2 gap-8">
        {/* Left Column: Video and Transcript */}
        <div className="space-y-4">
          {videoId && (
            <Card className="p-4">
              <YouTubePlayer ref={playerRef} videoId={videoId} />
            </Card>
          )}

          {transcript && (
            <TranscriptViewer
              transcript={transcript}
              onAddNote={handleAddNote}
              onTimeClick={handleTimestampClick}
            />
          )}
        </div>

        {/* Right Column: Notes Editor and Summary */}
        <div className="h-full">
          <Tabs defaultValue="notes" className="h-full">
            <TabsList className="mb-4 grid w-full grid-cols-2">
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="summary">AI Summary</TabsTrigger>
            </TabsList>
            <TabsContent value="notes" className="h-full">
              <NotesEditor
                ref={editorRef}
                onTimestampClick={handleTimestampClick}
                initialContent={initialContent}
              />
            </TabsContent>
            <TabsContent value="summary" className="h-full">
              <Card className="h-full p-4">
                {transcript ? (
                  <div className="space-y-4">
                    <Button
                      onClick={onGenerateSummary}
                      disabled={isSummaryPending ?? summaryData !== undefined}
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
