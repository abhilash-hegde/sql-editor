"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function QueryHistory({ history, onSelectQuery }) {
  if (!history.length) {
    return (
      <span className="text-xs text-gray-500 ml-5">
        No query history found!
      </span>
    );
  }
  return (
    <div className="space-y-2">
      {history.map((item, index) => (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => onSelectQuery(item.query)}
                variant="outline"
                className="w-full justify-start"
              >
                <span className="truncate text-xs">{item.query}</span>
                <span className="text-xs text-gray-500 ml-auto">
                  {new Date(item.timestamp).toLocaleDateString()}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="w-80 break-words" >
              <span className="text-xs">{item.query}</span>
              <span className="text-xs text-gray-500 ml-2">
                {new Date(item.timestamp).toLocaleString()}
              </span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}
