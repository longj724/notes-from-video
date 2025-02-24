"use client";

// External Dependencies
import { useState } from "react";
import { MoreHorizontal, Pencil, Plus, Trash2, X } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";

// Internal Dependencies
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useGetNotes,
  useCreateNote,
  useUpdateNote,
  useDeleteNote,
} from "@/hooks/use-notes";
import { Note } from "@/lib/types";
import { cn } from "@/lib/utils";

const AppSidebar = () => {
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteTitle, setEditingNoteTitle] = useState("");

  const params = useParams<{ id: string }>();
  const { isMobile } = useSidebar();

  const { data: notes } = useGetNotes();
  const { mutate: createNote } = useCreateNote();
  const { mutate: updateNote } = useUpdateNote();
  const { mutate: deleteNote } = useDeleteNote();

  const handleCreateNote = () => {
    const videoUrl = "";
    const title = "New Note";

    createNote({
      title,
      content: "",
      videoUrl,
    });
  };

  const handleUpdateNoteTitle = (noteId: string, title: string) => {
    updateNote({
      id: noteId,
      title,
    });
  };

  const startEditingNote = (note: Note) => {
    setEditingNoteId(note.id);
    setEditingNoteTitle(note.title);
  };

  const saveNoteTitle = () => {
    if (editingNoteId && editingNoteTitle.trim()) {
      handleUpdateNoteTitle(editingNoteId, editingNoteTitle.trim());
      setEditingNoteId(null);
      setEditingNoteTitle("");
    }
  };

  const cancelEditingNote = () => {
    setEditingNoteId(null);
    setEditingNoteTitle("");
  };

  const handleDeleteNote = () => {
    if (noteToDelete) {
      deleteNote({ id: noteToDelete });
      setNoteToDelete(null);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between border-b px-4 py-4">
          <h2 className="text-lg font-semibold">Notes</h2>

          <div className="ml-auto flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCreateNote}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Add Note</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <SidebarTrigger />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {notes?.map((note) => (
            <SidebarMenuItem
              key={note.id}
              className={cn(
                "flex flex-row items-center p-1 hover:bg-gray-100",
                params.id === note.id && "bg-gray-100",
              )}
            >
              {editingNoteId === note.id ? (
                <div className="flex w-full items-center gap-2 px-2">
                  <Input
                    value={editingNoteTitle}
                    onChange={(e) => setEditingNoteTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        saveNoteTitle();
                      } else if (e.key === "Escape") {
                        cancelEditingNote();
                      }
                    }}
                    className="h-8"
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={saveNoteTitle}
                    className="h-8 w-8"
                  >
                    <span className="sr-only">Save</span>✓
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={cancelEditingNote}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Cancel</span>
                  </Button>
                </div>
              ) : (
                <>
                  <SidebarMenuButton asChild>
                    <Link href={`/notes/${note.id}`} title={note.title}>
                      <span>{note.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover className="mt-1">
                        <MoreHorizontal />
                        <span className="sr-only">More</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56 rounded-lg"
                      side={isMobile ? "bottom" : "right"}
                      align={isMobile ? "end" : "start"}
                    >
                      <DropdownMenuItem onClick={() => startEditingNote(note)}>
                        <Pencil className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Rename</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setNoteToDelete(note.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <Dialog
        open={noteToDelete !== null}
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setNoteToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteNote}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
};

export default AppSidebar;
