"use client";

// External Dependencies
import { useState } from "react";

// Internal Dependencies
import { useGetTranscript } from "@/hooks/use-get-transcriptions";
import { useGenerateSummary } from "@/hooks/use-generate-summary";
import { TranscriptionEditor } from "@/components/transcription-editor";

function extractVideoId(url: string): string {
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = regex.exec(url);
  return match?.[1] ?? "";
}

function HomePage() {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTranscript({ url });
  };

  const handleGenerateSummary = () => {
    if (transcriptionData?.transcript) {
      generateSummary({ transcript: transcriptionData.transcript });
    }
  };

  return (
    <div className="flex min-h-screen w-full">
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
    </div>
  );
}

export default HomePage;
