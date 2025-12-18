// src/components/RecommendationList.tsx
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, CheckSquare } from "lucide-react";
import type { Recommendation } from "@/types/recommendation";

interface RecommendationListProps {
  recommendations: Recommendation[];
}

export function RecommendationList({
  recommendations,
}: RecommendationListProps) {
  // Group by severity
  const grouped = {
    high: recommendations.filter((r) => r.severity === "high"),
    medium: recommendations.filter((r) => r.severity === "medium"),
    low: recommendations.filter((r) => r.severity === "low"),
  };

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-6">
        <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
        <h2 className="text-xl sm:text-2xl font-semibold">Recommendations</h2>
        <Badge variant="secondary" className="ml-2">
          {recommendations.length}
        </Badge>
      </div>

      <div className="space-y-6">
        {grouped.high.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-red-700 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 rounded-full"></span>
              High Priority ({grouped.high.length})
            </h3>
            <div className="space-y-3">
              {grouped.high.map((rec) => (
                <RecommendationCard key={rec.id} recommendation={rec} />
              ))}
            </div>
          </div>
        )}

        {grouped.medium.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-orange-700 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
              Medium Priority ({grouped.medium.length})
            </h3>
            <div className="space-y-3">
              {grouped.medium.map((rec) => (
                <RecommendationCard key={rec.id} recommendation={rec} />
              ))}
            </div>
          </div>
        )}

        {grouped.low.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-blue-700 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              Low Priority ({grouped.low.length})
            </h3>
            <div className="space-y-3">
              {grouped.low.map((rec) => (
                <RecommendationCard key={rec.id} recommendation={rec} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

function RecommendationCard({
  recommendation,
}: {
  recommendation: Recommendation;
}) {
  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, string> = {
      high: "bg-red-50 text-red-700 border-red-200",
      medium: "bg-orange-50 text-orange-700 border-orange-200",
      low: "bg-blue-50 text-blue-700 border-blue-200",
    };
    return (
      <Badge variant="outline" className={variants[severity]}>
        {severity}
      </Badge>
    );
  };

  const getCategoryBadge = (category: string) => {
    const labels: Record<string, string> = {
      onpage: "On-Page",
      content: "Content",
      social: "Social",
      discovery: "Discovery",
    };
    return (
      <Badge variant="secondary" className="text-xs">
        {labels[category]}
      </Badge>
    );
  };

  return (
    <div className="p-3 sm:p-4 rounded-lg border bg-card">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-3">
        <h4 className="font-semibold text-sm sm:text-base">
          {recommendation.title}
        </h4>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {getCategoryBadge(recommendation.category)}
          {getSeverityBadge(recommendation.severity)}
        </div>
      </div>

      <p className="text-xs sm:text-sm text-muted-foreground mb-4">
        {recommendation.reason}
      </p>

      <div className="space-y-2">
        <h5 className="text-xs sm:text-sm font-medium flex items-center gap-2">
          <CheckSquare className="w-3 h-3 sm:w-4 sm:h-4" />
          How to fix:
        </h5>
        <ul className="space-y-1.5 ml-4 sm:ml-6">
          {recommendation.howToFix.map((step, idx) => (
            <li
              key={idx}
              className="text-xs sm:text-sm text-muted-foreground list-disc"
            >
              {step}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
