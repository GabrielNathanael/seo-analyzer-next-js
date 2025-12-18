// src\app\page.tsx
// src/app/page.tsx
"use client";

import { useState } from "react";
import { toast, Toaster } from "sonner";
import { XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { UrlInput } from "@/components/UrlInput";
import { ScoreCard } from "@/components/ScoreCard";
import { ChecksTab } from "@/components/ChecksTab";
import { RecommendationList } from "@/components/RecommendationList";
import type { CheckResult, SeoData, DiscoveryData } from "@/types/analyzer";
import type { Recommendation } from "@/types/recommendation";

interface AnalyzeResponse {
  input: {
    raw: string;
    normalized: string;
    timestamp: string;
  };
  fetch: {
    status: number;
    finalUrl: string;
    contentType: string;
    size: number;
    timingMs: number;
  };
  seo: SeoData;
  discovery: DiscoveryData;
  checks: CheckResult[];
  score: {
    score: number;
    max: number;
    total: number;
  };
  recommendations: Recommendation[];
  status: string;
}

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    setLoading(true);
    setResults(null);
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze");
      }

      setResults(data);
      toast.success("Analysis complete!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Analysis failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="border-b">
          <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16 max-w-5xl">
            <div className="text-center space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                SEO Analyzer
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                Analyze your website&apos;s SEO performance in seconds
              </p>
            </div>

            <UrlInput
              value={url}
              onChange={setUrl}
              onAnalyze={handleAnalyze}
              loading={loading}
            />
          </div>
        </div>

        {/* Results Section */}
        {results && (
          <div className="container mx-auto px-4 py-8 sm:py-12 max-w-7xl">
            <div className="space-y-6 sm:space-y-8">
              {/* Score Card */}
              <ScoreCard score={results.score.score} />

              {/* Checks Tabs */}
              <ChecksTab checks={results.checks} />

              {/* Recommendations */}
              {results.recommendations.length > 0 && (
                <RecommendationList recommendations={results.recommendations} />
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!results && !loading && !error && (
          <div className="container mx-auto px-4 py-12 sm:py-16 max-w-4xl">
            <div className="text-center text-sm sm:text-base text-muted-foreground">
              <p>Enter a URL above to start analyzing</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="container mx-auto px-4 py-12 sm:py-16 max-w-4xl">
            <Card className="p-6 sm:p-8 border-destructive/50 bg-destructive/5">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="p-2 rounded-full bg-destructive/10 shrink-0">
                  <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-destructive" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-destructive">
                    Analysis Failed
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                    {error}
                  </p>
                  <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
                    <p className="font-medium">Common issues:</p>
                    <ul className="list-disc list-inside space-y-0.5 ml-2">
                      <li>URL might not exist or is temporarily unavailable</li>
                      <li>Website is blocking automated requests</li>
                      <li>Network connection issue</li>
                      <li>Invalid URL format</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>
    </>
  );
}
