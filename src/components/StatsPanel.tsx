
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StatsPanelProps {
  proxiesCount: number;
  sessionsCompleted: number;
  startTime: number | null;
  isActive: boolean;
}

interface ProxyUsageItem {
  proxy: string;
  count: number;
}

const StatsPanel = ({
  proxiesCount,
  sessionsCompleted,
  startTime,
  isActive,
}: StatsPanelProps) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [proxyUsage, setProxyUsage] = useState<ProxyUsageItem[]>([]);

  // Update elapsed time
  useEffect(() => {
    if (!startTime || !isActive) return;

    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, isActive]);

  // Format time as HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      secs.toString().padStart(2, "0"),
    ].join(":");
  };

  // Mock proxy usage data (in a real app, this would be actual usage data)
  useEffect(() => {
    if (proxiesCount === 0) return;
    
    // Generate mock proxy usage data
    const mockProxyUsage: ProxyUsageItem[] = [];
    for (let i = 0; i < Math.min(5, proxiesCount); i++) {
      mockProxyUsage.push({
        proxy: `192.168.1.${100 + i}:8080`,
        count: Math.floor(Math.random() * 5) + 1,
      });
    }
    
    setProxyUsage(mockProxyUsage);
  }, [proxiesCount, sessionsCompleted]);

  if (!isActive && sessionsCompleted === 0) {
    return null;
  }

  return (
    <Tabs defaultValue="overview" className="w-full animate-scale-in">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="proxies">Proxy Usage</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{sessionsCompleted}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Proxies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{proxiesCount}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Elapsed Time</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatTime(elapsedTime)}</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="proxies" className="pt-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Most Used Proxies</CardTitle>
          </CardHeader>
          <CardContent>
            {proxyUsage.length > 0 ? (
              <div className="space-y-4">
                {proxyUsage.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm font-mono truncate max-w-[200px]">
                      {item.proxy}
                    </span>
                    <span className="text-sm font-medium">
                      {item.count} {item.count === 1 ? "session" : "sessions"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No proxy usage data available yet.
              </p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default StatsPanel;
