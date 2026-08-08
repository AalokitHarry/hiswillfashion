import { whatsappLink } from "@/lib/site";

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink("Hi! I'd like to place an order with His Will Fashion Club.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="ping-ring fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 animate-[pop-in_0.5s_cubic-bezier(0.34,1.56,0.64,1)_0.8s_both] items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform duration-200 hover:scale-110 active:scale-95"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
        <path d="M12.04 2c-5.5 0-10 4.5-10 10 0 1.77.46 3.45 1.28 4.9L2 22l5.25-1.37A9.96 9.96 0 0012.04 22c5.5 0 10-4.5 10-10s-4.5-10-10-10zm5.86 14.3c-.25.7-1.24 1.28-2.02 1.45-.55.11-1.26.2-3.66-.78-3.08-1.27-5.06-4.35-5.21-4.55-.15-.2-1.24-1.65-1.24-3.15 0-1.5.78-2.23 1.06-2.54.28-.31.6-.38.8-.38h.58c.19 0 .44-.07.68.53.25.6.85 2.08.92 2.24.07.15.12.33.02.53-.1.2-.15.33-.3.5-.15.18-.32.4-.45.53-.15.15-.31.32-.14.62.18.31.79 1.31 1.7 2.13 1.17 1.06 2.15 1.39 2.46 1.55.31.15.49.13.67-.08.19-.2.79-.9 1-1.22.21-.31.42-.26.7-.15.28.1 1.79.85 2.1 1 .3.15.5.23.58.36.08.13.08.75-.18 1.45z" />
      </svg>
    </a>
  );
}
