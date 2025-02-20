// External Dependencies
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono";
import type { InferSelectModel } from "drizzle-orm";

// Internal Dependencies
import { client } from "@/lib/hono";
import { folders } from "@/server/db/schema";

type CreateFolderRequestType = InferRequestType<
  (typeof client.api.folders)["$post"]
>["json"];

type CreateFolderResponseType = InferResponseType<
  (typeof client.api.folders)["$post"],
  200
>;

type GetFoldersRequestType = InferRequestType<
  (typeof client.api.folders)["$get"]
>;

type GetFoldersResponseType = InferSelectModel<typeof folders>[];

type APIFolderResponse = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string | null;
};

type UpdateFolderRequestType = InferRequestType<
  (typeof client.api.folders)[":id"]["$put"]
>["json"];

type UpdateFolderResponseType = InferResponseType<
  (typeof client.api.folders)[":id"]["$put"],
  200
>;

type DeleteFolderRequestType = InferRequestType<
  (typeof client.api.folders)[":id"]["$delete"]
>["param"];

type DeleteFolderResponseType = InferResponseType<
  (typeof client.api.folders)[":id"]["$delete"],
  200
>;

export function useGetFolders() {
  return useQuery<GetFoldersResponseType>({
    queryKey: ["folders"],
    queryFn: async () => {
      const response = await client.api.folders.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch folders");
      }

      const data = (await response.json()) as APIFolderResponse[];
      return data.map((folder) => ({
        ...folder,
        createdAt: new Date(folder.createdAt),
        updatedAt: folder.updatedAt ? new Date(folder.updatedAt) : null,
      }));
    },
  });
}

export function useCreateFolder() {
  const queryClient = useQueryClient();

  return useMutation<CreateFolderResponseType, Error, CreateFolderRequestType>({
    mutationFn: async (data) => {
      const response = await client.api.folders.$post({
        json: data,
      });

      if (!response.ok) {
        throw new Error("Failed to create folder");
      }

      return response.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });
}

export function useUpdateFolder(id: string) {
  const queryClient = useQueryClient();

  return useMutation<UpdateFolderResponseType, Error, UpdateFolderRequestType>({
    mutationFn: async (json) => {
      const response = await client.api.folders[":id"].$put({
        json,
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to update folder");
      }

      return response.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });
}

export function useDeleteFolder() {
  const queryClient = useQueryClient();

  return useMutation<DeleteFolderResponseType, Error, DeleteFolderRequestType>({
    mutationFn: async ({ id }) => {
      const response = await client.api.folders[":id"].$delete({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to delete folder");
      }

      return response.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["folders"] });
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}
