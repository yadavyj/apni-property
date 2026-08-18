"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, Plus, Trash2, HelpCircle } from "lucide-react";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Switch from "@/components/ui/Switch";
import Button from "@/components/ui/Button";
import {
  createHomeFaq,
  updateHomeFaq,
  deleteHomeFaq,
  reorderHomeFaqs,
} from "@/lib/actions/homeFaq.actions";

function emptyFaq(sortOrder) {
  return {
    id: null,
    question: "",
    answer: "",
    is_active: true,
    sort_order: sortOrder,
  };
}

function FaqCard({ faq, index, total, onMove }) {
  const router = useRouter();
  const [form, setForm] = useState(faq);
  const [isPending, startTransition] = useTransition();

  const isNew = !faq.id;

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSave() {
    startTransition(async () => {
      try {
        if (isNew) {
          await createHomeFaq(form);
          toast.success("FAQ created successfully!");
        } else {
          await updateHomeFaq(faq.id, form);
          toast.success("FAQ updated successfully!");
        }
        router.refresh();
      } catch (err) {
        toast.error(err.message || "Failed to save FAQ");
      }
    });
  }

  function handleDelete() {
    if (!faq.id) return;
    if (!window.confirm("Delete this FAQ entry? This action cannot be undone.")) return;

    startTransition(async () => {
      try {
        await deleteHomeFaq(faq.id);
        toast.success("FAQ deleted");
        router.refresh();
      } catch (err) {
        toast.error(err.message || "Failed to delete FAQ");
      }
    });
  }

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/60 p-4 sm:p-6 shadow-xl backdrop-blur-2xl transition-all duration-300 hover:border-emerald-500/30">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            Q{index + 1}
          </span>
          <Switch
            id={`faq-active-${index}`}
            checked={form.is_active}
            onChange={(checked) => setField("is_active", checked)}
            label={form.is_active ? "Active" : "Hidden"}
          />
        </div>

        <div className="flex items-center gap-1.5">
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
          {!isNew && (
            <button
              type="button"
              disabled={isPending}
              onClick={handleDelete}
              className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-1.5 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/40 disabled:opacity-30 transition-colors cursor-pointer"
              aria-label="Delete FAQ"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <Input
        label="Question"
        placeholder="Do you offer registry-ready plots in Gorakhpur?"
        value={form.question}
        onChange={(e) => setField("question", e.target.value)}
        className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-emerald-500 text-xs sm:text-sm font-semibold"
      />
      <Textarea
        label="Answer"
        placeholder="Yes, all our listings undergo rigorous land registry verification..."
        rows={3}
        value={form.answer}
        onChange={(e) => setField("answer", e.target.value)}
        className="bg-slate-950/60 border-white/10 text-white rounded-2xl focus:border-emerald-500 text-xs sm:text-sm"
      />

      <Button
        type="button"
        size="sm"
        className="self-start rounded-2xl font-bold bg-linear-to-r from-emerald-500 via-emerald-600 to-teal-500 shadow-md shadow-emerald-500/20 px-5 py-2"
        disabled={isPending}
        onClick={handleSave}
      >
        {isPending ? "Saving…" : isNew ? "Create FAQ" : "Save Changes"}
      </Button>
    </div>
  );
}

export default function HomeFaqsManager({ faqs = [] }) {
  const router = useRouter();
  const [drafts, setDrafts] = useState([]);
  const [, startTransition] = useTransition();

  const allFaqs = [...faqs, ...drafts];

  function handleAddFaq() {
    setDrafts((d) => [...d, emptyFaq(allFaqs.length)]);
  }

  function handleMove(index, direction) {
    const saved = faqs;
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= saved.length) return;

    const next = [...saved];
    [next[index], next[newIndex]] = [next[newIndex], next[index]];

    startTransition(async () => {
      try {
        await reorderHomeFaqs(next.map((f) => f.id));
        router.refresh();
      } catch (err) {
        toast.error(err.message || "Failed to reorder FAQs");
      }
    });
  }

  return (
    <div className="flex flex-col gap-5 max-w-4xl">
      {allFaqs.length === 0 && (
        <div className="rounded-3xl border border-dashed border-white/15 bg-slate-900/30 p-8 text-center text-sm text-slate-400 flex flex-col items-center gap-2">
          <HelpCircle className="h-8 w-8 text-emerald-400" />
          <p className="font-semibold text-white">No custom FAQs created yet.</p>
          <p className="max-w-md text-xs text-slate-400">
            Click the button below to add custom questions &amp; answers for your landing page accordion.
          </p>
        </div>
      )}

      {allFaqs.map((faq, index) => (
        <FaqCard
          key={faq.id || `draft-${index}`}
          faq={faq}
          index={index}
          total={allFaqs.length}
          onMove={handleMove}
        />
      ))}

      <Button
        type="button"
        variant="outline"
        className="self-start rounded-2xl border-white/15 bg-white/5 hover:bg-white/10 text-white font-bold py-2.5 px-6 shadow-md"
        onClick={handleAddFaq}
      >
        <Plus className="h-4 w-4 mr-2 text-emerald-400" />
        Add FAQ Question
      </Button>
    </div>
  );
}
