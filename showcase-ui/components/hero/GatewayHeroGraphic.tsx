export function GatewayHeroGraphic() {
  return (
    <div className="relative overflow-hidden rounded-clean border border-neon-cyan/25 bg-black/40 p-4 hero-grid">
      <svg viewBox="0 0 720 420" className="h-[280px] w-full">
        <defs>
          <linearGradient id="coreGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(138,242,142,0.95)" />
            <stop offset="100%" stopColor="rgba(125,232,245,0.95)" />
          </linearGradient>
          <linearGradient id="pathGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(138,242,142,0.8)" />
            <stop offset="100%" stopColor="rgba(184,156,255,0.65)" />
          </linearGradient>
        </defs>

        <rect x="20" y="20" width="680" height="380" rx="16" fill="rgba(8,12,16,0.55)" stroke="rgba(125,232,245,0.18)" />

        <circle cx="360" cy="210" r="62" fill="rgba(12,20,28,0.95)" stroke="url(#coreGlow)" strokeWidth="2.5" />
        <circle cx="360" cy="210" r="36" fill="rgba(15,40,28,0.75)" stroke="rgba(138,242,142,0.8)" strokeWidth="1.5" />

        <path d="M150 95 L300 180" stroke="url(#pathGlow)" strokeWidth="2" fill="none" />
        <path d="M150 325 L300 240" stroke="url(#pathGlow)" strokeWidth="2" fill="none" />
        <path d="M570 95 L420 180" stroke="url(#pathGlow)" strokeWidth="2" fill="none" />
        <path d="M570 325 L420 240" stroke="url(#pathGlow)" strokeWidth="2" fill="none" />

        <rect x="70" y="70" width="130" height="50" rx="10" fill="rgba(11,22,29,0.95)" stroke="rgba(125,232,245,0.55)" />
        <rect x="70" y="300" width="130" height="50" rx="10" fill="rgba(11,22,29,0.95)" stroke="rgba(184,156,255,0.55)" />
        <rect x="520" y="70" width="130" height="50" rx="10" fill="rgba(11,22,29,0.95)" stroke="rgba(125,232,245,0.55)" />
        <rect x="520" y="300" width="130" height="50" rx="10" fill="rgba(11,22,29,0.95)" stroke="rgba(184,156,255,0.55)" />

        <text x="95" y="101" fill="#7DE8F5" fontSize="13" className="font-dot">
          SAFETY
        </text>
        <text x="95" y="331" fill="#B89CFF" fontSize="13" className="font-dot">
          ROUTER
        </text>
        <text x="542" y="101" fill="#7DE8F5" fontSize="13" className="font-dot">
          GEMINI
        </text>
        <text x="542" y="331" fill="#B89CFF" fontSize="13" className="font-dot">
          GROQ
        </text>
        <text x="320" y="214" fill="#8AF28E" fontSize="13" className="font-dot">
          GATEWAY CORE
        </text>

        <circle cx="300" cy="180" r="4.5" fill="rgba(138,242,142,0.9)" />
        <circle cx="300" cy="240" r="4.5" fill="rgba(138,242,142,0.9)" />
        <circle cx="420" cy="180" r="4.5" fill="rgba(184,156,255,0.9)" />
        <circle cx="420" cy="240" r="4.5" fill="rgba(184,156,255,0.9)" />
      </svg>
    </div>
  );
}
