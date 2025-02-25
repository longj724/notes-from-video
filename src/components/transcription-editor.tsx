"use client";

// External Dependencies
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import _ from "lodash";
import { useParams } from "next/navigation";

// Internal Dependencies
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TranscriptViewer } from "@/components/transcript-viewer";
import { NotesEditor, NotesEditorRef } from "@/components/notes-editor";
import { YouTubePlayer, YouTubePlayerRef } from "@/components/youtube-player";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useGenerateTranscript } from "@/hooks/use-generate-transcript";
import { useGetNote, useUpdateNote } from "@/hooks/use-notes";
import { useGenerateSummary } from "@/hooks/use-generate-summary";
import { Spinner } from "@/components/ui/spinner";

export function TranscriptionEditor() {
  const playerRef = useRef<YouTubePlayerRef>(null);
  const editorRef = useRef<NotesEditorRef>(null);
  const [currentUrl, setCurrentUrl] = useState("");
  const [currentTime, setCurrentTime] = useState(0);

  const sidebarContext = useSidebar();
  const params = useParams<{ id: string }>();

  const {
    mutate: generateTranscript,
    isPending: isTranscriptPending,
    data: transcriptData,
  } = useGenerateTranscript();
  const {
    mutate: generateSummary,
    isPending: isSummaryPending,
    data: summaryData,
  } = useGenerateSummary();
  const { data: note } = useGetNote(params.id);
  const { mutate: updateNote } = useUpdateNote();

  useEffect(() => {
    if (note) {
      setCurrentUrl(note.videoUrl);
      generateTranscript({ url: note.videoUrl });
    }
  }, [note, generateTranscript]);

  const handleSubmit = (e: React.FormEvent) => {
    if (currentUrl) {
      e.preventDefault();
      generateTranscript({ url: currentUrl });
      updateNote({ id: params.id, videoUrl: currentUrl });
    }
  };

  const handleAddNote = (text: string, timestamp: number) => {
    editorRef.current?.insertTextWithTimestamp(text, timestamp);
  };

  const handleTimestampClick = (seconds: number) => {
    playerRef.current?.seekTo(seconds);
  };

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  const handleGenerateSummary = () => {
    if (transcriptData?.transcript) {
      generateSummary({ transcript: transcriptData.transcript });
    }
  };

  return (
    <div className="container py-8">
      <form onSubmit={handleSubmit} className="mb-8 flex items-center gap-2">
        {!sidebarContext.open && <SidebarTrigger />}
        <Input
          type="url"
          placeholder="Enter YouTube URL..."
          value={currentUrl}
          onChange={(e) => setCurrentUrl(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={isTranscriptPending}>
          {isTranscriptPending ? <Spinner /> : "Get Transcript"}
        </Button>
      </form>

      <div className="grid grid-cols-2 gap-8">
        {/* Left Column: Video and Transcript */}
        <div className="space-y-4">
          {transcriptData?.videoId && (
            <Card className="p-4">
              <YouTubePlayer
                ref={playerRef}
                videoId={transcriptData.videoId}
                onTimeUpdate={handleTimeUpdate}
              />
            </Card>
          )}

          {transcriptData?.transcript && (
            <TranscriptViewer
              transcript={transcriptData.transcript}
              onAddNote={handleAddNote}
              onTimeClick={handleTimestampClick}
              currentTime={currentTime}
            />
          )}
        </div>

        {/* Right Column: Notes Editor and Summary */}
        <div>
          <Tabs defaultValue="notes">
            <TabsList className="mb-4 grid w-full grid-cols-2">
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="summary">AI Summary</TabsTrigger>
            </TabsList>
            <TabsContent value="notes">
              <NotesEditor
                ref={editorRef}
                onTimestampClick={handleTimestampClick}
                note={note}
              />
            </TabsContent>
            <TabsContent value="summary">
              <Card className="p-4">
                {transcriptData?.transcript ? (
                  <div className="space-y-4">
                    <Button
                      onClick={handleGenerateSummary}
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
                  <p className="text-center text-muted-foreground">
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
