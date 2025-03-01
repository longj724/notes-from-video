// External Dependencies
import { useMutation } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono";

// Internal Dependencies
import { client } from "@/lib/hono";

type RequestType = InferRequestType<
  (typeof client.api.transcriptions)["question"]["$post"]
>["json"];

export type ResponseType = InferResponseType<
  (typeof client.api.transcriptions)["question"]["$post"],
  200
>;

export function useAskQuestion() {
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.transcriptions.question.$post({ json });

      if (!response.ok) {
        throw new Error("Failed to ask question");
      }

      return await response.json();
    },
  });
}
