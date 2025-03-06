
import { useState, useEffect, useRef } from "react";
import { toast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";

interface VideoPlayerProps {
  videoId: string;
  proxy: string | null;
  onVideoEnded: () => void;
  isActive: boolean;
}

const VideoPlayer = ({ videoId, proxy, onVideoEnded, isActive }: VideoPlayerProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // This is a placeholder for actual proxy handling
  // In a real implementation, you would need a backend service to handle the proxy
  const getProxyEmbedUrl = (videoId: string, proxy: string | null) => {
    // In a real app, this would be a backend endpoint that handles the proxy
    // For our demo, we're just using the standard YouTube embed URL
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`;
  };

  useEffect(() => {
    if (!isActive) return;
    
    setLoading(true);
    setError(null);
    setVideoCompleted(false);

    const embedUrl = getProxyEmbedUrl(videoId, proxy);
    if (iframeRef.current) {
      iframeRef.current.src = embedUrl;
    }

    // Simulate proxy connection
    const timeout = setTimeout(() => {
      setLoading(false);
      
      // For demonstration purposes:
      if (proxy && Math.random() > 0.8) {
        // Simulate 20% proxy failure rate
        setError(`Failed to connect using proxy: ${proxy}`);
        setTimeout(() => {
          onVideoEnded();
        }, 3000);
      } else {
        // Log proxy usage (in a real app, this would be more sophisticated)
        console.log(`Using proxy: ${proxy || "None (direct connection)"}`);
      }
    }, 2000);

    return () => {
      clearTimeout(timeout);
      if (videoTimeoutRef.current) {
        clearTimeout(videoTimeoutRef.current);
        videoTimeoutRef.current = null;
      }
    };
  }, [videoId, proxy, isActive]);

  // Simulate video completion
  useEffect(() => {
    if (!isActive || error || loading) return;
    
    // For demonstration, simulate the video ending after a fixed time (30 seconds)
    // This ensures the video fully completes before changing proxy
    const videoLength = 30000; // 30 seconds for each video
    
    videoTimeoutRef.current = setTimeout(() => {
      console.log("Video playback complete");
      setVideoCompleted(true);
      onVideoEnded();
    }, videoLength);
    
    return () => {
      if (videoTimeoutRef.current) {
        clearTimeout(videoTimeoutRef.current);
        videoTimeoutRef.current = null;
      }
    };
  }, [isActive, error, loading]);

  if (!isActive) {
    return null;
  }

  return (
    <div className="relative w-full h-96 overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center">
            <Loader className="w-8 h-8 text-white animate-spin" />
            <p className="mt-4 text-sm font-light text-gray-300">
              {proxy ? `Connecting via proxy: ${proxy}` : "Loading video..."}
            </p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-500/10 backdrop-blur-sm z-10">
          <div className="bg-black/80 p-6 rounded-lg backdrop-blur-sm border border-white/10">
            <p className="text-red-400 font-medium">{error}</p>
            <p className="mt-2 text-sm text-gray-400">
              Switching to the next proxy...
            </p>
          </div>
        </div>
      )}
      
      <iframe
        ref={iframeRef}
        className="w-full h-full bg-black"
        title="YouTube Video Player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default VideoPlayer;
