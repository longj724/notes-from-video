// External Dependencies
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono";

// Internal Dependencies
import { client } from "@/lib/hono";

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

type GetFoldersResponseType = InferResponseType<
  (typeof client.api.folders)["$get"],
  200
>;

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
  return useQuery<GetFoldersResponseType, Error, GetFoldersRequestType>({
    queryKey: ["folders"],
    queryFn: async () => {
      const response = await client.api.folders.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch transcript");
      }

      return await response.json();
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
