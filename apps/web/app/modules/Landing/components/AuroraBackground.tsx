export function AuroraBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#08080C]" aria-hidden="true">
      {/* Static base gradient — sets the ambient tone, zero cost */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,_rgba(91,122,255,0.12),_transparent)]" />

      {/* Animated accent — single element, no blur filter, GPU-composited via translate3d */}
      <div className="absolute -inset-[10%] animate-aurora-1 opacity-100 [will-change:transform] [transform:translate3d(0,0,0)] bg-[radial-gradient(ellipse_60%_40%_at_40%_30%,_rgba(91,122,232,0.08)_0%,_transparent_70%)]" />

      {/* Secondary warm accent — very subtle */}
      <div className="absolute -inset-[10%] animate-aurora-2 opacity-100 [will-change:transform] [transform:translate3d(0,0,0)] bg-[radial-gradient(ellipse_50%_50%_at_65%_60%,_rgba(255,107,74,0.05)_0%,_transparent_70%)]" />
    </div>
  );
}
