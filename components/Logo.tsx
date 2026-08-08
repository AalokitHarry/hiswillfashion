export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M24 3c2.4 2.4 5.7 3.7 9.2 3.7v10.8c0 9-5.4 15.2-9.2 17.5-3.8-2.3-9.2-8.5-9.2-17.5V6.7C18.3 6.7 21.6 5.4 24 3z"
        fill="var(--navy)"
      />
      <path
        d="M24 3c2.4 2.4 5.7 3.7 9.2 3.7v10.8c0 9-5.4 15.2-9.2 17.5V3z"
        fill="var(--navy-deep)"
      />
      <path
        d="M24 3c2.4 2.4 5.7 3.7 9.2 3.7v10.8c0 9-5.4 15.2-9.2 17.5-3.8-2.3-9.2-8.5-9.2-17.5V6.7C18.3 6.7 21.6 5.4 24 3z"
        stroke="var(--gold)"
        strokeWidth="1.1"
      />
      <path
        d="M24 12v17M17.5 17h13"
        stroke="var(--gold-pale)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark />
      <span className="leading-tight">
        <span className="block font-display text-[1.05rem] font-semibold tracking-tight text-navy">
          His Will
        </span>
        <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-gold">
          Fashion Club
        </span>
      </span>
    </span>
  );
}
