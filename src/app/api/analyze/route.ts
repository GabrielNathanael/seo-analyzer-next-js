// src\app\api\analyze\route.ts
// src/app/api/analyze/route.ts
import { NextResponse } from "next/server";
import { normalizeUrl, assertSafeUrl, fetchHtml } from "@/lib/analyzer/fetch";
import { parseHtml } from "@/lib/analyzer/parseHtml";
import { parseRobots } from "@/lib/analyzer/parseRobots";
import { parseSitemap } from "@/lib/analyzer/parseSitemap";
import type { SitemapResult } from "@/lib/analyzer/parseSitemap";
import { runChecks } from "@/lib/analyzer/checks";
import { calculateScore } from "@/lib/analyzer/score";
import { generateRecommendations } from "@/lib/analyzer/recommend";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawUrl = body?.url;

    if (!rawUrl || typeof rawUrl !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // ---- Input ----
    const normalized = normalizeUrl(rawUrl);
    assertSafeUrl(normalized);

    const input = {
      raw: rawUrl,
      normalized: normalized.toString(),
      timestamp: new Date().toISOString(),
    };

    // ---- Fetch + Parse ----
    const { html, fetch } = await fetchHtml(normalized);
    const seo = parseHtml(html);

    // ---- Discovery ----
    const robots = await parseRobots(normalized);

    let sitemap: SitemapResult = {
      fetched: false,
      urlCount: null,
    };

    if (robots.sitemapUrls.length > 0) {
      sitemap = await parseSitemap(robots.sitemapUrls[0]);
    }

    const discovery = {
      robots,
      sitemap,
    };

    // ---- Checks + Score ----
    const checks = runChecks({ seo, discovery });
    const score = calculateScore(checks);
    const recommendations = generateRecommendations(checks);
    return NextResponse.json({
      input,
      fetch,
      seo,
      discovery,
      checks,
      score,
      recommendations,
      status: "ok",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Analyze failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
