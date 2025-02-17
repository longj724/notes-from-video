// External Dependencies
import { useState, useMemo, useRef } from "react";
import { ChevronUp, ChevronDown, X } from "lucide-react";

// Relative Dependencies
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Transcript = {
  text: string;
  duration: number;
  offset: number;
};

interface TranscriptViewerProps {
  transcript: {
    text: string;
    duration: number;
    offset: number;
    isMatch?: boolean;
    matchCount?: number;
  }[];
}

export function TranscriptViewer({ transcript }: TranscriptViewerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentMatch, setCurrentMatch] = useState(0);
  const transcriptRef = useRef<HTMLDivElement>(null);

  const highlightedTranscript = useMemo(() => {
    if (!searchQuery.trim()) return transcript;

    return transcript.map((segment) => {
      const regex = new RegExp(`(${searchQuery})`, "gi");
      const matches = segment.text.match(regex);

      return {
        ...segment,
        isMatch: !!matches,
        matchCount: matches?.length ?? 0,
        text: segment.text.replace(
          regex,
          '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>',
        ),
      };
    });
  }, [transcript, searchQuery]);

  const matchingSegments = highlightedTranscript.filter(
    (segment) => segment.isMatch,
  );
  const totalMatches = matchingSegments.reduce(
    (sum, segment) => sum + (segment.matchCount ?? 0),
    0,
  );

  const navigateToMatch = (direction: "next" | "prev") => {
    const newMatch =
      direction === "next"
        ? (currentMatch + 1) % totalMatches
        : (currentMatch - 1 + totalMatches) % totalMatches;
    setCurrentMatch(newMatch);

    // Find the segment containing the current match
    const marks = transcriptRef.current?.getElementsByTagName("mark");
    if (marks?.[newMatch]) {
      marks[newMatch].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setCurrentMatch(0);
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="flex gap-2">
        <div className="relative max-w-md flex-1">
          <Input
            type="text"
            placeholder="Search transcript..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentMatch(0);
            }}
            className="pr-24"
          />
          {searchQuery && (
            <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
              <span className="text-muted-foreground text-sm">
                {totalMatches > 0
                  ? `${currentMatch + 1}/${totalMatches}`
                  : "0/0"}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => navigateToMatch("prev")}
                disabled={totalMatches === 0}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => navigateToMatch("next")}
                disabled={totalMatches === 0}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <Card
        className="max-h-[500px] space-y-2 overflow-y-auto p-4"
        ref={transcriptRef}
      >
        {highlightedTranscript
          .filter(({ text }) => text.trim().length !== 0)
          .map((segment, index) => (
            <div
              key={index}
              className={`rounded p-2 ${
                segment.isMatch ? "bg-yellow-50 dark:bg-yellow-900/20" : ""
              }`}
            >
              <p
                dangerouslySetInnerHTML={{
                  __html: decodeHTMLEntities(segment.text),
                }}
                className="leading-relaxed"
              />
              <span className="text-muted-foreground text-sm">
                {formatTimestamp(Math.round(segment.offset))}
              </span>
            </div>
          ))}
      </Card>
    </div>
  );
}

const formatTimestamp = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const decodeHTMLEntities = (text: string): string => {
  text = text.replace(/&amp;/g, "&");
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
};
