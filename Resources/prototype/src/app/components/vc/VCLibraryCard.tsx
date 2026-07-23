import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent } from "@/app/components/ui/card";
import { Bot } from "lucide-react";
import { VirtualContributor } from "./VirtualContributor";

interface VCLibraryCardProps {
  vc: VirtualContributor;
  onSelect: () => void;
}

export function VCLibraryCard({ vc, onSelect }: VCLibraryCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onSelect}
    >
      <CardContent className="p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <Avatar className="w-10 h-10">
            <AvatarImage src={vc.avatarUrl} alt={vc.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              <Bot className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
        </div>
        <div>
          <h3 className="text-body font-semibold text-foreground">{vc.name}</h3>
          <p className="text-caption text-muted-foreground line-clamp-2 mt-1">
            {vc.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {vc.tags.slice(0, 2).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-caption font-medium"
            >
              {tag}
            </Badge>
          ))}
          {vc.tags.length > 2 && (
            <Badge variant="outline" className="text-caption font-medium">
              +{vc.tags.length - 2}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
