
import { useState, useEffect, useRef } from "react";
import { toast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";

interface VideoPlayerProps {
  videoId: string;
  proxy: string | null;
  onVideoEnded: () => void;
  isActive: boolean;
  duration?: number; // Duration in milliseconds, optional with default
}

const VideoPlayer = ({ 
  videoId, 
  proxy, 
  onVideoEnded, 
  isActive,
  duration = 3600000 // Default to 1 hour if not specified
}: VideoPlayerProps) => {
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
    
    // User-configurable duration for when the proxy should change
    console.log(`Setting video playback duration to: ${duration/1000} seconds`);
    
    videoTimeoutRef.current = setTimeout(() => {
      console.log("Video playback complete");
      setVideoCompleted(true);
      onVideoEnded();
    }, duration);
    
    return () => {
      if (videoTimeoutRef.current) {
        clearTimeout(videoTimeoutRef.current);
        videoTimeoutRef.current = null;
      }
    };
  }, [isActive, error, loading, duration]);

  if (!isActive) {
    return null;
  }

  // Calculate human-readable duration for display
  const getDurationText = () => {
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor(duration / (1000 * 60 * 60));
    
    return hours > 0 
      ? `${hours}h ${minutes}m ${seconds}s` 
      : minutes > 0 
        ? `${minutes}m ${seconds}s` 
        : `${seconds}s`;
  };

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
      
      {!loading && !error && (
        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm z-10">
          Proxy rotation after: {getDurationText()}
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
