"use client";

// External Dependencies
import { useParams } from "next/navigation";
import _ from "lodash";

// Internal Dependencies
import { useNote } from "@/hooks/use-notes";
import { TranscriptionEditor } from "@/components/transcription-editor";

const NotePage = () => {
  const params = useParams<{ id: string }>();
  const { data: note } = useNote(params.id);

  return (
    <div className="flex min-h-screen w-full">
      <TranscriptionEditor url={note?.videoUrl ?? null} />
    </div>
  );
};

export default NotePage;
