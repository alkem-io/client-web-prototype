import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";

interface TransparencyCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  value?: boolean;
  textValue?: string;
  noIcon?: React.ReactNode;
}

export function TransparencyCard({ icon, title, description, value, textValue, noIcon }: TransparencyCardProps) {
  return (
    <Card className="text-center flex flex-col">
      <CardHeader className="pb-2 pt-5 px-4 flex flex-col items-center flex-grow">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-2">
          {icon}
        </div>
        <CardTitle className="text-card-title">{title}</CardTitle>
        <p className="text-caption text-muted-foreground mt-1">{description}</p>
      </CardHeader>
      <CardContent className="px-4 pb-5 pt-2">
        {textValue ? (
          <span className="text-body-emphasis text-foreground">{textValue}</span>
        ) : value !== undefined ? (
          <div className="flex items-center justify-center gap-1.5">
            {value ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-body-emphasis">Yes</span>
              </>
            ) : (
              <>
                {noIcon || <XCircle className="w-4 h-4 text-muted-foreground" />}
                <span className="text-body-emphasis text-muted-foreground">No</span>
              </>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
