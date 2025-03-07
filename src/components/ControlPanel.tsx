
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Label } from "@/components/ui/label";

interface ControlPanelProps {
  videoUrl: string;
  onVideoUrlChange: (url: string) => void;
  isRunning: boolean;
  onToggleRunning: () => void;
  onReset: () => void;
  proxiesCount: number;
}

const ControlPanel = ({
  videoUrl,
  onVideoUrlChange,
  isRunning,
  onToggleRunning,
  onReset,
  proxiesCount,
}: ControlPanelProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onVideoUrlChange(e.target.value);
  };

  const extractVideoId = (url: string): string | null => {
    // YouTube URL patterns
    const patterns = [
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]+)/i,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  };

  const isValidUrl = videoUrl && extractVideoId(videoUrl) !== null;
  const isButtonDisabled = !isValidUrl || proxiesCount === 0;

  return (
    <div className="space-y-6 bg-black/30 backdrop-blur-md border border-white/10 rounded-lg p-6 animate-fade-in">
      <div className="space-y-2">
        <Label htmlFor="video-url" className="text-white/90">YouTube Video URL</Label>
        <Input
          id="video-url"
          type="text"
          placeholder="https://www.youtube.com/watch?v=..."
          value={videoUrl}
          onChange={handleInputChange}
          className={`bg-white/5 border-white/20 text-white focus:border-white/50 transition-all ${!videoUrl ? "" : isValidUrl ? "border-green-500/50" : "border-red-500/50"}`}
        />
        <p className="text-xs text-gray-400">
          {!videoUrl
            ? "Paste a YouTube video URL"
            : isValidUrl
            ? `Video ID: ${extractVideoId(videoUrl)}`
            : "Invalid YouTube URL format"}
        </p>
      </div>

      <div className="flex space-x-2">
        <Button
          onClick={onToggleRunning}
          disabled={isButtonDisabled}
          className={`flex-1 shadow-[0_4px_14px_0_rgba(0,0,0,0.5)] transition-all duration-300 relative overflow-hidden`}
        >
          <span className="relative z-10 flex items-center justify-center">
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start
              </>
            )}
          </span>
        </Button>
        <Button
          onClick={onReset}
          variant="outline"
          className="bg-black text-white border-white/20 hover:bg-black/80 transition-all duration-300 relative overflow-hidden shadow-[0_4px_14px_0_rgba(0,0,0,0.5)]"
        >
          <span className="relative z-10">
            <RotateCcw className="w-4 h-4" />
          </span>
        </Button>
      </div>

      <div className="text-center text-sm text-gray-400">
        {proxiesCount === 0 ? (
          <p>Upload a proxy list to get started</p>
        ) : (
          <p>{proxiesCount} proxies loaded and ready</p>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;
