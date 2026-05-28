export function Logo({ size = 32 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lg1" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="50%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        <path d="M20 4 L36 32 H4 Z" fill="url(#lg1)" opacity="0.95" />
        <path d="M20 12 L31 30 H9 Z" fill="#0F172A" opacity="0.85" />
        <path d="M20 19 L27 30 H13 Z" fill="#FFFFFF" opacity="0.95" />
      </svg>
      <span className="font-extrabold tracking-wider text-brand-ink text-lg">ASTE</span>
    </div>
  );
}
