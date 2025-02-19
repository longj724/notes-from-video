"use client";

// External Dependencies
import { useState } from "react";
import {
  FolderPlus,
  Plus,
  ChevronRight,
  ChevronDown,
  Folder,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Internal Dependencies
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

export type TranscriptionItem = {
  id: string;
  title: string;
  videoId: string;
  createdAt: Date;
};

export type FolderItem = {
  id: string;
  name: string;
  transcriptions: TranscriptionItem[];
  isOpen?: boolean;
};

type TranscriptionsSidebarProps = {
  transcriptions: TranscriptionItem[];
  folders: FolderItem[];
  onTranscriptionSelect: (transcription: TranscriptionItem) => void;
  onCreateFolder: (name: string) => void;
  onCreateTranscription: () => void;
  onMoveToFolder: (transcriptionId: string, folderId: string) => void;
};

export function TranscriptionsSidebar({
  transcriptions,
  folders,
  onTranscriptionSelect,
  onCreateFolder,
  onCreateTranscription,
  onMoveToFolder,
}: TranscriptionsSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [localFolders, setLocalFolders] = useState(folders);

  const toggleFolder = (folderId: string) => {
    setLocalFolders((prev) =>
      prev.map((folder) =>
        folder.id === folderId ? { ...folder, isOpen: !folder.isOpen } : folder,
      ),
    );
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      console.log("Creating folder:", newFolderName.trim());
      onCreateFolder(newFolderName);
      setNewFolderName("");
      setIsCreatingFolder(false);
    }
  };

  return (
    <div
      className={cn(
        "bg-background fixed left-0 top-0 h-screen border-r transition-all duration-300",
        isCollapsed ? "w-[60px]" : "w-[300px]",
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b px-4 py-4">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold">Transcriptions</h2>
          )}
          <div className="ml-auto flex gap-2">
            {!isCollapsed && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsCreatingFolder(true)}
                >
                  <FolderPlus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onCreateTranscription}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <PanelLeft className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {!isCollapsed && isCreatingFolder && (
          <div className="flex items-center gap-2 border-b p-2">
            <Input
              placeholder="Folder name..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateFolder();
                if (e.key === "Escape") setIsCreatingFolder(false);
              }}
            />
            <Button size="sm" onClick={handleCreateFolder}>
              Create
            </Button>
          </div>
        )}

        <ScrollArea className="flex-1">
          {!isCollapsed && (
            <div className="p-2">
              {localFolders.map((folder) => (
                <div key={folder.id} className="mb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => toggleFolder(folder.id)}
                  >
                    {folder.isOpen ? (
                      <ChevronDown className="mr-2 h-4 w-4" />
                    ) : (
                      <ChevronRight className="mr-2 h-4 w-4" />
                    )}
                    <Folder className="mr-2 h-4 w-4" />
                    {folder.name}
                  </Button>
                  {folder.isOpen && (
                    <div className="ml-6 mt-1 space-y-1">
                      {folder.transcriptions.map((transcription) => (
                        <Button
                          key={transcription.id}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => onTranscriptionSelect(transcription)}
                        >
                          {transcription.title}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="space-y-1">
                {transcriptions
                  .filter(
                    (t) =>
                      !localFolders.some((f) =>
                        f.transcriptions.some((ft) => ft.id === t.id),
                      ),
                  )
                  .map((transcription) => (
                    <Button
                      key={transcription.id}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => onTranscriptionSelect(transcription)}
                    >
                      {transcription.title}
                    </Button>
                  ))}
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
