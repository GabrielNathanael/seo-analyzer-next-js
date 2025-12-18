// src\types\analyzer.ts
export interface SeoData {
  title: { value: string | null; length: number };
  metaDescription: { value: string | null; length: number };
  robots: string | null;
  canonical: string | null;
  og: Record<string, string>;
  twitter: Record<string, string>;
}

export interface DiscoveryData {
  robots: {
    reachable: boolean;
    sitemapUrls: string[];
  };
  sitemap: {
    fetched: boolean;
    urlCount: number | null;
  };
}

export type CheckCategory = "onpage" | "social" | "discovery";
export type CheckStatus = "pass" | "warn" | "fail";
export type CheckSeverity = "high" | "medium" | "low";

export interface CheckResult {
  id: string;
  label: string;
  category: CheckCategory;
  status: CheckStatus;
  severity: CheckSeverity;
  evidence?: string;
}
