export default function GeometricPattern() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="geo-grid" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="80" y2="0" stroke="currentColor" strokeWidth="0.5" opacity="0.09" />
            <line x1="0" y1="0" x2="0" y2="80" stroke="currentColor" strokeWidth="0.5" opacity="0.09" />
          </pattern>

          <pattern id="geo-dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1" fill="currentColor" opacity="0.12" />
          </pattern>

          <pattern id="geo-crosses" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <line x1="37" y1="40" x2="43" y2="40" stroke="currentColor" strokeWidth="0.6" opacity="0.10" />
            <line x1="40" y1="37" x2="40" y2="43" stroke="currentColor" strokeWidth="0.6" opacity="0.10" />
          </pattern>

          <pattern id="geo-diag" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="120" y2="120" stroke="currentColor" strokeWidth="0.4" opacity="0.06" />
            <line x1="120" y1="0" x2="0" y2="120" stroke="currentColor" strokeWidth="0.4" opacity="0.06" />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#geo-grid)" className="text-foreground" />
        <rect width="100%" height="100%" fill="url(#geo-dots)" className="text-foreground" />
        <rect width="100%" height="100%" fill="url(#geo-crosses)" className="text-foreground" />
        <rect width="100%" height="100%" fill="url(#geo-diag)" className="text-foreground" />
      </svg>

      <div className="absolute top-[8%] right-[4%] w-140px h-140px border border-foreground/[0.09] rotate-45" />
      <div className="absolute top-[10%] right-[5.5%] w-[90px] h-[90px] border border-foreground/[0.07] rotate-45" />
      <div className="absolute top-[12%] right-[7%] w-[40px] h-[40px] border border-foreground/[0.05] rotate-45" />

      <div className="absolute bottom-[15%] left-[3%] w-[130px] h-[130px] rounded-full border border-foreground/[0.09]" />
      <div className="absolute bottom-[17%] left-5% w-80px h-80px rounded-full border border-foreground/[0.07]" />
      <div className="absolute bottom-[19%] left-6.5% w-35px h-35px rounded-full border border-foreground/0.05" />

      <div className="absolute top-[45%] right-[6%] w-[1px] h-[120px] bg-foreground/[0.08]" />
      <div className="absolute top-[50%] right-[4%] w-[80px] h-[1px] bg-foreground/[0.07]" />
      <div className="absolute top-[45%] right-[6%] w-[8px] h-[1px] bg-foreground/[0.10]" />
      <div className="absolute top-[45%] right-[5.8%] w-[1px] h-[8px] bg-foreground/[0.10]" />

      <div className="absolute top-[30%] left-[8%] w-[1px] h-[100px] bg-foreground/[0.07]" />
      <div className="absolute top-[33%] left-[6%] w-[60px] h-[1px] bg-foreground/[0.06]" />

      <div
        className="absolute top-[70%] left-[10%] w-0 h-0"
        style={{
          borderLeft: "30px solid transparent",
          borderRight: "30px solid transparent",
          borderBottom: "52px solid transparent",
          filter: "opacity(0.07)",
          borderBottomColor: "hsl(var(--foreground))",
        }}
      />

      <div
        className="absolute top-[25%] right-[12%] w-0 h-0"
        style={{
          borderLeft: "20px solid transparent",
          borderRight: "20px solid transparent",
          borderBottom: "35px solid transparent",
          filter: "opacity(0.06)",
          borderBottomColor: "hsl(var(--foreground))",
        }}
      />

      <div className="absolute top-[60%] left-[2%] w-[100px] h-[100px] border border-foreground/[0.06] rotate-12" />

      <div className="absolute bottom-[8%] right-[8%] w-[60px] h-[60px] rounded-full border border-foreground/[0.07]" />
      <div className="absolute bottom-[6%] right-[15%] w-[40px] h-[40px] border border-foreground/[0.06] rotate-45" />

      <svg className="absolute top-[15%] left-[30%] w-[100px] h-[100px]" viewBox="0 0 100 100" fill="none">
        <rect x="10" y="10" width="80" height="80" stroke="currentColor" strokeWidth="0.5" opacity="0.07" className="text-foreground" />
        <rect x="25" y="25" width="50" height="50" stroke="currentColor" strokeWidth="0.4" opacity="0.05" className="text-foreground" />
        <rect x="40" y="40" width="20" height="20" stroke="currentColor" strokeWidth="0.3" opacity="0.04" className="text-foreground" />
      </svg>

      <svg className="absolute top-[35%] left-[45%] w-[90px] h-[90px]" viewBox="0 0 90 90" fill="none">
        <path d="M15 45 L45 15 L75 45 L45 75 Z" stroke="currentColor" strokeWidth="0.5" opacity="0.07" className="text-foreground" />
        <path d="M30 45 L45 30 L60 45 L45 60 Z" stroke="currentColor" strokeWidth="0.4" opacity="0.05" className="text-foreground" />
      </svg>

      <svg className="absolute top-[55%] left-[35%] w-[80px] h-[80px]" viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="0.5" opacity="0.06" className="text-foreground" />
        <circle cx="40" cy="40" r="20" stroke="currentColor" strokeWidth="0.4" opacity="0.04" className="text-foreground" />
        <line x1="40" y1="5" x2="40" y2="75" stroke="currentColor" strokeWidth="0.3" opacity="0.04" className="text-foreground" />
        <line x1="5" y1="40" x2="75" y2="40" stroke="currentColor" strokeWidth="0.3" opacity="0.04" className="text-foreground" />
      </svg>

      <div className="absolute top-[20%] left-[55%] w-[70px] h-[70px] border border-foreground/[0.06] rotate-30" />

      <div className="absolute top-[50%] left-[22%] w-[1px] h-[80px] bg-foreground/[0.06]" />
      <div className="absolute top-[52%] left-[20%] w-[50px] h-[1px] bg-foreground/[0.05]" />
      <div className="absolute top-[50%] left-[22%] w-[6px] h-[1px] bg-foreground/[0.08]" />
      <div className="absolute top-[50%] left-[21.8%] w-[1px] h-[6px] bg-foreground/[0.08]" />

      <div className="absolute top-[65%] left-[55%] w-[50px] h-[50px] rounded-full border border-foreground/[0.06]" />
      <div className="absolute top-[67%] left-[56.5%] w-[25px] h-[25px] rounded-full border border-foreground/[0.04]" />

      <div
        className="absolute top-[40%] left-[70%] w-0 h-0"
        style={{
          borderLeft: "18px solid transparent",
          borderRight: "18px solid transparent",
          borderBottom: "32px solid transparent",
          filter: "opacity(0.05)",
          borderBottomColor: "hsl(var(--foreground))",
        }}
      />

      <div className="absolute top-[75%] left-[42%] w-[90px] h-[90px] border border-foreground/[0.05] rotate-45" />
      <div className="absolute top-[77%] left-[44%] w-[50px] h-[50px] border border-foreground/[0.04] rotate-45" />

      <svg className="absolute top-[80%] left-[15%] w-[80px] h-[80px]" viewBox="0 0 80 80" fill="none">
        <path d="M10 40 L40 10 L70 40 L40 70 Z" stroke="currentColor" strokeWidth="0.5" opacity="0.07" className="text-foreground" />
        <path d="M25 40 L40 25 L55 40 L40 55 Z" stroke="currentColor" strokeWidth="0.4" opacity="0.05" className="text-foreground" />
      </svg>

      <svg className="absolute top-[5%] left-[40%] w-[60px] h-[60px]" viewBox="0 0 60 60" fill="none">
        <circle cx="30" cy="30" r="25" stroke="currentColor" strokeWidth="0.5" opacity="0.06" className="text-foreground" />
        <line x1="30" y1="5" x2="30" y2="55" stroke="currentColor" strokeWidth="0.3" opacity="0.05" className="text-foreground" />
        <line x1="5" y1="30" x2="55" y2="30" stroke="currentColor" strokeWidth="0.3" opacity="0.05" className="text-foreground" />
      </svg>

      <svg className="absolute top-[10%] left-[65%] w-[70px] h-[70px]" viewBox="0 0 70 70" fill="none">
        <rect x="5" y="5" width="60" height="60" stroke="currentColor" strokeWidth="0.4" opacity="0.06" className="text-foreground" />
        <line x1="5" y1="5" x2="65" y2="65" stroke="currentColor" strokeWidth="0.3" opacity="0.04" className="text-foreground" />
        <line x1="65" y1="5" x2="5" y2="65" stroke="currentColor" strokeWidth="0.3" opacity="0.04" className="text-foreground" />
      </svg>

      <div className="absolute top-[85%] left-[60%] w-[1px] h-[60px] bg-foreground/[0.06]" />
      <div className="absolute top-[88%] left-[58%] w-[50px] h-[1px] bg-foreground/[0.05]" />

      <div className="absolute top-[28%] left-[38%] w-[1px] h-[50px] bg-foreground/[0.05]" />
      <div className="absolute top-[30%] left-[36%] w-[40px] h-[1px] bg-foreground/[0.04]" />
    </div>
  );
}
