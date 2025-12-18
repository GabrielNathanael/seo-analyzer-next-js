// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
import {
  XCircle,
  Keyboard,
  Search,
  BarChart3,
  CheckCircle,
  Globe,
  Share2,
  FileSearch,
  Gauge,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UrlInput } from "@/components/UrlInput";
import { ScoreCard } from "@/components/ScoreCard";
import { ChecksTab } from "@/components/ChecksTab";
import { RecommendationList } from "@/components/RecommendationList";
import { motion } from "framer-motion";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
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

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("seo-analyzer-tutorial-seen");

    if (!hasSeenTutorial && !loading && !results && !error) {
      const timer = setTimeout(() => {
        startTutorial();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [loading, results, error]);

  const startTutorial = () => {
    const driverObj = driver({
      showProgress: true,
      showButtons: ["next", "previous", "close"],
      steps: [
        {
          element: "#url-input-container",
          popover: {
            title: "Enter Your Website URL",
            description:
              "Start by typing your website address here. You can enter with or without https://",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: "#analyze-button",
          popover: {
            title: "Click Analyze",
            description:
              "Hit this button to start the SEO analysis. It only takes a few seconds!",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: "#demo-button",
          popover: {
            title: "Try a Demo",
            description:
              "Want to see it in action first? Click here to analyze my personal website as an example.",
            side: "top",
            align: "center",
          },
        },
        {
          element: "#features-section",
          popover: {
            title: "What We Check",
            description:
              "We analyze On-Page SEO, Social Media tags, Discovery settings, and give you an overall performance score with actionable recommendations.",
            side: "top",
            align: "center",
          },
        },
      ],
      onDestroyed: () => {
        localStorage.setItem("seo-analyzer-tutorial-seen", "true");
      },
    });

    driverObj.drive();
  };

  const handleAnalyze = async (urlToAnalyze?: string) => {
    const targetUrl = urlToAnalyze || url;

    if (!targetUrl.trim()) {
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
        body: JSON.stringify({ url: targetUrl.trim() }),
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

  const handleDemoClick = () => {
    const demoUrl = "gabrielnathanael.site";
    setUrl(demoUrl);
    handleAnalyze(demoUrl);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  return (
    <>
      <Toaster position="top-center" />
      <main className="min-h-screen bg-background flex flex-col">
        {/* Hero Section */}
        <div className="border-b">
          <div className="container mx-auto px-4 pt-12 pb-8 sm:pt-16 sm:pb-12 lg:pt-20 lg:pb-16 max-w-5xl">
            <motion.div
              className="text-center space-y-3 sm:space-y-4 mb-6 sm:mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" as const }}
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                  SEO Analyzer
                </h1>
              </div>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                Analyze your website&apos;s SEO performance in seconds
              </p>
            </motion.div>

            <motion.div
              id="url-input-container"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.3,
                ease: "easeOut" as const,
              }}
            >
              <UrlInput
                value={url}
                onChange={setUrl}
                onAnalyze={handleAnalyze}
                loading={loading}
              />
            </motion.div>
          </div>
        </div>

        {/* Results Section */}
        {results && (
          <div className="container mx-auto px-4 py-8 sm:py-12 max-w-7xl flex-1">
            <div className="space-y-6 sm:space-y-8">
              <ScoreCard score={results.score.score} />
              <ChecksTab checks={results.checks} />
              {results.recommendations.length > 0 && (
                <RecommendationList recommendations={results.recommendations} />
              )}
            </div>
          </div>
        )}

        {/* Empty State with Tutorial */}
        {!results && !loading && !error && (
          <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16 max-w-6xl flex-1">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-12 sm:space-y-16"
            >
              {/* How It Works */}
              <motion.div
                variants={itemVariants}
                className="text-center space-y-6 sm:space-y-8"
              >
                <h2 className="text-2xl sm:text-3xl font-bold">How It Works</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
                  {/* Step 1 */}
                  <motion.div
                    variants={itemVariants}
                    className="flex flex-col items-center text-center space-y-3"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <Keyboard className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg sm:text-xl mb-1">
                        Enter URL
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Type your website address in the search bar
                      </p>
                    </div>
                  </motion.div>

                  {/* Step 2 */}
                  <motion.div
                    variants={itemVariants}
                    className="flex flex-col items-center text-center space-y-3"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <Search className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg sm:text-xl mb-1">
                        Click Analyze
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Our tool scans your website instantly
                      </p>
                    </div>
                  </motion.div>

                  {/* Step 3 */}
                  <motion.div
                    variants={itemVariants}
                    className="flex flex-col items-center text-center space-y-3"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg sm:text-xl mb-1">
                        Get Insights
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Receive detailed SEO recommendations
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Quick Demo */}
              <motion.div
                variants={itemVariants}
                className="text-center"
                id="demo-button"
              >
                <p className="text-sm text-muted-foreground mb-3">
                  Want to see it in action?
                </p>
                <Button onClick={handleDemoClick} variant="outline" size="lg">
                  <Globe className="w-4 h-4 mr-2" />
                  Try Demo: gabrielnathanael.site
                </Button>
              </motion.div>

              {/* What We Check */}
              <motion.div
                variants={itemVariants}
                className="space-y-6"
                id="features-section"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-center">
                  What We Check
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
                  <Card className="p-4 sm:p-6 text-center space-y-2">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto">
                      <FileSearch className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold">On-Page SEO</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Title tags, meta descriptions, canonical URLs, and
                      indexability
                    </p>
                  </Card>

                  <Card className="p-4 sm:p-6 text-center space-y-2">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto">
                      <Share2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-semibold">Social Media</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Open Graph and Twitter Card meta tags
                    </p>
                  </Card>

                  <Card className="p-4 sm:p-6 text-center space-y-2">
                    <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
                      <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-semibold">Discovery</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Robots.txt, sitemap, and crawlability checks
                    </p>
                  </Card>

                  <Card className="p-4 sm:p-6 text-center space-y-2">
                    <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mx-auto">
                      <Gauge className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="font-semibold">Performance Score</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Overall SEO health score and actionable recommendations
                    </p>
                  </Card>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="container mx-auto px-4 py-12 sm:py-16 max-w-4xl flex-1">
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

        {/* Footer */}
        <footer className="border-t mt-auto">
          <div className="container mx-auto px-4 py-6 sm:py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
              <div className="text-center sm:text-left">
                <p className="font-medium text-foreground mb-1">
                  Built by Gabriel Nathanael
                </p>
                <p className="text-xs">
                  © 2025 SEO Analyzer. All rights reserved.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/GabrielNathanael"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="https://www.instagram.com/gabrielnathanaelp/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Instagram
                </a>
                <a
                  href="https://gabrielnathanael.site/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Website
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
