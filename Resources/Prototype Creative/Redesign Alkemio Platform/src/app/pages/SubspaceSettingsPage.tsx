import { useParams, useNavigate, Navigate } from "react-router";
import { SubspaceSettingsLayout } from "@/app/components/space/SubspaceSettingsLayout";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/app/components/ui/button";

export default function SubspaceSettingsPage() {
  const { spaceSlug, subspaceSlug, tab } = useParams<{
    spaceSlug: string;
    subspaceSlug: string;
    tab: string;
  }>();
  const navigate = useNavigate();

  if (!tab) {
    return (
      <Navigate
        to={`/space/${spaceSlug}/subspaces/${subspaceSlug}/settings/layout`}
        replace
      />
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background">
      <div className="max-w-6xl mx-auto p-6 md:p-8">
        {/* Back navigation */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 gap-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate(`/${spaceSlug}/challenges/${subspaceSlug}`)}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Subspace
        </Button>

        <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm min-h-[500px]">
          {tab === "layout" ? (
            <SubspaceSettingsLayout />
          ) : (
            <div className="flex flex-col justify-center h-full min-h-[300px] space-y-4">
              <h2 className="text-xl font-semibold capitalize">
                {tab} Settings
              </h2>
              <p className="text-muted-foreground max-w-sm">
                This section is under development.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
