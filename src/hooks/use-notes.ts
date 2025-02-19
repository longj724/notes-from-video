// External Dependencies
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type InferSelectModel } from "drizzle-orm";

// Internal Dependencies
import { notes } from "@/server/db/schema";

type Note = InferSelectModel<typeof notes>;

interface CreateNoteData {
  title: string;
  content?: string;
  videoUrl: string;
  folderId?: string;
}

interface UpdateNoteData {
  title?: string;
  content?: string;
  videoUrl?: string;
  folderId?: string | null;
}

export function useNotes() {
  return useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const response = await fetch("/api/notes");
      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }
      return response.json() as Promise<Note[]>;
    },
  });
}

export function useNotesByFolder(folderId: string) {
  return useQuery({
    queryKey: ["notes", "folder", folderId],
    queryFn: async () => {
      const response = await fetch(`/api/notes/folder/${folderId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch folder notes");
      }
      return response.json() as Promise<Note[]>;
    },
    enabled: !!folderId,
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateNoteData) => {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create note");
      }

      return response.json() as Promise<Note>;
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["notes"] });
      if (variables.folderId) {
        void queryClient.invalidateQueries({
          queryKey: ["notes", "folder", variables.folderId],
        });
      }
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateNoteData }) => {
      const response = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update note");
      }

      return response.json() as Promise<Note>;
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["notes"] });
      if (variables.data.folderId) {
        void queryClient.invalidateQueries({
          queryKey: ["notes", "folder", variables.data.folderId],
        });
      }
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      return response.json() as Promise<Note>;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}
