// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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
  FileText,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UrlInput } from "@/components/UrlInput";
import { ScoreCard } from "@/components/ScoreCard";
import { ChecksTab } from "@/components/ChecksTab";
import { ContentStructureTab } from "@/components/ContentStructureTab";
import { RecommendationList } from "@/components/RecommendationList";
import { motion } from "framer-motion";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import type {
  CheckResult,
  SeoData,
  DiscoveryData,
  ContentData,
} from "@/types/analyzer";
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
  content: ContentData;
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
    // Reset all states first to ensure tutorial elements are visible and in correct position
    setResults(null);
    setError(null);
    setLoading(false);
    setUrl("");

    // Small delay to allow React to update the DOM (removing results, showing empty state)
    setTimeout(() => {
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
                "We analyze On-Page SEO, Content Structure, Social Media tags, Discovery settings, and give you an overall performance score with actionable recommendations.",
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
    }, 100);
  };

  const handleAnalyze = async (
    urlToAnalyze?: string | unknown,
    currentAttempt = 1
  ) => {
    const targetUrl = typeof urlToAnalyze === "string" ? urlToAnalyze : url;

    if (!targetUrl.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    // Only set loading on first attempt
    if (currentAttempt === 1) {
      setLoading(true);
      setResults(null);
      setError(null);
    }

    try {
      // Show loading toast with attempt count
      const loadingToast = toast.loading(
        currentAttempt === 1
          ? "Analyzing website..."
          : `Retrying... (attempt ${currentAttempt}/2)`
      );

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl.trim() }),
      });

      if (res.status === 429) {
        toast.dismiss(loadingToast);
        setLoading(false);
        const errorMsg =
          "Rate limit reached. Please wait a minute before trying again.";
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      const data = await res.json();
      toast.dismiss(loadingToast);

      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze");
      }

      // Success!
      setResults(data);
      setLoading(false);
      toast.success("Analysis complete!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Analysis failed";

      // Auto retry only once
      if (currentAttempt === 1) {
        toast.info("First attempt failed, retrying...");
        await new Promise((resolve) => setTimeout(resolve, 500));
        return handleAnalyze(targetUrl, 2); // Pass 2 as next attempt
      }

      // If retry also failed
      setError(message);
      setLoading(false);
      toast.error(`Analysis failed after ${currentAttempt} attempts`);
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
                <Image
                  src="/icon.png"
                  alt="SEO Analyzer Icon"
                  width={48}
                  height={48}
                  className="rounded-xl shadow-sm sm:w-14 sm:h-14 lg:w-16 lg:h-16"
                  priority
                />
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
              <ContentStructureTab content={results.content} />
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
                  <Card className="p-4 sm:p-6 text-center space-y-2">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto">
                      <FileSearch className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold">On-Page SEO</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Title tags, meta descriptions, canonical URLs, robots
                      meta, and indexability
                    </p>
                  </Card>

                  <Card className="p-4 sm:p-6 text-center space-y-2">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto">
                      <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-semibold">Content Structure</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Heading hierarchy, image alt texts, internal and external
                      links analysis
                    </p>
                  </Card>

                  <Card className="p-4 sm:p-6 text-center space-y-2">
                    <div className="w-12 h-12 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mx-auto">
                      <Share2 className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                    </div>
                    <h3 className="font-semibold">Social Media</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Open Graph and Twitter Card meta tags for social sharing
                    </p>
                  </Card>

                  <Card className="p-4 sm:p-6 text-center space-y-2">
                    <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
                      <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-semibold">Discovery</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Robots.txt, XML sitemap, and search engine crawlability
                    </p>
                  </Card>

                  <Card className="p-4 sm:p-6 text-center space-y-2">
                    <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mx-auto">
                      <Gauge className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="font-semibold">Performance Score</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Overall SEO health score with prioritized recommendations
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
                      <li>Website is blocking our service or IP address</li>
                      <li>Analysis rate limit has been reached</li>
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
        <footer className="border-t mt-auto bg-muted/30">
          <div className="container mx-auto px-4 py-12 sm:py-16 max-w-7xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
              {/* About Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Image
                    src="/icon.png"
                    alt="SEO Analyzer"
                    width={32}
                    height={32}
                    className="rounded-lg"
                  />
                  <h3 className="font-bold text-lg">SEO Analyzer</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Fast, free, and comprehensive SEO analysis tool to help
                  optimize your website&apos;s search engine performance.
                </p>
              </div>

              {/* Product Section */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                  Product
                </h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <button
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="text-foreground/80 hover:text-foreground transition-colors"
                    >
                      Analyze Website
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={startTutorial}
                      className="text-foreground/80 hover:text-foreground transition-colors"
                    >
                      Take Tutorial
                    </button>
                  </li>
                </ul>
              </div>

              {/* Resources Section */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                  Resources
                </h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <a
                      href="https://developers.google.com/search/docs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground/80 hover:text-foreground transition-colors inline-flex items-center gap-1"
                    >
                      Google SEO Guide
                      <Globe className="w-3 h-3" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://moz.com/beginners-guide-to-seo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground/80 hover:text-foreground transition-colors inline-flex items-center gap-1"
                    >
                      SEO Basics
                      <Globe className="w-3 h-3" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://schema.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground/80 hover:text-foreground transition-colors inline-flex items-center gap-1"
                    >
                      Schema Markup
                      <Globe className="w-3 h-3" />
                    </a>
                  </li>
                </ul>
              </div>

              {/* Connect Section */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                  Connect
                </h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <a
                      href="https://github.com/GabrielNathanael"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground/80 hover:text-foreground transition-colors inline-flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.instagram.com/gabrielnathanaelp/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground/80 hover:text-foreground transition-colors inline-flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://gabrielnathanael.site/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground/80 hover:text-foreground transition-colors inline-flex items-center gap-2"
                    >
                      <Globe className="w-4 h-4" />
                      Portfolio
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-12 pt-8 border-t">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                <p>
                  © {new Date().getFullYear()} SEO Analyzer. Built by{" "}
                  <a
                    href="https://gabrielnathanael.site/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground hover:underline"
                  >
                    Gabriel Nathanael
                  </a>
                </p>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
