// src/components/UrlInput.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";

interface UrlInputProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  loading: boolean;
}

export function UrlInput({
  value,
  onChange,
  onAnalyze,
  loading,
}: UrlInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      onAnalyze();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto">
      <Input
        type="text"
        placeholder="Enter URL (e.g., example.com)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
        className="h-12 text-base flex-1"
      />
      <Button
        id="analyze-button"
        onClick={() => onAnalyze()}
        disabled={loading}
        size="lg"
        className="px-8 w-full sm:w-auto h-12"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Analyzing
          </>
        ) : (
          <>
            <Search className="w-4 h-4 mr-2" />
            Analyze
          </>
        )}
      </Button>
    </div>
  );
}
