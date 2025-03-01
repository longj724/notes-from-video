// External Dependencies
import { useState, useMemo, useRef, useEffect, memo } from "react";
import { ChevronUp, ChevronDown, X, Copy } from "lucide-react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import { cn } from "@/lib/utils";

// Relative Dependencies
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TranscriptViewerProps {
  transcript: {
    text: string;
    duration: number;
    offset: number;
    isMatch?: boolean;
    matchCount?: number;
  }[];
  onAddNote?: (text: string, timestamp: number) => void;
  onTimeClick?: (timestamp: number) => void;
  currentTime?: number;
}

interface TranscriptSegmentProps {
  segment: {
    text: string;
    offset: number;
    isMatch?: boolean;
  };
  searchQuery: string;
  isCurrentSegment: boolean;
  onTimeClick?: (timestamp: number) => void;
  onAddNote?: (text: string, timestamp: number) => void;
}

const TranscriptSegment = memo(function TranscriptSegment({
  segment,
  searchQuery,
  isCurrentSegment,
  onTimeClick,
  onAddNote,
}: TranscriptSegmentProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    try {
      const regex = new RegExp(`(${query})`, "gi");
      const parts = text.split(regex);
      return parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-yellow-200 dark:bg-yellow-800">
            {part}
          </mark>
        ) : (
          part
        ),
      );
    } catch (error) {
      // If regex is invalid, return the original text
      return text;
    }
  };

  return (
    <div
      className={cn(
        "group flex items-center gap-2 rounded-md p-2 transition-all duration-200",
        segment.isMatch ? "bg-yellow-50 dark:bg-yellow-900/20" : "",
        isCurrentSegment
          ? "bg-blue-100 shadow-sm ring-2 ring-blue-400 dark:bg-blue-900/40 dark:ring-blue-500"
          : "hover:bg-muted/50",
      )}
    >
      <span className="text-sm text-muted-foreground">
        {formatTime(Math.round(segment.offset))}
      </span>
      <p
        className="flex-1 cursor-pointer leading-relaxed hover:text-primary"
        onClick={() => onTimeClick?.(Math.round(segment.offset))}
      >
        {highlightText(decodeHTMLEntities(segment.text), searchQuery)}
      </p>
      <Button
        variant="ghost"
        size="sm"
        className="opacity-0 group-hover:opacity-100"
        onClick={() =>
          onAddNote?.(
            decodeHTMLEntities(segment.text),
            Math.round(segment.offset),
          )
        }
      >
        Add note
      </Button>
    </div>
  );
});

export function TranscriptViewer({
  transcript,
  onAddNote,
  onTimeClick,
  currentTime,
}: TranscriptViewerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [currentMatch, setCurrentMatch] = useState(0);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const debouncedSetSearch = useDebouncedCallback(
    (value: string): void => {
      setDebouncedSearchQuery(value);
    },
    1000,
    { maxWait: 2000 },
  );

  // Find the current segment based on video time
  const currentSegmentIndex = useMemo(() => {
    if (currentTime === undefined) return -1;
    return transcript.findIndex((segment, index) => {
      const nextSegment = transcript[index + 1];
      const segmentEnd = nextSegment
        ? nextSegment.offset
        : segment.offset + segment.duration;
      return currentTime >= segment.offset && currentTime < segmentEnd;
    });
  }, [transcript, currentTime]);

  // Enhanced auto-scroll behavior
  useEffect(() => {
    if (
      currentSegmentIndex === -1 ||
      !scrollAreaRef.current ||
      !viewportRef.current
    )
      return;

    const segmentElement = scrollAreaRef.current.children[
      currentSegmentIndex
    ] as HTMLElement;
    if (!segmentElement) return;

    const viewportHeight = viewportRef.current.clientHeight;
    const segmentTop = segmentElement.offsetTop;
    const segmentHeight = segmentElement.offsetHeight;
    const currentScroll = viewportRef.current.scrollTop;
    const buffer = viewportHeight * 0.3; // 30% buffer zone

    // Only scroll if the segment is outside the visible area with buffer
    if (
      segmentTop < currentScroll + buffer ||
      segmentTop + segmentHeight > currentScroll + viewportHeight - buffer
    ) {
      const targetScroll = Math.max(
        0,
        segmentTop - viewportHeight / 2 + segmentHeight / 2,
      );

      viewportRef.current.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    }
  }, [currentSegmentIndex]);

  const handleCopyTranscript = () => {
    const fullText = transcript
      .map((segment) => decodeHTMLEntities(segment.text))
      .join("\n");
    navigator.clipboard
      .writeText(fullText)
      .then(() => toast.success("Transcript copied to clipboard"))
      .catch(() => toast.error("Failed to copy transcript"));
  };

  const highlightedTranscript = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return transcript;

    return transcript.map((segment) => {
      const regex = new RegExp(debouncedSearchQuery, "gi");
      const matches = segment.text.match(regex);

      return {
        ...segment,
        isMatch: !!matches,
        matchCount: matches?.length ?? 0,
      };
    });
  }, [transcript, debouncedSearchQuery]);

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
    setDebouncedSearchQuery("");
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    debouncedSetSearch.cancel();
    setCurrentMatch(0);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative max-w-md flex-1">
          <Input
            type="text"
            placeholder="Search transcript..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call
              debouncedSetSearch(e.target.value);
              setCurrentMatch(0);
            }}
            className="pr-24"
          />
          {searchQuery && (
            <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
              <span className="text-sm text-muted-foreground">
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
        <Button
          variant="outline"
          size="icon"
          onClick={handleCopyTranscript}
          title="Copy transcript"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>

      <Card className="h-[350px]" ref={transcriptRef}>
        <ScrollArea className="h-full" ref={viewportRef}>
          <div className="space-y-2 p-4" ref={scrollAreaRef}>
            {highlightedTranscript
              .filter(({ text }) => text.trim().length !== 0)
              .map((segment, index) => (
                <TranscriptSegment
                  key={segment.offset}
                  segment={segment}
                  searchQuery={debouncedSearchQuery}
                  isCurrentSegment={index === currentSegmentIndex}
                  onTimeClick={onTimeClick}
                  onAddNote={onAddNote}
                />
              ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}

const decodeHTMLEntities = (text: string): string => {
  text = text.replace(/&amp;/g, "&");
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
};
