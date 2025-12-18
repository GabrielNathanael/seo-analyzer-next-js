// src\components\ScoreCard.tsx
// src/components/ScoreCard.tsx
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";

interface ScoreCardProps {
  score: number;
}

export function ScoreCard({ score }: ScoreCardProps) {
  const getScoreStatus = (score: number) => {
    if (score >= 80)
      return {
        label: "Good",
        color: "text-green-600",
        icon: CheckCircle2,
        variant: "default" as const,
      };
    if (score >= 50)
      return {
        label: "Needs Improvement",
        color: "text-yellow-600",
        icon: AlertCircle,
        variant: "secondary" as const,
      };
    return {
      label: "Poor",
      color: "text-red-600",
      icon: XCircle,
      variant: "destructive" as const,
    };
  };

  const status = getScoreStatus(score);
  const Icon = status.icon;

  return (
    <Card className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-1">
            Overall SEO Score
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Your website&apos;s search engine optimization performance
          </p>
        </div>
        <Badge variant={status.variant} className="text-sm px-4 py-2 w-fit">
          {status.label}
        </Badge>
      </div>

      <div className="flex items-end gap-4 sm:gap-6 mb-4">
        <div className="flex items-baseline gap-2">
          <span
            className={`text-4xl sm:text-5xl lg:text-6xl font-bold ${status.color}`}
          >
            {score}
          </span>
          <span className="text-2xl sm:text-3xl text-muted-foreground font-medium">
            /100
          </span>
        </div>
        <Icon
          className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mb-1 sm:mb-2 ${status.color}`}
        />
      </div>

      <Progress value={score} className="h-2 sm:h-3" />
    </Card>
  );
}
