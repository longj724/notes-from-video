// External Dependencies
import {
  useRef,
  useImperativeHandle,
  forwardRef,
  useEffect,
  useState,
} from "react";

declare global {
  interface Window {
    YT: {
      Player: new (
        element: HTMLIFrameElement | string,
        config: {
          videoId: string;
          events: {
            onReady?: () => void;
            onStateChange: (event: { data: number }) => void;
          };
        },
      ) => {
        getCurrentTime: () => number;
        seekTo: (seconds: number) => void;
        loadVideoById: (videoId: string) => void;
        destroy: () => void;
      };
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
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
  loadVideoById: (videoId: string) => void;
  destroy: () => void;
};

export const YouTubePlayer = forwardRef<YouTubePlayerRef, YouTubePlayerProps>(
  ({ videoId, width = 640, height = 360, onTimeUpdate }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<YouTubePlayer>();
    const [isAPIReady, setIsAPIReady] = useState(false);
    const timeUpdateIntervalRef = useRef<NodeJS.Timeout>();
    const playerId = `youtube-player-${videoId}`;

    const startTimeUpdates = () => {
      stopTimeUpdates();
      timeUpdateIntervalRef.current = setInterval(() => {
        if (playerRef.current?.getCurrentTime && onTimeUpdate) {
          const currentTime = playerRef.current.getCurrentTime();
          onTimeUpdate(currentTime);
        }
      }, 100);
    };

    const stopTimeUpdates = () => {
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current);
      }
    };

    useEffect(() => {
      // Load YouTube IFrame API if not already loaded
      if (!window.YT) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        if (firstScriptTag?.parentNode) {
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
      }

      // Initialize player when API is ready
      const initializePlayer = () => {
        if (!containerRef.current) return;

        try {
          if (playerRef.current) {
            playerRef.current.destroy();
          }

          playerRef.current = new window.YT.Player(playerId, {
            videoId,
            events: {
              onReady: () => {
                setIsAPIReady(true);
                startTimeUpdates();
              },
              onStateChange: (event) => {
                if (event.data === window.YT.PlayerState.PLAYING) {
                  startTimeUpdates();
                } else {
                  stopTimeUpdates();
                }
              },
            },
          });
        } catch (error) {
          console.error("Failed to initialize YouTube player:", error);
        }
      };

      if (window.YT?.Player) {
        initializePlayer();
      } else {
        window.onYouTubeIframeAPIReady = () => {
          initializePlayer();
        };
      }

      return () => {
        stopTimeUpdates();
        if (playerRef.current) {
          playerRef.current.destroy();
        }
        window.onYouTubeIframeAPIReady = undefined;
        setIsAPIReady(false);
      };
    }, [videoId]); // Only reinitialize when videoId changes - ignore the warning here

    useImperativeHandle(ref, () => ({
      seekTo: (seconds: number) => {
        if (playerRef.current?.seekTo) {
          playerRef.current.seekTo(seconds);
        }
      },
    }));

    return (
      <div className="relative w-full pt-[56.25%]">
        <div
          id={playerId}
          ref={containerRef}
          className="absolute inset-0 h-full w-full rounded-lg"
        />
      </div>
    );
  },
);

YouTubePlayer.displayName = "YouTubePlayer";
