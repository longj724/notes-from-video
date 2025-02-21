"use client";

// External Dependencies
import { useParams, useRouter } from "next/navigation";
import type { InferSelectModel } from "drizzle-orm";

// Internal Dependencies
import { useNote, useNotes, useUpdateNote } from "@/hooks/use-notes";
import { useGetTranscript } from "@/hooks/use-get-transcriptions";
import { useGenerateSummary } from "@/hooks/use-generate-summary";
import { useGetFolders } from "@/hooks/use-folders";
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

const noop = () => {
  // This is intentionally empty as we don't want to create new notes from the note page
};

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
  const { data: folders = [] } = useGetFolders();
  const { data: notes = [] } = useNotes();
  const { mutate: createFolder } = useCreateFolder();
  const { mutate: deleteFolder } = useDeleteFolder();
  const { mutate: updateNote } = useUpdateNote();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (note?.videoUrl) {
      fetchTranscript({ url: note.videoUrl });
    }
  };

  const handleGenerateSummary = () => {
    if (transcriptionData?.transcript) {
      generateSummary({ transcript: transcriptionData.transcript });
    }
  };

  const handleCreateFolder = (name: string) => {
    createFolder({ name });
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

  const videoId = note?.videoUrl ? extractVideoId(note.videoUrl) : "";

  return (
    <div className="flex min-h-screen">
      <TranscriptionsSidebar
        transcriptions={unorganizedTranscriptions}
        folders={transformedFolders}
        onCreateFolder={handleCreateFolder}
        onCreateTranscription={noop}
        onTranscriptionSelect={handleTranscriptionSelect}
        onMoveToFolder={handleMoveToFolder}
        onDeleteFolder={handleDeleteFolder}
        selectedNoteId={params.id}
      />
      <main className="flex-1 pl-[300px]">
        <TranscriptionEditor
          url={note?.videoUrl ?? ""}
          onSubmit={handleSubmit}
          isPending={isPending}
          videoId={videoId}
          transcript={transcriptionData?.transcript}
          summaryData={summaryData}
          isSummaryPending={isSummaryPending}
          onGenerateSummary={handleGenerateSummary}
          initialContent={note?.content ?? undefined}
          // isUrlDisabled
        />
      </main>
    </div>
  );
};

export default NotePage;
