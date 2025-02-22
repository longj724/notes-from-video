"use client";

// External Dependencies
import { useState } from "react";
import { useRouter } from "next/navigation";

// Internal Dependencies
import { useGetTranscript } from "@/hooks/use-get-transcriptions";
import { useGenerateSummary } from "@/hooks/use-generate-summary";
import {
  useNotes,
  useCreateNote,
  useUpdateNote,
  useDeleteNote,
} from "@/hooks/use-notes";
import { TranscriptionsSidebar } from "@/components/transcriptions-sidebar";
import { TranscriptionEditor } from "@/components/transcription-editor";
import type { TranscriptionItem, Note } from "@/lib/types";

function extractVideoId(url: string): string {
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = regex.exec(url);
  return match?.[1] ?? "";
}

function HomePage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
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
  const { data: notes = [] } = useNotes();
  const { mutate: updateNote } = useUpdateNote();
  const { mutate: deleteNote } = useDeleteNote();
  const { mutate: createNote } = useCreateNote();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTranscript({ url });
  };

  const handleGenerateSummary = () => {
    if (transcriptionData?.transcript) {
      generateSummary({ transcript: transcriptionData.transcript });
    }
  };

  const handleCreateTranscription = () => {
    const videoUrl = "";
    const title = "New Note";

    createNote({
      title,
      content: "",
      videoUrl,
    });
  };

  const handleTranscriptionSelect = (transcription: TranscriptionItem) => {
    router.push(`/notes/${transcription.id}`);
  };

  const handleDeleteNote = (noteId: string) => {
    deleteNote({ id: noteId });
  };

  const handleUpdateNoteTitle = (noteId: string, title: string) => {
    updateNote({
      id: noteId,
      title,
    });
  };

  const transcriptionItems: TranscriptionItem[] = (notes as Note[]).map(
    (note) => ({
      id: note.id,
      title: note.title,
      videoId: extractVideoId(note.videoUrl),
      createdAt: new Date(note.createdAt),
    }),
  );

  return (
    <div className="flex min-h-screen">
      <TranscriptionsSidebar
        transcriptions={transcriptionItems}
        onCreateTranscription={handleCreateTranscription}
        onTranscriptionSelect={handleTranscriptionSelect}
        onDeleteNote={handleDeleteNote}
        onUpdateNoteTitle={handleUpdateNoteTitle}
        selectedNoteId={undefined}
      />
      <main className="flex-1 pl-[300px]">
        <TranscriptionEditor
          url={url}
          onUrlChange={setUrl}
          onSubmit={handleSubmit}
          isPending={isPending}
          videoId={transcriptionData?.videoId}
          transcript={transcriptionData?.transcript}
          summaryData={summaryData}
          isSummaryPending={isSummaryPending}
          onGenerateSummary={handleGenerateSummary}
        />
      </main>
    </div>
  );
}

export default HomePage;
