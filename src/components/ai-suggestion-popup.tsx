// External Dependencies
import { useEffect, useRef } from "react";

// Internal Dependencies
import { AICommandList } from "./ai-command-list";

interface AISuggestionPopupProps {
  coords: { x: number; y: number };
  onSubmit: (command: string) => void;
  onClose: () => void;
  editorRef: HTMLElement;
}

export function AISuggestionPopup({
  coords,
  onSubmit,
  onClose,
  editorRef,
}: AISuggestionPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      const mouseEvent = event as MouseEvent;
      if (
        popupRef.current &&
        !popupRef.current.contains(mouseEvent.target as Node)
      ) {
        onClose();
      }
    };

    editorRef.addEventListener("mousedown", handleClickOutside);
    return () => editorRef.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, editorRef]);

  return (
    <div
      ref={popupRef}
      style={{
        position: "absolute",
        left: coords.x,
        top: coords.y + 24, // Add some offset from the cursor
        zIndex: 50,
      }}
    >
      <AICommandList onSubmit={onSubmit} onClose={onClose} />
    </div>
  );
}
