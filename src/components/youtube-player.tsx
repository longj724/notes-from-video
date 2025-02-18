// External Dependencies
import { useRef, useImperativeHandle, forwardRef } from "react";

export interface YouTubePlayerRef {
  seekTo: (seconds: number) => void;
}

interface YouTubePlayerProps {
  videoId: string;
  width?: number;
  height?: number;
}

export const YouTubePlayer = forwardRef<YouTubePlayerRef, YouTubePlayerProps>(
  ({ videoId, width = 640, height = 360 }, ref) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useImperativeHandle(ref, () => ({
      seekTo: (seconds: number) => {
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({
              event: "command",
              func: "seekTo",
              args: [seconds],
            }),
            "*",
          );
        }
      },
    }));

    return (
      <div className="relative w-full pt-[56.25%]">
        <iframe
          ref={iframeRef}
          className="absolute inset-0 h-full w-full rounded-lg"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  },
);

YouTubePlayer.displayName = "YouTubePlayer";
