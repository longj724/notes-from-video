// External Dependencies

// Relative Dependencies
import { Card } from "@/components/ui/card";

type Transcript = {
  text: string;
  duration: number;
  offset: number;
};

export function TranscriptViewer({ transcript }: { transcript: Transcript[] }) {
  return (
    <Card className="mt-4 max-h-[500px] overflow-y-auto p-4">
      {transcript
        .filter(({ text }) => text.trim().length !== 0)
        .map((item, index) => (
          <div key={index} className="mb-4">
            <div className="text-muted-foreground text-sm">
              {formatTimestamp(Math.round(item.offset))}
            </div>
            <p>{decodeHTMLEntities(item.text)}</p>
          </div>
        ))}
    </Card>
  );
}

const formatTimestamp = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const decodeHTMLEntities = (text: string): string => {
  text = text.replace(/&amp;/g, "&");
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
};
