import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ProxyStatusProps {
  currentProxy: string | null;
  proxyList: string[];
  activeIndex: number;
  isRunning: boolean;
}

const ProxyStatus = ({ 
  currentProxy, 
  proxyList, 
  activeIndex, 
  isRunning 
}: ProxyStatusProps) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (!isRunning) {
      setProgress(0);
      return;
    }
    
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 0.5;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [currentProxy, isRunning]);
  
  if (!isRunning || proxyList.length === 0) {
    return null;
  }
  
  const truncateProxy = (proxy: string) => {
    if (proxy.length > 25) {
      return proxy.substring(0, 25) + "...";
    }
    return proxy;
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
          <span>Session progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress 
          value={progress} 
          className="h-0.5 bg-white/5"
          indicatorClassName="bg-white transition-all duration-300" 
        />
      </div>
    </div>
  );
};

export default ProxyStatus;
