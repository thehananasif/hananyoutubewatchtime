
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProxyStatusProps {
  currentProxy: string | null;
  proxyList: string[];
  activeIndex: number;
  isRunning: boolean;
  duration?: number; // Duration in milliseconds, optional
}

const ProxyStatus = ({ 
  currentProxy, 
  proxyList, 
  activeIndex, 
  isRunning,
  duration = 3600000 // Default to 1 hour if not specified 
}: ProxyStatusProps) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (!isRunning) {
      setProgress(0);
      return;
    }
    
    setProgress(0);
    
    // Use configurable duration parameter
    const totalTime = duration; // in milliseconds
    const interval = setInterval(() => {
      setProgress(prev => {
        // Increment should complete in specified duration
        const increment = 100 / (totalTime / 1000); // 100% divided by (totalTime/updateInterval)
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 1000); // Update every 1 second
    
    return () => clearInterval(interval);
  }, [currentProxy, isRunning, duration]);
  
  if (!isRunning || proxyList.length === 0) {
    return null;
  }
  
  const truncateProxy = (proxy: string) => {
    if (proxy.length > 25) {
      return proxy.substring(0, 25) + "...";
    }
    return proxy;
  };
  
  // Format duration for display
  const getDurationText = () => {
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor(duration / (1000 * 60 * 60));
    
    return hours > 0 
      ? `${hours}h ${minutes}m` 
      : minutes > 0 
        ? `${minutes}m ${seconds}s` 
        : `${seconds}s`;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-light">Active Proxy</h3>
        <Badge variant="outline" className="bg-white/5 text-xs border-white/20">
          {activeIndex + 1} of {proxyList.length}
        </Badge>
      </div>
      
      <div className="p-3 bg-white/5 rounded-md backdrop-blur-sm border border-white/10">
        <p className="text-sm font-mono text-gray-300">
          {currentProxy ? truncateProxy(currentProxy) : "Direct connection"}
        </p>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-400">
          <span>Session progress ({getDurationText()})</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress 
          value={progress} 
          className="h-0.5 bg-white/5" 
        />
      </div>
    </div>
  );
};

export default ProxyStatus;
