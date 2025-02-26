// External Dependencies
import { useState, useCallback, useEffect } from "react";

// Internal Dependencies
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface AICommandListProps {
  onSubmit: (command: string) => void;
  onClose: () => void;
}

export function AICommandList({ onSubmit, onClose }: AICommandListProps) {
  const [command, setCommand] = useState("");

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (command.trim()) {
        onSubmit(command.trim());
        setCommand("");
      }
    },
    [command, onSubmit],
  );

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
      {/* <form onSubmit={handleSubmit} className="flex gap-2"> */}
      <Input
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        placeholder="Ask AI..."
        className="flex-1"
        autoFocus
      />
      <Button type="submit" size="sm">
        Ask
      </Button>
      {/* </form> */}
    </Card>
  );
}
