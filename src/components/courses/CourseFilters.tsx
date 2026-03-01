"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { COURSE_CATEGORIES, COURSE_DIFFICULTIES } from "@/lib/constants";

interface CourseFiltersProps {
  selectedCategory: string;
  selectedDifficulty: string;
  onCategoryChange: (category: string) => void;
  onDifficultyChange: (difficulty: string) => void;
}

export function CourseFilters({
  selectedCategory,
  selectedDifficulty,
  onCategoryChange,
  onDifficultyChange,
}: CourseFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Category filters */}
      <div>
        <h3 className="text-sm font-medium mb-2">Category</h3>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === "" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onCategoryChange("")}
          >
            All
          </Badge>
          {COURSE_CATEGORIES.map((cat) => (
            <Badge
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => onCategoryChange(selectedCategory === cat ? "" : cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      {/* Difficulty filters */}
      <div>
        <h3 className="text-sm font-medium mb-2">Difficulty</h3>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedDifficulty === "" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onDifficultyChange("")}
          >
            All Levels
          </Badge>
          {COURSE_DIFFICULTIES.map((diff) => (
            <Badge
              key={diff.value}
              variant={selectedDifficulty === diff.value ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() =>
                onDifficultyChange(
                  selectedDifficulty === diff.value ? "" : diff.value
                )
              }
            >
              {diff.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Clear filters */}
      {(selectedCategory || selectedDifficulty) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            onCategoryChange("");
            onDifficultyChange("");
          }}
        >
          Clear Filters
        </Button>
      )}
    </div>
  );
}
