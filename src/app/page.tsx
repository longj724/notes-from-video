"use client";

// External Dependencies
import { useState } from "react";
import type { InferSelectModel } from "drizzle-orm";
import { useRouter } from "next/navigation";

// Internal Dependencies
import { useGetTranscript } from "@/hooks/use-get-transcriptions";
import { useGenerateSummary } from "@/hooks/use-generate-summary";
import { useGetFolders } from "@/hooks/use-folders";
import {
  useNotes,
  useCreateNote,
  useUpdateNote,
  useDeleteNote,
} from "@/hooks/use-notes";
import { useCreateFolder, useDeleteFolder } from "@/hooks/use-folders";
import { TranscriptionsSidebar } from "@/components/transcriptions-sidebar";
import { TranscriptionEditor } from "@/components/transcription-editor";
import { folders, notes } from "@/server/db/schema";
import type {
  TranscriptionItem,
  FolderItem,
} from "@/components/transcriptions-sidebar";

type Folder = InferSelectModel<typeof folders>;
type Note = InferSelectModel<typeof notes>;

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
  const { data: folders = [] } = useGetFolders();
  const { data: notes = [] } = useNotes();
  const { mutate: createFolder } = useCreateFolder();
  const { mutate: deleteFolder } = useDeleteFolder();
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

  const handleCreateFolder = (name: string) => {
    createFolder({ name });
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

  const handleMoveToFolder = (transcriptionId: string, folderId: string) => {
    updateNote({
      id: transcriptionId,
      folderId,
    });
  };

  const handleDeleteFolder = (folderId: string) => {
    deleteFolder({ id: folderId });
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

  const transformedFolders: FolderItem[] = (folders as Folder[]).map(
    (folder) => ({
      id: folder.id,
      name: folder.name,
      transcriptions: (notes as Note[])
        .filter((note) => note.folderId === folder.id)
        .map((note) => ({
          id: note.id,
          title: note.title,
          videoId: extractVideoId(note.videoUrl),
          createdAt: new Date(note.createdAt),
        })),
      isOpen: false,
    }),
  );

  const unorganizedTranscriptions: TranscriptionItem[] = (notes as Note[])
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
        onDeleteFolder={handleDeleteFolder}
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
