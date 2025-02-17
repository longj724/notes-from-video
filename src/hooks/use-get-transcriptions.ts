// External Dependencies
import { InferResponseType, InferRequestType } from "hono";
import { useMutation } from "@tanstack/react-query";

// Internal Dependencies
import { client } from "@/lib/hono";

type RequestType = InferRequestType<
  (typeof client.api.transcriptions)["$post"]
>["json"];

export type ResponseType = InferResponseType<
  (typeof client.api.transcriptions)["$post"],
  200
>;

export function useTranscript() {
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.transcriptions.$post({
        json,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transcript");
      }

      return await response.json();
    },
  });
}
