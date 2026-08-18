"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, RotateCcw, Check } from "lucide-react";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import Switch from "@/components/ui/Switch";
import Button from "@/components/ui/Button";
import { PROPERTY_CATEGORIES, REGISTRY_STATUSES } from "@/lib/constants";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "area_desc", label: "Area: Largest First" },
];

export default function PropertyFilters({ locationHierarchy = [] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  function currentValue(key, fallback = "") {
    return searchParams.get(key) ?? fallback;
  }

  const [selectedState, setSelectedState] = useState(currentValue("location_state"));
  const [selectedCity, setSelectedCity] = useState(currentValue("location_city"));

  const cityOptions = useMemo(() => {
    return locationHierarchy.find((s) => s.state === selectedState)?.cities || [];
  }, [locationHierarchy, selectedState]);

  const areaOptions = useMemo(() => {
    return cityOptions.find((c) => c.city === selectedCity)?.areas || [];
  }, [cityOptions, selectedCity]);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams();

    for (const [key, value] of formData.entries()) {
      if (value !== "" && value != null) params.set(key, value);
    }

    router.push(`/properties?${params.toString()}`);
    setOpen(false);
  }

  function handleClear() {
    setSelectedState("");
    setSelectedCity("");
    router.push("/properties");
    setOpen(false);
  }

  const fields = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4.5">
      <Select
        name="category"
        label="Category"
        defaultValue={currentValue("category")}
        className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-brand-500 text-xs sm:text-sm"
      >
        <option value="" className="bg-slate-950 text-white">All Categories</option>
        {PROPERTY_CATEGORIES.map((cat) => (
          <option key={cat.value} value={cat.value} className="bg-slate-950 text-white">
            {cat.label}
          </option>
        ))}
      </Select>

      <Select
        name="location_state"
        label="State"
        value={selectedState}
        onChange={(e) => {
          setSelectedState(e.target.value);
          setSelectedCity("");
        }}
        className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-brand-500 text-xs sm:text-sm"
      >
        <option value="" className="bg-slate-950 text-white">All States</option>
        {locationHierarchy.map((s) => (
          <option key={s.state} value={s.state} className="bg-slate-950 text-white">
            {s.state}
          </option>
        ))}
      </Select>

      <Select
        name="location_city"
        label="City"
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
        disabled={!selectedState}
        className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-brand-500 text-xs sm:text-sm disabled:opacity-40"
      >
        <option value="" className="bg-slate-950 text-white">All Cities</option>
        {cityOptions.map((c) => (
          <option key={c.city} value={c.city} className="bg-slate-950 text-white">
            {c.city}
          </option>
        ))}
      </Select>

      <Select
        key={`${selectedState}-${selectedCity}`}
        name="location_area"
        label="Area"
        defaultValue={currentValue("location_area")}
        disabled={!selectedCity}
        className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-brand-500 text-xs sm:text-sm disabled:opacity-40"
      >
        <option value="" className="bg-slate-950 text-white">All Areas</option>
        {areaOptions.map((a) => (
          <option key={a.area} value={a.area} className="bg-slate-950 text-white">
            {a.area} ({a.count})
          </option>
        ))}
      </Select>

      <div className="grid grid-cols-2 gap-3">
        <Input
          type="number"
          name="min_price"
          label="Min Rate/sqft"
          placeholder="0"
          min="0"
          defaultValue={currentValue("min_price")}
          className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-brand-500 text-xs sm:text-sm"
        />
        <Input
          type="number"
          name="max_price"
          label="Max Rate/sqft"
          placeholder="Any"
          min="0"
          defaultValue={currentValue("max_price")}
          className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-brand-500 text-xs sm:text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          type="number"
          name="min_area"
          label="Min Area (sqft)"
          placeholder="0"
          min="0"
          defaultValue={currentValue("min_area")}
          className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-brand-500 text-xs sm:text-sm"
        />
        <Input
          type="number"
          name="max_area"
          label="Max Area (sqft)"
          placeholder="Any"
          min="0"
          defaultValue={currentValue("max_area")}
          className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-brand-500 text-xs sm:text-sm"
        />
      </div>

      <Select
        name="registry_status"
        label="Registry Status"
        defaultValue={currentValue("registry_status")}
        className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-brand-500 text-xs sm:text-sm"
      >
        <option value="" className="bg-slate-950 text-white">Any Status</option>
        {REGISTRY_STATUSES.map((status) => (
          <option key={status.value} value={status.value} className="bg-slate-950 text-white">
            {status.label}
          </option>
        ))}
      </Select>

      <EmiSwitch defaultChecked={currentValue("emi") === "true"} />

      <Select
        name="sort"
        label="Sort Order"
        defaultValue={currentValue("sort", "newest")}
        className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-brand-500 text-xs sm:text-sm"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-950 text-white">
            {opt.label}
          </option>
        ))}
      </Select>

      <div className="flex gap-2.5 pt-3">
        <Button
          type="submit"
          className="flex-1 rounded-2xl font-bold bg-linear-to-r from-brand-500 to-accent-500 py-3 text-xs shadow-md shadow-brand-500/20"
        >
          <Check className="h-4 w-4 mr-1.5" />
          Apply Filters
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleClear}
          className="rounded-2xl border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 text-xs font-semibold py-3 px-4"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      </div>
    </form>
  );

  return (
    <>
      <div className="lg:hidden">
        <Button
          type="button"
          variant="outline"
          size="md"
          className="w-full rounded-2xl border-white/15 bg-slate-900/80 text-white font-bold py-3 shadow-lg"
          onClick={() => setOpen(true)}
        >
          <SlidersHorizontal className="h-4 w-4 mr-2 text-brand-400" />
          Filter &amp; Sort Properties
        </Button>
      </div>

      <div className="hidden rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-2xl p-6 lg:block shadow-xl">
        <h3 className="mb-5 font-display text-lg font-bold text-white bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">
          Filter Listings
        </h3>
        {fields}
      </div>

      {/* Mobile Slide-Over Sidebar Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Dark Backdrop Overlay */}
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
            onClick={() => setOpen(false)}
          />

          {/* Slide-Over Sidebar Container (Opens from Right) */}
          <div className="absolute top-0 right-0 bottom-0 flex h-full w-80 max-w-[85vw] flex-col justify-between overflow-y-auto border-l border-white/10 bg-slate-950 p-5 sm:p-6 shadow-2xl z-10 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex flex-col gap-5 flex-1">
              <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4.5 w-4.5 text-brand-400" />
                  <h3 className="font-display text-base font-bold text-white">Filter Properties</h3>
                </div>
                <button
                  type="button"
                  aria-label="Close filters"
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-white/10 bg-white/5 p-1.5 text-slate-300 hover:bg-white/10 hover:text-white transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {fields}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function EmiSwitch({ defaultChecked }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 p-3">
      <Switch id="emi" checked={checked} onChange={setChecked} label="EMI Available Only" />
      <input type="hidden" name="emi" value={checked ? "true" : ""} />
    </div>
  );
}
