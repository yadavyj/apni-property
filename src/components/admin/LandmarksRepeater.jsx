"use client";

import { Plus, Trash2 } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LandmarksRepeater({ fields, append, remove, register, errors }) {
  return (
    <div className="flex flex-col gap-3">
      {fields.length === 0 && (
        <p className="text-sm text-ink-muted">No landmarks added yet.</p>
      )}

      {fields.map((field, index) => (
        <div key={field.id} className="flex items-start gap-2">
          <div className="flex-1">
            <Input
              placeholder="Landmark name (e.g. City Mall)"
              {...register(`landmarks.${index}.name`)}
              error={errors?.landmarks?.[index]?.name?.message}
            />
          </div>
          <div className="w-32">
            <Input
              type="number"
              step="0.1"
              placeholder="Distance (km)"
              {...register(`landmarks.${index}.distance_km`)}
              error={errors?.landmarks?.[index]?.distance_km?.message}
            />
          </div>
          <button
            type="button"
            onClick={() => remove(index)}
            className="mt-1.5 shrink-0 rounded-lg p-2 text-red-500 hover:bg-red-50"
            aria-label="Remove landmark"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="self-start"
        onClick={() => append({ name: "", distance_km: "" })}
      >
        <Plus className="h-4 w-4" />
        Add landmark
      </Button>
    </div>
  );
}
