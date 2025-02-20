"use client";

// External Dependencies
import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Internal Dependencies
import { useGetTranscript } from "@/hooks/use-get-transcriptions";
import { useGenerateSummary } from "@/hooks/use-generate-summary";
import { useGetFolders } from "@/hooks/use-folders";
import { useNotes, useCreateNote, useUpdateNote } from "@/hooks/use-notes";
import { useCreateFolder } from "@/hooks/use-folders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TranscriptViewer } from "@/components/transcript-viewer";
import { NotesEditor, NotesEditorRef } from "@/components/notes-editor";
import { YouTubePlayer, YouTubePlayerRef } from "@/components/youtube-player";
import { TranscriptionsSidebar } from "@/components/transcriptions-sidebar";
import type {
  TranscriptionItem,
  FolderItem,
} from "@/components/transcriptions-sidebar";

function extractVideoId(url: string): string {
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = regex.exec(url);
  return match?.[1] ?? "";
}

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
  const { data: folders } = useGetFolders();
  const { data: notes = [] } = useNotes();
  const { mutate: createFolder } = useCreateFolder();
  const { mutate: updateNote } = useUpdateNote();
  const { mutate: createNote } = useCreateNote();
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

  const handleCreateFolder = (name: string) => {
    console.log("Creating folder:", name);
    createFolder({ name });
  };

  const handleCreateTranscription = () => {
    if (!transcriptionData?.transcript || !transcriptionData.videoId) {
      console.error("No transcript or video data available");
      return;
    }

    const videoUrl = `https://www.youtube.com/watch?v=${transcriptionData.videoId}`;
    const title =
      document.title || `YouTube Video - ${transcriptionData.videoId}`;

    createNote({
      title,
      content: editorRef.current?.getContent() ?? "",
      videoUrl,
    });
  };

  const handleTranscriptionSelect = (transcription: TranscriptionItem) => {
    const videoId = transcription.videoId;
    if (videoId) {
      fetchTranscript({
        url: `https://www.youtube.com/watch?v=${videoId}`,
      });
    }
  };

  const handleMoveToFolder = (transcriptionId: string, folderId: string) => {
    updateNote({
      id: transcriptionId,
      data: {
        folderId,
      },
    });
  };

  console.log("folders", folders);
  console.log("notes", notes);

  // Transform notes and folders into the format expected by TranscriptionsSidebar
  const transformedFolders: FolderItem[] = folders?.map((folder) => ({
    id: folder.id,
    name: folder.name,
    transcriptions: notes
      .filter((note) => note.folderId === folder.id)
      .map((note) => ({
        id: note.id,
        title: note.title,
        videoId: extractVideoId(note.videoUrl),
        createdAt: new Date(note.createdAt),
      })),
    isOpen: false,
  }));

  const unorganizedTranscriptions: TranscriptionItem[] = notes
    .filter((note) => !note.folderId)
    .map((note) => ({
      id: note.id,
      title: note.title,
      videoId: extractVideoId(note.videoUrl),
      createdAt: new Date(note.createdAt),
    }));

  return (
    <div className="flex min-h-screen">
      <TranscriptionsSidebar
        transcriptions={unorganizedTranscriptions}
        folders={transformedFolders}
        onCreateFolder={handleCreateFolder}
        onCreateTranscription={handleCreateTranscription}
        onTranscriptionSelect={handleTranscriptionSelect}
        onMoveToFolder={handleMoveToFolder}
      />
      <main className="flex-1 pl-[300px]">
        <div className="container py-8">
          <form onSubmit={handleSubmit} className="mb-8 flex gap-2">
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
                          disabled={
                            isSummaryPending || summaryData !== undefined
                          }
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
      </main>
    </div>
  );
}

export default HomePage;
