import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Check, Minus } from "lucide-react";

interface FunctionalityItem {
  label: string;
  enabled: boolean;
}

interface FunctionalityCardProps {
  icon: React.ReactNode;
  title: string;
  items?: FunctionalityItem[];
  bodyText?: React.ReactNode;
}

export function FunctionalityCard({ icon, title, items, bodyText }: FunctionalityCardProps) {
  return (
    <Card className="text-center">
      <CardHeader className="pb-2 pt-5 px-4 flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-2">
          {icon}
        </div>
        <CardTitle className="text-card-title">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-5 pt-2">
        {items ? (
          <ul className="space-y-1.5 text-left">
            {items.map((item) => (
              <li key={item.label} className="flex items-start gap-2 text-caption">
                {item.enabled ? (
                  <Check className="w-3.5 h-3.5 mt-0.5 text-foreground shrink-0" />
                ) : (
                  <Minus className="w-3.5 h-3.5 mt-0.5 text-muted-foreground shrink-0" />
                )}
                <span className={item.enabled ? "text-foreground" : "text-muted-foreground"}>
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-caption text-muted-foreground text-left">{bodyText}</p>
        )}
      </CardContent>
    </Card>
  );
}
