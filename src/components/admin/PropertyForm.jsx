"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Save, Building2, MapPin, Calculator, ShieldCheck, Navigation, Image as ImageIcon, Sparkles, X } from "lucide-react";
import { propertySchema } from "@/lib/validations/property.schema";
import { createProperty, updateProperty } from "@/lib/actions/property.actions";
import {
  PROPERTY_CATEGORIES,
  PROPERTY_STATUSES,
  REGISTRY_STATUSES,
} from "@/lib/constants";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Switch from "@/components/ui/Switch";
import Button from "@/components/ui/Button";
import LandmarksRepeater from "@/components/admin/LandmarksRepeater";
import MediaUploader from "@/components/admin/MediaUploader";
import { formatCompactCurrency, formatCurrency } from "@/lib/format";

function emptyToUndefined(value) {
  return value === "" || value === null ? undefined : value;
}

export default function PropertyForm({ property }) {
  const router = useRouter();
  const isEditMode = Boolean(property);
  const [submitting, setSubmitting] = useState(false);

  const mediaCount = property?.property_media?.length || 0;

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: property?.title || "",
      description: property?.description || "",
      category: property?.category || "",
      status: property?.status || "draft",
      location_area: property?.location_area || "",
      location_city: property?.location_city || "Gorakhpur",
      location_state: property?.location_state || "Uttar Pradesh",
      size_display: property?.size_display || "",
      size_width_ft: property?.size_width_ft ?? "",
      size_length_ft: property?.size_length_ft ?? "",
      area_sqft: property?.area_sqft ?? "",
      rate_per_sqft: property?.rate_per_sqft ?? "",
      road_width_ft: property?.road_width_ft ?? "",
      registry_status: property?.registry_status || "",
      emi_available: property?.emi_available ?? false,
      is_featured: property?.is_featured ?? false,
      landmarks: property?.landmarks || [],
    },
  });

  const areaSqftWatch = watch("area_sqft");
  const ratePerSqftWatch = watch("rate_per_sqft");

  const computedTotalPrice = (Number(areaSqftWatch) || 0) * (Number(ratePerSqftWatch) || 0);

  function handleManualTotalPriceChange(e) {
    const val = Number(e.target.value);
    const area = Number(areaSqftWatch);
    if (val > 0 && area > 0) {
      const calculatedRate = (val / area).toFixed(2);
      setValue("rate_per_sqft", calculatedRate, { shouldValidate: true, shouldDirty: true });
    }
  }

  const { fields, append, remove } = useFieldArray({ control, name: "landmarks" });

  async function onSubmit(values) {
    setSubmitting(true);
    const payload = {
      ...values,
      description: emptyToUndefined(values.description),
      size_display: emptyToUndefined(values.size_display),
      size_width_ft: emptyToUndefined(values.size_width_ft),
      size_length_ft: emptyToUndefined(values.size_length_ft),
      road_width_ft: emptyToUndefined(values.road_width_ft),
    };

    try {
      if (isEditMode) {
        await updateProperty(property.id, payload);
        toast.success("Property updated successfully!");
        router.refresh();
      } else {
        const created = await createProperty(payload);
        toast.success("Property created — now add photos & media!");
        router.push(`/admin/properties/${created.id}/edit`);
        return;
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 sm:gap-8 min-w-0 pb-20">
      {/* 1. Basic Details Card */}
      <section className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-7 backdrop-blur-2xl shadow-xl transition-all hover:border-brand-500/30 min-w-0">
        <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/20 text-brand-300 border border-brand-500/30 shrink-0">
            <Building2 className="h-4.5 w-4.5" />
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-base font-bold text-white truncate">Basic Listing Details</h2>
            <p className="text-xs text-slate-400 truncate">Title, category, publication status &amp; overview</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input
              id="title"
              label="Property Title *"
              placeholder="e.g. 2-Floor House in Kashipuram Colony, Bichhiya"
              error={errors.title?.message}
              {...register("title")}
              className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-brand-500 text-xs sm:text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <Textarea
              id="description"
              label="Property Description"
              placeholder="Describe the property features, boundaries, surroundings…"
              error={errors.description?.message}
              {...register("description")}
              className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-brand-500 text-xs sm:text-sm min-h-[120px]"
            />
          </div>

          <Select
            id="category"
            label="Property Category *"
            error={errors.category?.message}
            {...register("category")}
            className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-brand-500 text-xs sm:text-sm"
          >
            <option value="" className="bg-slate-950 text-white">Select category</option>
            {PROPERTY_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value} className="bg-slate-950 text-white">
                {c.label}
              </option>
            ))}
          </Select>

          <div className="flex flex-col gap-1.5">
            <Select
              id="status"
              label="Publication Status *"
              error={errors.status?.message}
              {...register("status")}
              className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-brand-500 text-xs sm:text-sm"
            >
              {PROPERTY_STATUSES.map((s) => (
                <option key={s.value} value={s.value} className="bg-slate-950 text-white">
                  {s.label}
                </option>
              ))}
            </Select>
            {mediaCount === 0 && (
              <p className="text-[11px] text-amber-400 font-semibold mt-1">
                ⚠️ Tip: Upload at least 1 photo before changing status to Published.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 2. Location Coordinates Card */}
      <section className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-7 backdrop-blur-2xl shadow-xl transition-all hover:border-brand-500/30 min-w-0">
        <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
            <MapPin className="h-4.5 w-4.5" />
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-base font-bold text-white truncate">Location &amp; Area</h2>
            <p className="text-xs text-slate-400 truncate">Locality, city and state information</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            id="location_area"
            label="Area / Locality *"
            placeholder="e.g. Bichhiya / Kashipuram"
            error={errors.location_area?.message}
            {...register("location_area")}
            className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-brand-500 text-xs sm:text-sm"
          />
          <Input
            id="location_city"
            label="City *"
            error={errors.location_city?.message}
            {...register("location_city")}
            className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-brand-500 text-xs sm:text-sm"
          />
          <Input
            id="location_state"
            label="State *"
            error={errors.location_state?.message}
            {...register("location_state")}
            className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-brand-500 text-xs sm:text-sm"
          />
        </div>
      </section>

      {/* 3. Size & Pricing Dimensions Card */}
      <section className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-7 backdrop-blur-2xl shadow-xl transition-all hover:border-brand-500/30 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
              <Calculator className="h-4.5 w-4.5" />
            </span>
            <div className="min-w-0">
              <h2 className="font-display text-base font-bold text-white truncate">Dimensions, Area &amp; Pricing</h2>
              <p className="text-xs text-slate-400 truncate">Dimensions (ft), total area (sqft) and rate or total price</p>
            </div>
          </div>

          {/* Live Calculated Total Price Badge */}
          {computedTotalPrice > 0 && (
            <div className="inline-flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 backdrop-blur-md">
              <span className="text-xs font-semibold text-amber-300">Total Price:</span>
              <span className="text-sm font-black text-white">
                {formatCompactCurrency(computedTotalPrice)} ({formatCurrency(computedTotalPrice)})
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            id="size_display"
            label="Size Display Text"
            placeholder="e.g. 30 ft x 60 ft"
            error={errors.size_display?.message}
            {...register("size_display")}
            className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-brand-500 text-xs sm:text-sm"
          />
          <Input
            id="size_width_ft"
            type="number"
            step="0.01"
            label="Width (ft)"
            error={errors.size_width_ft?.message}
            {...register("size_width_ft")}
            className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-brand-500 text-xs sm:text-sm"
          />
          <Input
            id="size_length_ft"
            type="number"
            step="0.01"
            label="Length (ft)"
            error={errors.size_length_ft?.message}
            {...register("size_length_ft")}
            className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-brand-500 text-xs sm:text-sm"
          />
          <Input
            id="area_sqft"
            type="number"
            step="0.01"
            label="Total Area (sqft) *"
            error={errors.area_sqft?.message}
            {...register("area_sqft")}
            className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-brand-500 text-xs sm:text-sm"
          />
          <Input
            id="rate_per_sqft"
            type="number"
            step="0.01"
            label="Rate (₹ / sqft) *"
            error={errors.rate_per_sqft?.message}
            {...register("rate_per_sqft")}
            className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-brand-500 text-xs sm:text-sm"
          />
          <Input
            id="manual_total_price"
            type="number"
            step="1"
            label="Set Total Price Manually (₹)"
            placeholder="e.g. 1500000"
            onChange={handleManualTotalPriceChange}
            className="bg-slate-950/60 border-amber-500/30 text-amber-200 rounded-2xl focus:border-amber-400 text-xs sm:text-sm font-semibold"
          />
          <Input
            id="road_width_ft"
            type="number"
            step="0.01"
            label="Front Road Width (ft)"
            error={errors.road_width_ft?.message}
            {...register("road_width_ft")}
            className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-brand-500 text-xs sm:text-sm"
          />
        </div>
      </section>

      {/* 4. Registry & Special Flags Card */}
      <section className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-7 backdrop-blur-2xl shadow-xl transition-all hover:border-brand-500/30 min-w-0">
        <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
            <ShieldCheck className="h-4.5 w-4.5" />
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-base font-bold text-white truncate">Registry Status &amp; Feature Flags</h2>
            <p className="text-xs text-slate-400 truncate">Registry state, EMI options and featured listing toggle</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            id="registry_status"
            label="Registry Status"
            error={errors.registry_status?.message}
            {...register("registry_status")}
            className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-brand-500 text-xs sm:text-sm"
          >
            <option value="" className="bg-slate-950 text-white">Select registry status</option>
            {REGISTRY_STATUSES.map((r) => (
              <option key={r.value} value={r.value} className="bg-slate-950 text-white">
                {r.label}
              </option>
            ))}
          </Select>

          <div className="flex flex-wrap items-center gap-6 rounded-2xl border border-white/10 bg-slate-950/40 p-3.5 sm:justify-self-start sm:self-end">
            <Controller
              control={control}
              name="emi_available"
              render={({ field }) => (
                <Switch
                  id="emi_available"
                  label="EMI Available"
                  checked={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              control={control}
              name="is_featured"
              render={({ field }) => (
                <Switch
                  id="is_featured"
                  label="Featured Listing"
                  checked={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </div>
      </section>

      {/* 5. Nearby Landmarks Card */}
      <section className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-7 backdrop-blur-2xl shadow-xl transition-all hover:border-brand-500/30 min-w-0">
        <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30 shrink-0">
            <Navigation className="h-4.5 w-4.5" />
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-base font-bold text-white truncate">Nearby Landmarks &amp; Distances</h2>
            <p className="text-xs text-slate-400 truncate">Hospitals, schools, highways and market distances</p>
          </div>
        </div>

        <LandmarksRepeater
          fields={fields}
          append={append}
          remove={remove}
          register={register}
          errors={errors}
        />
      </section>



      {/* 100% Fixed Flush Bottom Action Bar (Aligned with Main Panel) */}
      <div className="fixed bottom-0 left-0 lg:left-72 right-0 z-40 flex items-center justify-between gap-3 border-t border-white/15 bg-slate-950/95 p-3.5 sm:px-8 backdrop-blur-2xl shadow-[0_-10px_30px_rgba(0,0,0,0.9)]">
        <div className="hidden sm:flex items-center gap-2 min-w-0">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-slate-300 truncate">
            {isEditMode ? "Ready to update property details" : "Ready to publish new listing"}
          </span>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => router.push("/admin/properties")}
            className="rounded-2xl border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 text-xs font-semibold py-2.5 px-4"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="md"
            disabled={submitting}
            className="flex-1 sm:flex-none rounded-2xl font-bold bg-linear-to-r from-brand-500 via-brand-600 to-accent-500 text-white shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/40 py-2.5 px-6 text-xs sm:text-sm"
          >
            <Save className="h-4 w-4 mr-1.5" />
            {submitting ? "Saving…" : isEditMode ? "Save Changes" : "Create Property"}
          </Button>
        </div>
      </div>
    </form>
  );
}
