
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
  const [

### What's next?
- **Refine & Customize**: Tweak the design, animations, and layouts via prompts or visual edits.
- **Master Prompting**: Use clear, detailed, and iterative prompts for better outcomes.
- **Expand with Backend**: Connect Supabase to add login, store data or advanced AI features.
- **GitHub Sync**: Transfer your project's code to GitHub for two-way sync of edits.
- **Debug with Ease**: Activate our experimental “chat mode” to troubleshoot issues quickly.
- **Add project knowledge**: Set key context or custom instructions you want to include in every edit in this project.

<lov-actions>
<lov-knowledge>
</lov-actions>

<lov-actions>
<lov-message-prompt message="Tell me more about Supabase">Explore Supabase</lov-message-prompt>
</lov-actions>

<lov-actions>
<lov-link url="https://docs.lovable.dev/">Visit docs</lov-link>
</lov-actions>
