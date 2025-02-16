import { Button } from "@/components/ui/button";

export default function SavedQueries({ queries, onSelectQuery }) {
  if (!queries.length) {
    return (
      <span className="text-xs text-gray-500 ml-5">
        No saved queries found!
      </span>
    );
  }
  return (
    <div className="space-y-2 mt-4">
      {queries.map((query, index) => (
        <Button
          key={index}
          onClick={() => onSelectQuery(query.query)}
          variant="outline"
          className="w-full justify-start"
        >
          {query.name}
        </Button>
      ))}
    </div>
  );
}
