// External Dependencies
import { useRef, useImperativeHandle, forwardRef, useEffect } from "react";

declare global {
  interface Window {
    YT: {
      Player: new (
        element: HTMLIFrameElement,
        config: {
          events: {
            onStateChange: (event: { data: number }) => void;
          };
        },
      ) => {
        getCurrentTime: () => number;
        seekTo: (seconds: number) => void;
      };
      PlayerState: {
        PLAYING: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export interface YouTubePlayerRef {
  seekTo: (seconds: number) => void;
}

interface YouTubePlayerProps {
  videoId: string;
  width?: number;
  height?: number;
  onTimeUpdate?: (currentTime: number) => void;
}

type YouTubePlayer = {
  getCurrentTime: () => number;
  seekTo: (seconds: number) => void;
};

export const YouTubePlayer = forwardRef<YouTubePlayerRef, YouTubePlayerProps>(
  ({ videoId, width = 640, height = 360, onTimeUpdate }, ref) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const playerRef = useRef<YouTubePlayer>();

    useEffect(() => {
      // Load YouTube IFrame API
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      if (firstScriptTag?.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }

      // Initialize player when API is ready
      window.onYouTubeIframeAPIReady = () => {
        if (iframeRef.current) {
          playerRef.current = new window.YT.Player(iframeRef.current, {
            events: {
              onStateChange: (event) => {
                // Start time updates when video is playing
                if (event.data === window.YT.PlayerState.PLAYING) {
                  startTimeUpdates();
                } else {
                  stopTimeUpdates();
                }
              },
            },
          });
        }
      };

      let timeUpdateInterval: NodeJS.Timeout;

      const startTimeUpdates = () => {
        timeUpdateInterval = setInterval(() => {
          if (playerRef.current?.getCurrentTime && onTimeUpdate) {
            onTimeUpdate(playerRef.current.getCurrentTime());
          }
        }, 200); // Update every 200ms
      };

      const stopTimeUpdates = () => {
        if (timeUpdateInterval) {
          clearInterval(timeUpdateInterval);
        }
      };

      return () => {
        stopTimeUpdates();
        window.onYouTubeIframeAPIReady = undefined;
      };
    }, [onTimeUpdate]);

    useImperativeHandle(ref, () => ({
      seekTo: (seconds: number) => {
        if (playerRef.current?.seekTo) {
          playerRef.current.seekTo(seconds);
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
