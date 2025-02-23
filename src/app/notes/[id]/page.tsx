"use client";

// External Dependencies
import { useParams, useRouter } from "next/navigation";
import { useCallback } from "react";
import _ from "lodash";

// Internal Dependencies
import { useNote, useUpdateNote } from "@/hooks/use-notes";
import { useGetTranscript } from "@/hooks/use-get-transcriptions";
import { useGenerateSummary } from "@/hooks/use-generate-summary";
import { TranscriptionEditor } from "@/components/transcription-editor";

function extractVideoId(url: string): string {
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = regex.exec(url);
  return match?.[1] ?? "";
}

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
  const { mutate: updateNote } = useUpdateNote();

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

  const handleContentChange = (content: string) => {
    if (note) {
      debouncedUpdateNote(note.id, content);
    }
  };

  const videoId = note?.videoUrl ? extractVideoId(note.videoUrl) : "";

  return (
    <div className="flex min-h-screen w-full">
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
    </div>
  );
};

export default NotePage;
