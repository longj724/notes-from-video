// External Dependencies
import { useState, useEffect } from "react";

// Internal Dependencies
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface AICommandListProps {
  onSubmit: (command: string) => void;
  onClose: () => void;
}

export function AICommandList({
  onSubmit: handleAskQuestion,
  onClose,
}: AICommandListProps) {
  const [question, setQuestion] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <Card className="z-50 flex w-[300px] gap-2 border bg-background p-2 shadow-md">
      <Input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask AI..."
        className="flex-1"
        autoFocus
      />
      <Button onClick={() => handleAskQuestion(question)} size="sm">
        Ask
      </Button>
    </Card>
  );
}
