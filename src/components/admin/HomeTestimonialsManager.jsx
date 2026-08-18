"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import { ChevronDown, ChevronUp, Plus, Star, Trash2, UploadCloud, User, Sparkles } from "lucide-react";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Switch from "@/components/ui/Switch";
import Button from "@/components/ui/Button";
import {
  createHomeTestimonial,
  updateHomeTestimonial,
  deleteHomeTestimonial,
  reorderHomeTestimonials,
} from "@/lib/actions/homeTestimonial.actions";

function emptyTestimonial(sortOrder) {
  return {
    id: null,
    avatar_public_id: null,
    avatar_url: null,
    customer_name: "",
    customer_role: "",
    message: "",
    rating: 5,
    is_active: true,
    sort_order: sortOrder,
  };
}

function StarPicker({ value, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`${n} star${n === 1 ? "" : "s"}`}
          className="text-amber-400 transition-transform hover:scale-110 cursor-pointer"
        >
          <Star className={`h-4.5 w-4.5 ${n <= value ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "fill-transparent opacity-30 text-slate-500"}`} />
        </button>
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial, index, total, onMove }) {
  const router = useRouter();
  const [form, setForm] = useState(testimonial);
  const [isPending, startTransition] = useTransition();

  const isNew = !testimonial.id;

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleUploadSuccess(result) {
    const info = result?.info;
    if (!info) return;
    setForm((f) => ({ ...f, avatar_public_id: info.public_id, avatar_url: info.secure_url }));
    toast.success("Avatar photo uploaded successfully!");
  }

  function handleSave() {
    startTransition(async () => {
      try {
        if (isNew) {
          await createHomeTestimonial(form);
          toast.success("Testimonial created successfully!");
        } else {
          await updateHomeTestimonial(testimonial.id, form);
          toast.success("Testimonial updated successfully!");
        }
        router.refresh();
      } catch (err) {
        toast.error(err.message || "Failed to save testimonial");
      }
    });
  }

  function handleDelete() {
    if (!testimonial.id) return;
    if (!window.confirm("Delete this testimonial? This action cannot be undone.")) return;

    startTransition(async () => {
      try {
        await deleteHomeTestimonial(testimonial.id);
        toast.success("Testimonial deleted");
        router.refresh();
      } catch (err) {
        toast.error(err.message || "Failed to delete testimonial");
      }
    });
  }

  return (
    <div className="grid grid-cols-1 gap-5 rounded-3xl border border-white/10 bg-slate-900/60 p-4 sm:p-6 lg:grid-cols-[200px_1fr] shadow-xl backdrop-blur-2xl transition-all duration-300 hover:border-amber-500/30">
      <div className="flex flex-col items-center gap-3">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-inner">
          {form.avatar_public_id ? (
            <CldImage src={form.avatar_public_id} alt="Avatar preview" fill sizes="96px" className="object-cover" />
          ) : form.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.avatar_url} alt="Avatar preview" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-500">
              <User className="h-8 w-8" />
            </div>
          )}
        </div>

        <CldUploadWidget
          signatureEndpoint="/api/cloudinary/sign"
          options={{ folder: "apni-property/home-testimonials", multiple: false, sources: ["local", "camera"] }}
          onSuccess={handleUploadSuccess}
        >
          {({ open }) => (
            <Button type="button" variant="outline" size="sm" onClick={() => open()} className="border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold rounded-xl w-full justify-center">
              <UploadCloud className="h-3.5 w-3.5 mr-1 text-amber-400" />
              {form.avatar_url ? "Replace Photo" : "Upload Photo"}
            </Button>
          )}
        </CldUploadWidget>

        <div className="flex items-center justify-between gap-2 border-t border-white/10 pt-3 w-full">
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={index === 0 || isPending || isNew}
              onClick={() => onMove(index, -1)}
              className="rounded-xl border border-white/10 bg-white/5 p-1.5 text-slate-300 hover:bg-white/10 disabled:opacity-30 transition-colors"
              aria-label="Move up"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={index === total - 1 || isPending || isNew}
              onClick={() => onMove(index, 1)}
              className="rounded-xl border border-white/10 bg-white/5 p-1.5 text-slate-300 hover:bg-white/10 disabled:opacity-30 transition-colors"
              aria-label="Move down"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          {!isNew && (
            <button
              type="button"
              disabled={isPending}
              onClick={handleDelete}
              className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-1.5 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/40 disabled:opacity-30 transition-colors cursor-pointer"
              aria-label="Delete testimonial"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <Switch
            id={`testimonial-active-${index}`}
            checked={form.is_active}
            onChange={(checked) => setField("is_active", checked)}
            label={form.is_active ? "Active" : "Hidden"}
          />
          <StarPicker value={form.rating} onChange={(n) => setField("rating", n)} />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            label="Customer Name"
            placeholder="Rakesh Yadav"
            value={form.customer_name || ""}
            onChange={(e) => setField("customer_name", e.target.value)}
            className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-amber-500 text-xs sm:text-sm font-semibold"
          />
          <Input
            label="Role / Location (optional)"
            placeholder="Verified Buyer, Ramgarhtal"
            value={form.customer_role || ""}
            onChange={(e) => setField("customer_role", e.target.value)}
            className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-amber-500 text-xs sm:text-sm"
          />
        </div>
        <Textarea
          label="Testimonial Review Message"
          placeholder="Apni Property made buying my plot completely stress-free..."
          rows={3}
          value={form.message || ""}
          onChange={(e) => setField("message", e.target.value)}
          className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-amber-500 text-xs sm:text-sm"
        />

        <Button
          type="button"
          size="sm"
          className="mt-1 self-start rounded-2xl font-bold bg-linear-to-r from-amber-500 via-amber-600 to-orange-500 shadow-md shadow-amber-500/20 px-5 py-2"
          disabled={isPending}
          onClick={handleSave}
        >
          {isPending ? "Saving…" : isNew ? "Create Testimonial" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

export default function HomeTestimonialsManager({ testimonials = [] }) {
  const router = useRouter();
  const [drafts, setDrafts] = useState([]);
  const [, startTransition] = useTransition();

  const all = [...testimonials, ...drafts];

  function handleAdd() {
    setDrafts((d) => [...d, emptyTestimonial(all.length)]);
  }

  function handleMove(index, direction) {
    const saved = testimonials;
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= saved.length) return;

    const next = [...saved];
    [next[index], next[newIndex]] = [next[newIndex], next[index]];

    startTransition(async () => {
      try {
        await reorderHomeTestimonials(next.map((t) => t.id));
        router.refresh();
      } catch (err) {
        toast.error(err.message || "Failed to reorder testimonials");
      }
    });
  }

  return (
    <div className="flex flex-col gap-5 max-w-4xl">
      {all.length === 0 && (
        <div className="rounded-3xl border border-dashed border-white/15 bg-slate-900/30 p-8 text-center text-sm text-slate-400 flex flex-col items-center gap-2">
          <Star className="h-8 w-8 text-amber-400" />
          <p className="font-semibold text-white">No custom customer reviews added yet.</p>
          <p className="max-w-md text-xs text-slate-400">
            Click the button below to add customer photo reviews and star ratings to display on your homepage.
          </p>
        </div>
      )}

      {all.map((testimonial, index) => (
        <TestimonialCard
          key={testimonial.id || `draft-${index}`}
          testimonial={testimonial}
          index={index}
          total={all.length}
          onMove={handleMove}
        />
      ))}

      <Button
        type="button"
        variant="outline"
        className="self-start rounded-2xl border-white/15 bg-white/5 hover:bg-white/10 text-white font-bold py-2.5 px-6 shadow-md"
        onClick={handleAdd}
      >
        <Plus className="h-4 w-4 mr-2 text-amber-400" />
        Add Customer Testimonial
      </Button>
    </div>
  );
}
