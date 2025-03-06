
import { useState, useEffect } from "react";
import ProxyFileInput from "@/components/ProxyFileInput";
import VideoPlayer from "@/components/VideoPlayer";
import ProxyStatus from "@/components/ProxyStatus";
import ControlPanel from "@/components/ControlPanel";
import StatsPanel from "@/components/StatsPanel";
import { useToast } from "@/hooks/use-toast";
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

  useEffect(() => {
    const id = extractVideoId(videoUrl);
    setVideoId(id);
  }, [videoUrl]);

  const handleProxiesLoaded = (loadedProxies: string[]) => {
    setProxies(loadedProxies);
    setCurrentProxyIndex(0);
    
    toast({
      title: "Proxies Loaded",
      description: `Successfully loaded ${loadedProxies.length} proxies.`,
    });
  };

  const getCurrentProxy = (): string | null => {
    if (proxies.length === 0) return null;
    return proxies[currentProxyIndex];
  };

  const handleVideoEnded = () => {
    setSessionsCompleted(prev => prev + 1);
    setCurrentProxyIndex(prev => (prev + 1) % proxies.length);
    
    if (!isRunning) {
      toast({
        title: "Session Ended",
        description: "Video session completed. System is paused.",
      });
    }
  };

  const handleToggleRunning = () => {
    const newState = !isRunning;
    setIsRunning(newState);
    
    if (newState) {
      setStartTime(prev => prev || Date.now());
      toast({
        title: "System Started",
        description: "Video playback started with proxy rotation.",
      });
    } else {
      toast({
        title: "System Paused",
        description: "Current session will complete before pausing.",
      });
    }
  };

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
    <div className="min-h-screen bg-black text-white p-6 font-sans antialiased">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-light tracking-tight">
            Hanan YouTube Watchtime
          </h1>
          <p className="text-gray-400 text-sm font-light">
            Automate YouTube video views through rotating proxies
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-6 md:col-span-1">
            <section className="backdrop-blur-lg bg-white/5 rounded-lg border border-white/10 p-6 transition-all duration-300">
              <ProxyFileInput onProxiesLoaded={handleProxiesLoaded} />
            </section>
            
            <section className="backdrop-blur-lg bg-white/5 rounded-lg border border-white/10 p-6 transition-all duration-300">
              <ControlPanel
                videoUrl={videoUrl}
                onVideoUrlChange={setVideoUrl}
                isRunning={isRunning}
                onToggleRunning={handleToggleRunning}
                onReset={handleReset}
                proxiesCount={proxies.length}
              />
            </section>
            
            <section className="backdrop-blur-lg bg-white/5 rounded-lg border border-white/10 p-6 transition-all duration-300">
              <ProxyStatus
                currentProxy={getCurrentProxy()}
                proxyList={proxies}
                activeIndex={currentProxyIndex}
                isRunning={isRunning}
              />
            </section>
          </div>
          
          <div className="md:col-span-2 space-y-6">
            <section className="backdrop-blur-lg bg-white/5 rounded-lg border border-white/10 transition-all duration-300 overflow-hidden">
              {videoId && isRunning && (
                <VideoPlayer
                  videoId={videoId}
                  proxy={getCurrentProxy()}
                  onVideoEnded={handleVideoEnded}
                  isActive={isRunning}
                />
              )}
              
              {!videoId && (
                <div className="h-96 flex items-center justify-center text-gray-400">
                  <p className="text-sm font-light">
                    Enter a YouTube URL to start viewing
                  </p>
                </div>
              )}
              
              {videoId && !isRunning && (
                <div className="h-96 flex items-center justify-center text-gray-400">
                  <p className="text-sm font-light">
                    Press Start to begin playing the video
                  </p>
                </div>
              )}
            </section>
            
            <section className="backdrop-blur-lg bg-white/5 rounded-lg border border-white/10 p-6 transition-all duration-300">
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
