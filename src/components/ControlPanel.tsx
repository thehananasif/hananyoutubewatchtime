
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
    <div className="space-y-6 bg-card border rounded-lg p-6 animate-fade-in">
      <div className="space-y-2">
        <Label htmlFor="video-url">YouTube Video URL</Label>
        <Input
          id="video-url"
          type="text"
          placeholder="https://www.youtube.com/watch?v=..."
          value={videoUrl}
          onChange={handleInputChange}
          className={!videoUrl ? "" : isValidUrl ? "border-green-500" : "border-red-500"}
        />
        <p className="text-xs text-muted-foreground">
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
          className="flex-1 neo-button"
          variant={isRunning ? "secondary" : "default"}
        >
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
        </Button>
        <Button
          onClick={onReset}
          variant="outline"
          className="neo-button"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground">
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
