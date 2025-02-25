
import { useState, useEffect } from "react";
import ProxyFileInput from "@/components/ProxyFileInput";
import VideoPlayer from "@/components/VideoPlayer";
import ProxyStatus from "@/components/ProxyStatus";
import ControlPanel from "@/components/ControlPanel";
import StatsPanel from "@/components/StatsPanel";
import { useToast } from "@/components/ui/use-toast";
import { extractVideoId } from "@/lib/utils";

const Index = () => {
  const { toast } = useToast();
  const [proxies, setProxies] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [currentProxyIndex, setCurrentProxyIndex] = useState(0);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);

  // When video URL changes, extract and update the video ID
  useEffect(() => {
    const id = extractVideoId(videoUrl);
    setVideoId(id);
  }, [videoUrl]);

  // Handle loading proxies from file
  const handleProxiesLoaded = (loadedProxies: string[]) => {
    setProxies(loadedProxies);
    setCurrentProxyIndex(0);
    
    toast({
      title: "Proxies Loaded",
      description: `Successfully loaded ${loadedProxies.length} proxies.`,
    });
  };

  // Get the current proxy from the list
  const getCurrentProxy = (): string | null => {
    if (proxies.length === 0) return null;
    return proxies[currentProxyIndex];
  };

  // Handle video session completion
  const handleVideoEnded = () => {
    // Increment completed sessions
    setSessionsCompleted(prev => prev + 1);
    
    // Move to the next proxy
    setCurrentProxyIndex(prev => (prev + 1) % proxies.length);
    
    // If we're still running, the next session will start automatically
    if (!isRunning) {
      toast({
        title: "Session Ended",
        description: "Video session completed. System is paused.",
      });
    }
  };

  // Toggle the running state
  const handleToggleRunning = () => {
    const newState = !isRunning;
    setIsRunning(newState);
    
    if (newState) {
      // Starting the system
      setStartTime(prev => prev || Date.now());
      toast({
        title: "System Started",
        description: "Video playback started with proxy rotation.",
      });
    } else {
      // Pausing the system
      toast({
        title: "System Paused",
        description: "Current session will complete before pausing.",
      });
    }
  };

  // Reset the entire system
  const handleReset = () => {
    setIsRunning(false);
    setCurrentProxyIndex(0);
    setSessionsCompleted(0);
    setStartTime(null);
    
    toast({
      title: "System Reset",
      description: "All statistics have been reset.",
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Proxy Video Looper</h1>
          <p className="text-muted-foreground">
            Automate YouTube video views through rotating proxies
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-6 md:col-span-1">
            <section>
              <ProxyFileInput onProxiesLoaded={handleProxiesLoaded} />
            </section>
            
            <section>
              <ControlPanel
                videoUrl={videoUrl}
                onVideoUrlChange={setVideoUrl}
                isRunning={isRunning}
                onToggleRunning={handleToggleRunning}
                onReset={handleReset}
                proxiesCount={proxies.length}
              />
            </section>
            
            <section>
              <ProxyStatus
                currentProxy={getCurrentProxy()}
                proxyList={proxies}
                activeIndex={currentProxyIndex}
                isRunning={isRunning}
              />
            </section>
          </div>
          
          <div className="md:col-span-2 space-y-6">
            <section>
              {videoId && isRunning && (
                <VideoPlayer
                  videoId={videoId}
                  proxy={getCurrentProxy()}
                  onVideoEnded={handleVideoEnded}
                  isActive={isRunning}
                />
              )}
              
              {!videoId && (
                <div className="h-96 bg-secondary/30 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Enter a YouTube URL to start viewing
                  </p>
                </div>
              )}
              
              {videoId && !isRunning && (
                <div className="h-96 bg-secondary/30 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Press Start to begin playing the video
                  </p>
                </div>
              )}
            </section>
            
            <section>
              <StatsPanel
                proxiesCount={proxies.length}
                sessionsCompleted={sessionsCompleted}
                startTime={startTime}
                isActive={isRunning || sessionsCompleted > 0}
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
