// src\lib\analyzer\checks.ts
// src/lib/analyzer/checks.ts
import type { CheckResult, SeoData, DiscoveryData } from "@/types/analyzer";

export function runChecks(input: {
  seo: SeoData;
  discovery: DiscoveryData;
}): CheckResult[] {
  const checks: CheckResult[] = [];

  const { seo, discovery } = input;

  /* ======================
   * ON-PAGE SEO
   * ====================== */

  // Title exists
  checks.push({
    id: "title-exists",
    label: "Title tag exists",
    category: "onpage",
    status: seo.title.value ? "pass" : "fail",
    severity: "high",
    evidence: seo.title.value ?? "No <title> tag found",
  });

  // Title length
  checks.push({
    id: "title-length",
    label: "Title length is optimal",
    category: "onpage",
    status: seo.title.length >= 10 && seo.title.length <= 60 ? "pass" : "warn",
    severity: "medium",
    evidence: `${seo.title.length} characters`,
  });

  // Meta description exists
  checks.push({
    id: "meta-desc-exists",
    label: "Meta description exists",
    category: "onpage",
    status: seo.metaDescription.value ? "pass" : "warn",
    severity: "medium",
    evidence: seo.metaDescription.value ?? "No meta description found",
  });

  // Meta description length
  if (seo.metaDescription.value) {
    const len = seo.metaDescription.length;
    checks.push({
      id: "meta-desc-length",
      label: "Meta description length is optimal",
      category: "onpage",
      status: len >= 70 && len <= 160 ? "pass" : "warn",
      severity: "low",
      evidence: `${len} characters`,
    });
  }

  // Canonical exists
  checks.push({
    id: "canonical-exists",
    label: "Canonical URL exists",
    category: "onpage",
    status: seo.canonical ? "pass" : "warn",
    severity: "high",
    evidence: seo.canonical ?? "No canonical link found",
  });

  // Canonical host match
  if (seo.canonical) {
    let status: "pass" | "warn" = "pass";
    let evidence = seo.canonical;

    try {
      const canonicalUrl = new URL(seo.canonical);

      if (discovery.robots.sitemapUrls.length > 0) {
        const sitemapHost = new URL(discovery.robots.sitemapUrls[0]).host;

        if (canonicalUrl.host !== sitemapHost) {
          status = "warn";
          evidence = `Canonical points to different host: ${canonicalUrl.host}`;
        }
      }
    } catch {
      status = "warn";
      evidence = "Canonical URL is not a valid absolute URL";
    }

    checks.push({
      id: "canonical-host-match",
      label: "Canonical points to same host",
      category: "onpage",
      status,
      severity: "high",
      evidence,
    });
  }

  // Meta robots noindex
  if (seo.robots) {
    const robotsValue = seo.robots.toLowerCase();

    checks.push({
      id: "meta-robots-noindex",
      label: "Page is indexable",
      category: "onpage",
      status: robotsValue.includes("noindex") ? "fail" : "pass",
      severity: "high",
      evidence: seo.robots,
    });
  } else {
    checks.push({
      id: "meta-robots-noindex",
      label: "Page is indexable",
      category: "onpage",
      status: "pass",
      severity: "high",
    });
  }

  /* ======================
   * SOCIAL PREVIEW (OG)
   * ====================== */

  const og = seo.og;

  checks.push({
    id: "og-title",
    label: "Open Graph title exists",
    category: "social",
    status: og["og:title"] ? "pass" : "warn",
    severity: "medium",
    evidence: og["og:title"],
  });

  checks.push({
    id: "og-description",
    label: "Open Graph description exists",
    category: "social",
    status: og["og:description"] ? "pass" : "warn",
    severity: "medium",
    evidence: og["og:description"],
  });

  checks.push({
    id: "og-image",
    label: "Open Graph image exists",
    category: "social",
    status: og["og:image"] ? "pass" : "warn",
    severity: "medium",
    evidence: og["og:image"],
  });

  /* ======================
   * SOCIAL PREVIEW (Twitter)
   * ====================== */

  const twitter = seo.twitter;

  checks.push({
    id: "twitter-card",
    label: "Twitter card type defined",
    category: "social",
    status: twitter["twitter:card"] ? "pass" : "warn",
    severity: "low",
    evidence: twitter["twitter:card"],
  });

  checks.push({
    id: "twitter-title",
    label: "Twitter title exists",
    category: "social",
    status: twitter["twitter:title"] ? "pass" : "warn",
    severity: "low",
    evidence: twitter["twitter:title"],
  });

  checks.push({
    id: "twitter-image",
    label: "Twitter image exists",
    category: "social",
    status: twitter["twitter:image"] ? "pass" : "warn",
    severity: "low",
    evidence: twitter["twitter:image"],
  });

  /* ======================
   * DISCOVERY
   * ====================== */

  // robots.txt reachable
  checks.push({
    id: "robots-reachable",
    label: "robots.txt is reachable",
    category: "discovery",
    status: discovery.robots.reachable ? "pass" : "warn",
    severity: "medium",
  });

  // Sitemap declared
  checks.push({
    id: "sitemap-declared",
    label: "Sitemap declared in robots.txt",
    category: "discovery",
    status: discovery.robots.sitemapUrls.length > 0 ? "pass" : "warn",
    severity: "medium",
    evidence: discovery.robots.sitemapUrls[0],
  });

  // Sitemap fetchable
  if (discovery.robots.sitemapUrls.length > 0) {
    checks.push({
      id: "sitemap-fetchable",
      label: "Sitemap is fetchable",
      category: "discovery",
      status: discovery.sitemap.fetched ? "pass" : "warn",
      severity: "low",
      evidence: discovery.sitemap.fetched
        ? `${discovery.sitemap.urlCount ?? 0} URLs found`
        : "Failed to fetch sitemap",
    });
  }

  return checks;
}
