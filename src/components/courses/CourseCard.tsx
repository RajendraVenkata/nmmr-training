import Link from "next/link";
import { Clock, BookOpen, CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

interface CourseCardProps {
  slug: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  difficulty: string;
  duration: string;
  instructor: string;
  lessonsCount: number;
  isEnrolled?: boolean;
}

const difficultyColors: Record<string, string> = {
  beginner: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  intermediate: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  advanced: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export function CourseCard({
  slug,
  title,
  description,
  price,
  currency,
  category,
  difficulty,
  duration,
  instructor,
  lessonsCount,
  isEnrolled,
}: CourseCardProps) {
  return (
    <Link href={isEnrolled ? `/dashboard/courses/${slug}` : `/courses/${slug}`}>
      <Card className="h-full transition-all hover:shadow-lg hover:border-accent/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2 mb-2">
            <Badge variant="secondary" className="text-xs">
              {category}
            </Badge>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyColors[difficulty] || ""}`}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </span>
          </div>
          <CardTitle className="text-lg leading-tight line-clamp-2">
            {title}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{instructor}</p>
        </CardHeader>
        <CardContent>
          <CardDescription className="line-clamp-2 mb-4">
            {description}
          </CardDescription>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {duration}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              {lessonsCount} lessons
            </span>
          </div>
          <div className="flex items-center justify-between">
            {isEnrolled ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                Enrolled
              </span>
            ) : (
              <span className="text-lg font-bold">
                {price === 0 ? (
                  <span className="text-green-600 dark:text-green-400">Free</span>
                ) : (
                  formatPrice(price, currency)
                )}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
