import { PlaceholderCard } from "@/app/components/ui/placeholder-card";
import { Card, CardContent } from "@/app/components/ui/card";

interface Response {
  id: string;
  title: string;
  type: "whiteboard" | "document" | "post";
}

interface ResponsesSectionProps {
  responses?: Response[];
  responseTypes: Array<{ id: string; name: string; type: string }>;
  onAddResponse?: (type: string) => void;
}

/**
 * Example component showing how responses to a post are displayed.
 *
 * When a post has responses enabled (e.g., "Call for Whiteboards"),
 * this section displays:
 * 1. Existing response items in a grid
 * 2. Placeholder cards for each response type that can be added
 *
 * This demonstrates the PlaceholderCard pattern for response discoverability.
 */
export function ResponsesSection({
  responses = [],
  responseTypes,
  onAddResponse,
}: ResponsesSectionProps) {
  return (
    <div className="mt-6 space-y-4">
      <div>
        <h3 className="text-subsection-title font-semibold mb-3">Responses</h3>

        {/* Responses grid with placeholder cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Existing responses */}
          {responses.map((response) => (
            <Card key={response.id} className="cursor-pointer hover:shadow-md transition-all">
              <CardContent className="flex items-center justify-center aspect-square">
                <div className="text-center">
                  <div className="text-sm font-medium">{response.title}</div>
                  <div className="text-caption text-muted-foreground mt-1">
                    {response.type}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Placeholder cards for each response type that can be added */}
          {responseTypes.map((type) => (
            <PlaceholderCard
              key={type.id}
              label={`Add ${type.name}`}
              size="sm"
              onClick={() => onAddResponse?.(type.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
