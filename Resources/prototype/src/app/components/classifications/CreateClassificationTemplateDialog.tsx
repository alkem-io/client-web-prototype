import { useState } from "react";
import { Plus, X, AlertCircle } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Badge } from "@/app/components/ui/badge";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

interface CreateClassificationTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (template: {
    name: string;
    description: string;
    cardinality: "single" | "multi";
    values: string[];
  }) => void;
}

export function CreateClassificationTemplateDialog({
  open,
  onOpenChange,
  onCreated,
}: CreateClassificationTemplateDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cardinality, setCardinality] = useState<"single" | "multi">("multi");
  const [values, setValues] = useState<string[]>([]);
  const [valueInput, setValueInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddValue = () => {
    const trimmed = valueInput.trim();
    if (trimmed && !values.includes(trimmed)) {
      setValues((prev) => [...prev, trimmed]);
      setValueInput("");
      if (errors.values) {
        setErrors((prev) => ({ ...prev, values: "" }));
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddValue();
    }
  };

  const removeValue = (val: string) => {
    setValues((prev) => prev.filter((v) => v !== val));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (values.length < 2) newErrors.values = "Add at least 2 values";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = () => {
    if (!validate()) return;

    onCreated?.({
      name: name.trim(),
      description: description.trim(),
      cardinality,
      values,
    });

    // Reset
    setName("");
    setDescription("");
    setCardinality("multi");
    setValues([]);
    setValueInput("");
    setErrors({});
    onOpenChange(false);
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setCardinality("multi");
    setValues([]);
    setValueInput("");
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle>Create Classification Template</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="ct-name">Name</Label>
            <Input
              id="ct-name"
              placeholder="e.g. UN Sustainable Development Goals"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((p) => ({ ...p, name: "" }));
              }}
            />
            {errors.name && (
              <p className="text-caption text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.name}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="ct-desc">Description</Label>
            <Textarea
              id="ct-desc"
              placeholder="Brief description of what this classification is for…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          {/* Cardinality */}
          <div className="space-y-2">
            <Label>Selection Type</Label>
            <Select value={cardinality} onValueChange={(v) => setCardinality(v as "single" | "multi")}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="multi">Multi-select — users can pick multiple values</SelectItem>
                <SelectItem value="single">Single-select — users pick exactly one value</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Values */}
          <div className="space-y-2">
            <Label>Values</Label>
            <p className="text-caption text-muted-foreground">
              Define the allowed values for this classification. Type a value and press Enter.
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="e.g. SDG 1 – No Poverty"
                value={valueInput}
                onChange={(e) => setValueInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Button variant="outline" size="sm" onClick={handleAddValue} disabled={!valueInput.trim()}>
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>
            {errors.values && (
              <p className="text-caption text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.values}
              </p>
            )}

            {/* Value pills */}
            {values.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2 max-h-[160px] overflow-y-auto">
                {values.map((val, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="gap-1 pl-2.5 pr-1 py-1 text-caption font-normal"
                  >
                    {val}
                    <button
                      onClick={() => removeValue(val)}
                      className="ml-0.5 hover:text-destructive transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            <p className="text-[11px] text-muted-foreground">
              {values.length} value{values.length !== 1 ? "s" : ""} defined
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>Create Template</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
