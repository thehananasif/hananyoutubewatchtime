
import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ProxyFileInputProps {
  onProxiesLoaded: (proxies: string[]) => void;
}

const ProxyFileInput = ({ onProxiesLoaded }: ProxyFileInputProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === "string") {
        const content = e.target.result;
        const lines = content
          .split(/\r?\n/)
          .map(line => line.trim())
          .filter(line => line.length > 0);
        
        if (lines.length === 0) {
          toast({
            title: "Error",
            description: "The file is empty. Please upload a file with proxy addresses.",
            variant: "destructive"
          });
          return;
        }
        
        onProxiesLoaded(lines);
        toast({
          title: "Success",
          description: `${lines.length} proxies loaded successfully.`
        });
      }
    };
    
    reader.onerror = () => {
      toast({
        title: "Error",
        description: "Failed to read the file. Please try again.",
        variant: "destructive"
      });
    };
    
    reader.readAsText(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`relative w-full p-8 border-2 border-dashed rounded-lg transition-all duration-200 ease-in-out cursor-pointer ${
        isDragging 
          ? "border-white/70 bg-white/5" 
          : "border-white/30 bg-white/5"
      } ${fileName ? "animate-scale-in" : ""} hover:border-white/50 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleButtonClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".txt,.csv,.list"
        className="hidden"
      />
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/20">
          <UploadCloud className="w-8 h-8 text-white" />
        </div>
        <div className="text-center">
          <p className="text-lg font-medium">
            {fileName ? fileName : "Drag & drop your proxy list"}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {fileName
              ? "File loaded! Click to change."
              : "or click to browse (TXT, CSV, LIST)"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProxyFileInput;
