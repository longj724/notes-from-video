// External Dependencies
import { useState, useCallback, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
// Internal Dependencies
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useAskQuestion } from "@/hooks/use-ask-question";

interface AICommandListProps {
  onSubmit: (command: string) => void;
  onClose: () => void;
}

interface Transcription {
  text: string;
  duration: number;
  offset: number;
}

export function AICommandList({ onSubmit, onClose }: AICommandListProps) {
  const [question, setQuestion] = useState("");

  const queryClient = useQueryClient();
  const { mutate: askQuestion, data: questionResponse } = useAskQuestion();
  const { data: transcript } = useQuery<Transcription[] | null>({
    queryKey: ["current-transcription"],
    // This function won't run if data is already in the cache
    queryFn: () => Promise.resolve(null),
    // Prevent refetching
    staleTime: Infinity,
    // Only run the query if we have data in the cache
    enabled: queryClient.getQueryData(["current-transcription"]) !== undefined,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleAskQuestion = () => {
    if (transcript) {
      console.log("transcript is", transcript);
      // askQuestion({ question, transcript });
    }
  };

  return (
    <Card className="z-50 flex w-[300px] gap-2 border bg-background p-2 shadow-md">
      <Input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask AI..."
        className="flex-1"
        autoFocus
      />
      <Button onClick={handleAskQuestion} size="sm">
        Ask
      </Button>
    </Card>
  );
}
