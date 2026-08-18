import PropertyForm from "@/components/admin/PropertyForm";

export const metadata = {
  title: "Add Property",
};

export default function NewPropertyPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-black text-white sm:text-3xl tracking-tight">Add Property</h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-400">
          Fill in the details below. You can add photos and videos after saving.
        </p>
      </div>

      <PropertyForm />
    </div>
  );
}
