"use client";

// External Dependencies
import React, { useState } from "react";
import {
  Plus,
  PanelLeftClose,
  PanelLeft,
  Trash2,
  Pencil,
  Check,
  X,
} from "lucide-react";

// Internal Dependencies
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { TranscriptionItem } from "@/lib/types";
import { cn } from "@/lib/utils";

type TranscriptionsSidebarProps = {
  transcriptions: TranscriptionItem[];
  onTranscriptionSelect: (transcription: TranscriptionItem) => void;
  onCreateTranscription: () => void;
  onDeleteNote: (noteId: string) => void;
  onUpdateNoteTitle: (noteId: string, title: string) => void;
  selectedNoteId?: string;
};

export function TranscriptionsSidebar({
  transcriptions,
  onTranscriptionSelect,
  onCreateTranscription,
  onDeleteNote,
  onUpdateNoteTitle,
  selectedNoteId,
}: TranscriptionsSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteTitle, setEditingNoteTitle] = useState("");

  const startEditingNote = (note: TranscriptionItem) => {
    setEditingNoteId(note.id);
    setEditingNoteTitle(note.title);
  };

  const saveNoteTitle = () => {
    if (editingNoteId && editingNoteTitle.trim()) {
      onUpdateNoteTitle(editingNoteId, editingNoteTitle.trim());
      setEditingNoteId(null);
      setEditingNoteTitle("");
    }
  };

  const cancelEditingNote = () => {
    setEditingNoteId(null);
    setEditingNoteTitle("");
  };

  const renderNote = (transcription: TranscriptionItem) => {
    const isEditing = editingNoteId === transcription.id;

    return (
      <div key={transcription.id} className="group relative">
        {isEditing ? (
          <div className="flex items-center gap-1">
            <Input
              value={editingNoteTitle}
              onChange={(e) => setEditingNoteTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveNoteTitle();
                if (e.key === "Escape") cancelEditingNote();
              }}
              className="h-8 flex-1"
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={saveNoteTitle}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={cancelEditingNote}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <Button
              variant={
                selectedNoteId === transcription.id ? "secondary" : "ghost"
              }
              size="sm"
              className="w-full justify-start"
              onClick={() => onTranscriptionSelect(transcription)}
            >
              {transcription.title}
            </Button>
            <div className="absolute right-1 top-1/2 flex -translate-y-1/2 gap-0.5 bg-background opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  startEditingNote(transcription);
                }}
              >
                <Pencil className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  setNoteToDelete(transcription.id);
                }}
              >
                <Trash2 className="h-3 w-3 text-destructive" />
              </Button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-screen border-r bg-background transition-all duration-300",
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
              <Button
                variant="ghost"
                size="icon"
                onClick={onCreateTranscription}
              >
                <Plus className="h-4 w-4" />
              </Button>
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

        <ScrollArea className="flex-1">
          {!isCollapsed && (
            <div className="space-y-1 p-2">
              {transcriptions?.map(renderNote)}
            </div>
          )}
        </ScrollArea>

        <Dialog
          open={!!noteToDelete}
          onOpenChange={() => setNoteToDelete(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Note</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this note? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setNoteToDelete(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (noteToDelete) {
                    onDeleteNote(noteToDelete);
                    setNoteToDelete(null);
                  }
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
