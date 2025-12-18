# SEO Analyzer

A modern, fast, and comprehensive SEO analysis tool built with Next.js 15. Analyze any website's SEO performance, get actionable recommendations, and improve your search engine rankings.

## Features

- **Comprehensive SEO Analysis** - Analyze on-page SEO, social media tags, and discoverability
- **Real-time Scoring** - Get instant feedback with a 0-100 SEO score
- **Actionable Recommendations** - Receive prioritized, step-by-step fixes for issues
- **robots.txt & Sitemap Validation** - Automatic crawlability and indexability checks
- **Mobile Responsive** - Fully optimized for all device sizes
- **Modern UI** - Clean, Vercel-inspired design with dark mode support

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Parsing**: Cheerio, fast-xml-parser

## Getting Started

### Prerequisites

- Node.js 20+ or Bun
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/GabrielNathanael/seo-analyzer-next-js.git
cd seo-analyzer
```

2. Install dependencies:

```bash
pnpm install
```

3. Run the development server:

```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Enter any website URL (with or without `https://`)
2. Click **Analyze** or press Enter
3. View your SEO score and detailed checks
4. Review recommendations prioritized by severity
5. Implement fixes to improve your SEO

## Project Structure

```
seo-analyzer/
├── src/
│   ├── app/
│   │   ├── api/analyze/route.ts    # Main API endpoint
│   │   ├── page.tsx                # Home page
│   │   └── layout.tsx              # Root layout
│   ├── components/
│   │   ├── UrlInput.tsx            # URL input form
│   │   ├── ScoreCard.tsx           # Score display
│   │   ├── ChecksTab.tsx           # Detailed checks tabs
│   │   ├── RecommendationList.tsx  # Recommendations
│   │   └── ui/                     # shadcn/ui components
│   ├── lib/
│   │   └── analyzer/
│   │       ├── fetch.ts            # URL fetching & validation
│   │       ├── parseHtml.ts        # HTML parsing
│   │       ├── parseRobots.ts      # robots.txt parsing
│   │       ├── parseSitemap.ts     # Sitemap parsing
│   │       ├── checks.ts           # SEO checks logic
│   │       ├── score.ts            # Scoring algorithm
│   │       └── recommend.ts        # Recommendations engine
│   └── types/
│       ├── analyzer.ts             # Type definitions
│       └── recommendation.ts       # Recommendation types
```

## SEO Checks

### On-Page SEO

- Title tag existence and length (10-60 chars)
- Meta description existence and length (70-160 chars)
- Canonical URL validation
- Meta robots indexability check

### Social Media

- Open Graph tags (title, description, image)
- Twitter Card tags (card type, title, image)

### Discovery

- robots.txt accessibility
- Sitemap declaration in robots.txt
- Sitemap fetchability and URL count

## Scoring System

The SEO score is calculated based on weighted checks:

- **80-100**: Good - Your SEO is in great shape
- **50-79**: Needs Improvement - Some issues to address
- **0-49**: Poor - Critical issues require immediate attention

Weights are assigned based on SEO impact:

- High severity checks: 15 points
- Medium severity checks: 5-10 points
- Low severity checks: 3-5 points

## API Reference

### POST `/api/analyze`

Analyze a website's SEO.

**Request Body:**

```json
{
  "url": "example.com"
}
```

**Response:**

```json
{
  "input": { "raw": "...", "normalized": "...", "timestamp": "..." },
  "fetch": { "status": 200, "finalUrl": "...", "size": 12345, "timingMs": 250 },
  "seo": { "title": {...}, "metaDescription": {...}, "canonical": "...", ... },
  "discovery": { "robots": {...}, "sitemap": {...} },
  "checks": [...],
  "score": { "score": 85, "max": 100, "total": 85 },
  "recommendations": [...],
  "status": "ok"
}
```

## Security Features

- Private IP blocking (localhost, 192.168.x.x, 10.x.x.x)
- Request timeout protection (9 seconds)
- Response size limiting (2MB max)
- URL validation and sanitization

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Deploy with default settings

### Other Platforms

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

---

Made by [Gabriel Nathanael Purba](https://github.com/GabrielNathanel)
