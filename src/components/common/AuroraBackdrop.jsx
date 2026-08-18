// Fixed, page-wide ambient light. Sits behind everything (-z-10) so each
// section can stay mostly transparent and let this glow through, instead of
// every section painting its own blobs.
export default function AuroraBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="aurora-blob absolute -left-32 -top-32 h-[26rem] w-[26rem] rounded-full bg-brand-500/12 blur-[90px] sm:-left-40 sm:-top-40 sm:h-[45rem] sm:w-[45rem] sm:blur-[140px]" />
      <div
        className="aurora-blob absolute -right-32 top-1/4 h-[25rem] w-[25rem] rounded-full bg-blue-500/10 blur-[90px] sm:-right-40 sm:h-[40rem] sm:w-[40rem] sm:blur-[140px]"
        style={{ animationDelay: "-7s" }}
      />
      <div
        className="aurora-blob absolute -bottom-32 left-1/3 h-[26rem] w-[26rem] rounded-full bg-fuchsia-500/8 blur-[95px] sm:-bottom-40 sm:h-[42rem] sm:w-[42rem] sm:blur-[150px]"
        style={{ animationDelay: "-14s" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:32px_32px]" />
    </div>
  );
}
