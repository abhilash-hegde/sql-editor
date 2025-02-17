"use client";

import { Button } from "@/components/ui/button";
import availableQueries from "@/constants/available-queries";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function AvailableQueries({ onSelectQuery }) {
  return (
    <div className="space-y-2">
      {availableQueries.map((query) => (
        <TooltipProvider key={query.queryKey}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => onSelectQuery(query.query)}
                variant="outline"
                className="w-full justify-start"
              >
                <span className="truncate text-xs">{query.name}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="w-80 break-words">
              <span className="text-xs">{query.name}</span>
              <div className="flex justify-start text-xs">
                <span className="text-gray-400">Description:</span>{" "}
                <span className="text-gray-500">{query.purpose}</span>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}
