// External Dependencies
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono";

// Internal Dependencies
import { client } from "@/lib/hono";

type GetNotesRequestType = InferRequestType<(typeof client.api.notes)["$get"]>;

type GetNotesResponseType = InferResponseType<
  (typeof client.api.notes)["$get"],
  200
>;

type GetNoteRequestType = InferRequestType<
  (typeof client.api.notes)[":id"]["$get"]
>["param"];

type GetNoteResponseType = InferResponseType<
  (typeof client.api.notes)[":id"]["$get"],
  200
>;

type CreateNotesRequestType = InferRequestType<
  (typeof client.api.notes)["$post"]
>["json"];

type CreateNotesResponseType = InferResponseType<
  (typeof client.api.notes)["$post"],
  200
>;

type UpdateNotesRequestType = InferRequestType<
  (typeof client.api.notes)[":id"]["$put"]
>["json"];

type UpdateNotesResponseType = InferResponseType<
  (typeof client.api.notes)[":id"]["$put"],
  200
>;

type DeleteNotesRequestType = InferRequestType<
  (typeof client.api.notes)[":id"]["$delete"]
>["param"];

type DeleteNotesResponseType = InferResponseType<
  (typeof client.api.notes)[":id"]["$delete"],
  200
>;

export function useNotes() {
  return useQuery<GetNotesResponseType, Error, GetNotesRequestType>({
    queryKey: ["notes"],
    queryFn: async () => {
      const response = await client.api.notes.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }

      return await response.json();
    },
  });
}

export function useNote(id: string) {
  return useQuery<GetNoteResponseType, Error>({
    queryKey: ["notes", id],
    queryFn: async () => {
      const response = await client.api.notes[":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch note");
      }

      return response.json();
    },
    enabled: !!id,
  });
}

// export function useNotesByFolder(folderId: string) {
//   return useQuery({
//     queryKey: ["notes", "folder", folderId],
//     queryFn: async () => {
//       const response = await fetch(`/api/notes/folder/${folderId}`);
//       if (!response.ok) {
//         throw new Error("Failed to fetch folder notes");
//       }

//       return response.json();
//     },
//     enabled: !!folderId,
//   });
// }

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation<CreateNotesResponseType, Error, CreateNotesRequestType>({
    mutationFn: async (json) => {
      const response = await client.api.notes.$post({
        json,
      });

      if (!response.ok) {
        throw new Error("Failed to create note");
      }

      return response.json();
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

  return useMutation<
    UpdateNotesResponseType,
    Error,
    { id: string } & UpdateNotesRequestType
  >({
    mutationFn: async ({ id, ...json }) => {
      const response = await client.api.notes[":id"].$put({
        json,
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to update note");
      }

      return response.json();
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

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation<DeleteNotesResponseType, Error, DeleteNotesRequestType>({
    mutationFn: async ({ id }) => {
      const response = await client.api.notes[":id"].$delete({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      return response.json();
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}
