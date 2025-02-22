"use client";

// External Dependencies
import { useParams, useRouter } from "next/navigation";
import { useCallback } from "react";
import _ from "lodash";

// Internal Dependencies
import {
  useNote,
  useNotes,
  useUpdateNote,
  useDeleteNote,
} from "@/hooks/use-notes";
import { useGetTranscript } from "@/hooks/use-get-transcriptions";
import { useGenerateSummary } from "@/hooks/use-generate-summary";
import { useCreateNote } from "@/hooks/use-notes";
import { TranscriptionsSidebar } from "@/components/transcriptions-sidebar";
import { TranscriptionEditor } from "@/components/transcription-editor";
import type { TranscriptionItem, Note } from "@/lib/types";

function extractVideoId(url: string): string {
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = regex.exec(url);
  return match?.[1] ?? "";
}

const noop = () => {
  // This is intentionally empty as we don't want to create new notes from the note page
};

const DEBOUNCE_MS = 1000;

const NotePage = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data: note } = useNote(params.id);
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
  const { data: notes } = useNotes();
  const { mutate: createNote } = useCreateNote();
  const { mutate: updateNote } = useUpdateNote();
  const { mutate: deleteNote } = useDeleteNote();

  const debouncedUpdateNote = useCallback(
    _.debounce((noteId: string, content: string) => {
      console.log("debouncedUpdateNote", noteId, content);
      updateNote({
        id: noteId,
        content,
      });
    }, DEBOUNCE_MS),
    [updateNote],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleUrlChange = (newUrl: string) => {
    if (note) {
      fetchTranscript({ url: newUrl });
      updateNote({
        id: note.id,
        videoUrl: newUrl,
      });
    }
  };

  const handleGenerateSummary = () => {
    if (transcriptionData?.transcript) {
      generateSummary({ transcript: transcriptionData.transcript });
    }
  };

  const handleTranscriptionSelect = (transcription: TranscriptionItem) => {
    router.push(`/notes/${transcription.id}`);
  };

  const handleMoveToFolder = (transcriptionId: string, folderId: string) => {
    updateNote({
      id: transcriptionId,
      folderId,
    });
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

  const handleDeleteNote = (noteId: string) => {
    deleteNote({ id: noteId });
    if (noteId === params.id) {
      router.push("/");
    }
  };

  const handleUpdateNoteTitle = (noteId: string, title: string) => {
    updateNote({
      id: noteId,
      title,
    });
  };

  const handleContentChange = (content: string) => {
    if (note) {
      debouncedUpdateNote(note.id, content);
    }
  };

  const formattedTranscriptions: TranscriptionItem[] = (notes as Note[]).map(
    (note) => ({
      id: note.id,
      title: note.title,
      videoId: extractVideoId(note.videoUrl),
      createdAt: new Date(note.createdAt),
    }),
  );

  const videoId = note?.videoUrl ? extractVideoId(note.videoUrl) : "";

  return (
    <div className="flex min-h-screen">
      <TranscriptionsSidebar
        transcriptions={formattedTranscriptions}
        onCreateTranscription={handleCreateTranscription}
        onTranscriptionSelect={handleTranscriptionSelect}
        onDeleteNote={handleDeleteNote}
        onUpdateNoteTitle={handleUpdateNoteTitle}
        selectedNoteId={params.id}
      />
      <main className="flex-1 pl-[300px]">
        <TranscriptionEditor
          url={note?.videoUrl ?? ""}
          onUrlChange={handleUrlChange}
          onSubmit={handleSubmit}
          isPending={isPending}
          videoId={videoId}
          transcript={transcriptionData?.transcript}
          summaryData={summaryData}
          isSummaryPending={isSummaryPending}
          onGenerateSummary={handleGenerateSummary}
          initialContent={note?.content ?? undefined}
          onContentChange={handleContentChange}
        />
      </main>
    </div>
  );
};

export default NotePage;
