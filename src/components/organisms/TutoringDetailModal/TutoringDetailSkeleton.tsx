import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

export const TutoringDetailSkeleton: React.FC = () => {
  return (
    <ScrollArea className="flex-1 min-h-0">
      <div className="pr-4 space-y-6 pt-4">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-36" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div>
              <Skeleton className="h-9 w-36 rounded-md" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-4 w-36" />

          {/* Feedback Card 1 */}
          <div className="bg-slate-800/30 rounded-lg border border-slate-700/30 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-48" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-3 w-32" />
          </div>

          <div className="bg-slate-800/30 rounded-lg border border-slate-700/30 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-48" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};
