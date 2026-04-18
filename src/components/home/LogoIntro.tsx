import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Props {
  onAnimationComplete?: () => void;
}

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export default function LogoIntro({ onAnimationComplete }: Props) {
  const [cursorGlow, setCursorGlow] = useState({
    x: 0,
    y: 0,
    active: false,
  });

  useEffect(() => {
    const completeTimer = setTimeout(() => {
      onAnimationComplete?.();
    }, 10500);
    return () => {
      clearTimeout(completeTimer);
    };
  }, [onAnimationComplete]);

  return (
    <section
      className="relative w-full min-h-dvh flex items-center justify-center overflow-hidden"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setCursorGlow({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
          active: true,
        });
      }}
      onMouseEnter={() => setCursorGlow((prev) => ({ ...prev, active: true }))}
      onMouseLeave={() => setCursorGlow((prev) => ({ ...prev, active: false }))}
      style={{
        background: `
          radial-gradient(ellipse 75% 55% at 14% 22%, hsl(34 52% 86% / 0.52) 0%, transparent 56%),
          radial-gradient(ellipse 62% 58% at 86% 78%, hsl(40 35% 86% / 0.34) 0%, transparent 56%),
          hsl(38 42% 92%)
        `,
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "256px 256px",
        }}
      />

      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{
          opacity: 0.9,
          filter: "brightness(1.02) saturate(0.98)",
        }}
        animate={{
          opacity: 0.1,
          filter: "brightness(0.74) saturate(0.78)",
        }}
        transition={{ duration: 8.6, ease: "easeOut" }}
      >
        <ArchitectureAnimation />
      </motion.div>

      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: cursorGlow.active ? 1 : 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        style={{
          clipPath: `circle(135px at ${cursorGlow.x}px ${cursorGlow.y}px)`,
          WebkitClipPath: `circle(135px at ${cursorGlow.x}px ${cursorGlow.y}px)`,
          filter: "brightness(1.36) contrast(1.22) saturate(1.08)",
        }}
      >
        <ArchitectureAnimation />
      </motion.div>

      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: cursorGlow.active ? 1 : 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div
          className="absolute pointer-events-none"
          style={{
            width: "220px",
            height: "220px",
            left: `${cursorGlow.x - 110}px`,
            top: `${cursorGlow.y - 110}px`,
            borderRadius: "9999px",
            background:
              "radial-gradient(circle, hsl(36 68% 82% / 0.2) 0%, hsl(36 64% 80% / 0.08) 42%, transparent 72%)",
            filter: "blur(8px)",
          }}
        />
      </motion.div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          initial={{ left: "-80%", opacity: 0 }}
          animate={{ left: ["-80%", "180%"], opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 1.5,
            ease: [0.25, 1, 0.5, 1],
            delay: 9,
            times: [0, 0.05, 0.9, 1],
          }}
          style={{
            position: "absolute",
            top: "-20%",
            left: "-80%",
            width: "45%",
            height: "140%",
            background:
              "linear-gradient(100deg, transparent 0%, rgba(0,0,0,0.04) 40%, rgba(0,0,0,0.09) 50%, rgba(0,0,0,0.04) 60%, transparent 100%)",
            transform: "skewX(-18deg)",
          }}
        />
      </div>

      <div
        className="relative hidden sm:flex items-center z-10"
        style={{ gap: "clamp(20px, 3vw, 40px)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE_OUT, delay: 0.5 }}
        >
          <motion.div
            animate={{ scale: [1, 1.006, 1, 1.006, 1] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: 6,
              ease: "easeInOut",
            }}
          >
            <img
              src="/logo-icon.png"
              alt="RayTrace Icon"
              draggable={false}
              style={{
                height: "clamp(100px, 14vw, 180px)",
                width: "auto",
                display: "block",
                userSelect: "none",
              }}
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.4, ease: EASE_OUT, delay: 1.8 }}
        >
          <motion.div
            animate={{ scale: [1, 1.006, 1, 1.006, 1] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: 6,
              ease: "easeInOut",
            }}
          >
            <img
              src="/logo-text.png"
              alt="RayTrace Design Studio"
              draggable={false}
              style={{
                height: "clamp(80px, 11vw, 140px)",
                width: "auto",
                display: "block",
                userSelect: "none",
              }}
            />
          </motion.div>
        </motion.div>
      </div>

      <div className="relative flex sm:hidden flex-col items-center gap-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE_OUT, delay: 0.5 }}
        >
          <img
            src="/logo-icon.png"
            alt="RayTrace Icon"
            draggable={false}
            style={{
              height: "clamp(80px, 22vw, 110px)",
              width: "auto",
              display: "block",
              userSelect: "none",
            }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE_OUT, delay: 1.8 }}
        >
          <img
            src="/logo-text.png"
            alt="RayTrace Design Studio"
            draggable={false}
            style={{
              height: "clamp(60px, 16vw, 90px)",
              width: "auto",
              display: "block",
              userSelect: "none",
            }}
          />
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 10.5, duration: 0.8 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-black/20 flex items-start justify-center pt-2"
        >
          <motion.div className="w-1 h-2 rounded-full bg-black/30" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function ArchitectureAnimation() {
  const c = "hsl(var(--foreground))";
  const W = 0.22;
  const M = 0.16;
  const S = 0.1;

  const draw = (d: number, dur = 2.5) => ({
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: W },
    transition: { duration: dur, delay: d, ease: EASE_OUT },
  });
  const drawM = (d: number, dur = 2) => ({
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: M },
    transition: { duration: dur, delay: d, ease: EASE_OUT },
  });
  const fade = (d: number, o = S) => ({
    initial: { opacity: 0 },
    animate: { opacity: o },
    transition: { duration: 1.5, delay: d, ease: EASE_OUT },
  });

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <pattern
            id="h45"
            x="0"
            y="0"
            width="5"
            height="5"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="5"
              stroke={c}
              strokeWidth="0.8"
              opacity="0.3"
            />
          </pattern>
          <pattern
            id="h135"
            x="0"
            y="0"
            width="5"
            height="5"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="5"
              stroke={c}
              strokeWidth="0.5"
              opacity="0.18"
            />
          </pattern>
          <pattern
            id="bgrid"
            x="0"
            y="0"
            width="30"
            height="30"
            patternUnits="userSpaceOnUse"
          >
            <line
              x1="0"
              y1="0"
              x2="30"
              y2="0"
              stroke={c}
              strokeWidth="0.15"
              opacity="0.06"
            />
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="30"
              stroke={c}
              strokeWidth="0.15"
              opacity="0.06"
            />
          </pattern>
        </defs>

        <motion.rect
          width="1200"
          height="800"
          fill="url(#bgrid)"
          {...fade(0, 0.08)}
        />

        <g transform="translate(600, 400) scale(1.25) translate(-600, -400) translate(110, 20)">
          {/* OUTER BORDER */}
          <motion.rect
            x="80"
            y="60"
            width="820"
            height="560"
            stroke={c}
            strokeWidth="2"
            {...draw(0.2, 3)}
          />
          <motion.rect
            x="83"
            y="63"
            width="814"
            height="554"
            stroke={c}
            strokeWidth="0.4"
            {...drawM(0.3)}
          />

          {/* EXTERIOR WALL HATCHING */}
          <motion.rect
            x="80"
            y="60"
            width="820"
            height="14"
            fill="url(#h45)"
            {...fade(0.4, M)}
          />
          <motion.line
            x1="80"
            y1="74"
            x2="900"
            y2="74"
            stroke={c}
            strokeWidth="1"
            {...draw(0.3)}
          />
          <motion.rect
            x="80"
            y="606"
            width="820"
            height="14"
            fill="url(#h45)"
            {...fade(0.4, M)}
          />
          <motion.line
            x1="80"
            y1="606"
            x2="900"
            y2="606"
            stroke={c}
            strokeWidth="1"
            {...draw(0.3)}
          />
          <motion.rect
            x="80"
            y="60"
            width="14"
            height="560"
            fill="url(#h45)"
            {...fade(0.4, M)}
          />
          <motion.line
            x1="94"
            y1="60"
            x2="94"
            y2="620"
            stroke={c}
            strokeWidth="1"
            {...draw(0.3)}
          />
          <motion.rect
            x="886"
            y="60"
            width="14"
            height="560"
            fill="url(#h45)"
            {...fade(0.4, M)}
          />
          <motion.line
            x1="886"
            y1="60"
            x2="886"
            y2="620"
            stroke={c}
            strokeWidth="1"
            {...draw(0.3)}
          />

          {/* INTERIOR WALLS */}
          <motion.rect
            x="94"
            y="328"
            width="792"
            height="12"
            fill="url(#h135)"
            {...fade(0.6, M)}
          />
          <motion.line
            x1="94"
            y1="328"
            x2="886"
            y2="328"
            stroke={c}
            strokeWidth="0.7"
            {...draw(0.5)}
          />
          <motion.line
            x1="94"
            y1="340"
            x2="886"
            y2="340"
            stroke={c}
            strokeWidth="0.7"
            {...draw(0.5)}
          />

          <motion.rect
            x="340"
            y="74"
            width="12"
            height="254"
            fill="url(#h135)"
            {...fade(0.6, M)}
          />
          <motion.line
            x1="340"
            y1="74"
            x2="340"
            y2="328"
            stroke={c}
            strokeWidth="0.7"
            {...draw(0.6)}
          />
          <motion.line
            x1="352"
            y1="74"
            x2="352"
            y2="328"
            stroke={c}
            strokeWidth="0.7"
            {...draw(0.6)}
          />

          <motion.rect
            x="620"
            y="74"
            width="12"
            height="254"
            fill="url(#h135)"
            {...fade(0.6, M)}
          />
          <motion.line
            x1="620"
            y1="74"
            x2="620"
            y2="328"
            stroke={c}
            strokeWidth="0.7"
            {...draw(0.6)}
          />
          <motion.line
            x1="632"
            y1="74"
            x2="632"
            y2="328"
            stroke={c}
            strokeWidth="0.7"
            {...draw(0.6)}
          />

          <motion.rect
            x="340"
            y="340"
            width="12"
            height="266"
            fill="url(#h135)"
            {...fade(0.7, M)}
          />
          <motion.line
            x1="340"
            y1="340"
            x2="340"
            y2="606"
            stroke={c}
            strokeWidth="0.7"
            {...draw(0.7)}
          />
          <motion.line
            x1="352"
            y1="340"
            x2="352"
            y2="606"
            stroke={c}
            strokeWidth="0.7"
            {...draw(0.7)}
          />

          <motion.rect
            x="570"
            y="340"
            width="12"
            height="266"
            fill="url(#h135)"
            {...fade(0.7, M)}
          />
          <motion.line
            x1="570"
            y1="340"
            x2="570"
            y2="606"
            stroke={c}
            strokeWidth="0.7"
            {...draw(0.7)}
          />
          <motion.line
            x1="582"
            y1="340"
            x2="582"
            y2="606"
            stroke={c}
            strokeWidth="0.7"
            {...draw(0.7)}
          />

          <motion.rect
            x="94"
            y="205"
            width="246"
            height="10"
            fill="url(#h135)"
            {...fade(0.7, M)}
          />
          <motion.line
            x1="94"
            y1="205"
            x2="340"
            y2="205"
            stroke={c}
            strokeWidth="0.5"
            {...drawM(0.7)}
          />
          <motion.line
            x1="94"
            y1="215"
            x2="340"
            y2="215"
            stroke={c}
            strokeWidth="0.5"
            {...drawM(0.7)}
          />

          <motion.rect
            x="582"
            y="480"
            width="304"
            height="10"
            fill="url(#h135)"
            {...fade(0.8, M)}
          />
          <motion.line
            x1="582"
            y1="480"
            x2="886"
            y2="480"
            stroke={c}
            strokeWidth="0.5"
            {...drawM(0.8)}
          />
          <motion.line
            x1="582"
            y1="490"
            x2="886"
            y2="490"
            stroke={c}
            strokeWidth="0.5"
            {...drawM(0.8)}
          />

          {/* DOOR SWINGS */}
          <motion.path
            d="M 340 160 A 35 35 0 0 0 305 125"
            stroke={c}
            strokeWidth="0.4"
            fill="none"
            strokeDasharray="2 1"
            {...drawM(1.3)}
          />
          <motion.path
            d="M 352 175 A 35 35 0 0 1 387 140"
            stroke={c}
            strokeWidth="0.4"
            fill="none"
            strokeDasharray="2 1"
            {...drawM(1.4)}
          />
          <motion.path
            d="M 620 160 A 35 35 0 0 0 585 125"
            stroke={c}
            strokeWidth="0.4"
            fill="none"
            strokeDasharray="2 1"
            {...drawM(1.5)}
          />
          <motion.path
            d="M 570 425 A 30 30 0 0 1 600 395"
            stroke={c}
            strokeWidth="0.4"
            fill="none"
            strokeDasharray="2 1"
            {...drawM(1.6)}
          />
          <motion.path
            d="M 340 505 A 30 30 0 0 0 310 475"
            stroke={c}
            strokeWidth="0.4"
            fill="none"
            strokeDasharray="2 1"
            {...drawM(1.7)}
          />

          {/* ROOM LABELS */}
          <motion.text
            x="215"
            y="145"
            textAnchor="middle"
            fontSize="10"
            fontFamily="monospace"
            letterSpacing="2"
            fill={c}
            {...fade(1.2, M)}
          >
            KITCHEN
          </motion.text>
          <motion.text
            x="215"
            y="160"
            textAnchor="middle"
            fontSize="6"
            fontFamily="monospace"
            fill={c}
            {...fade(1.3, S)}
          >
            15.2 m²
          </motion.text>
          <motion.text
            x="490"
            y="195"
            textAnchor="middle"
            fontSize="10"
            fontFamily="monospace"
            letterSpacing="2"
            fill={c}
            {...fade(1.2, M)}
          >
            LIVING ROOM
          </motion.text>
          <motion.text
            x="490"
            y="210"
            textAnchor="middle"
            fontSize="6"
            fontFamily="monospace"
            fill={c}
            {...fade(1.3, S)}
          >
            28.4 m²
          </motion.text>
          <motion.text
            x="755"
            y="195"
            textAnchor="middle"
            fontSize="10"
            fontFamily="monospace"
            letterSpacing="2"
            fill={c}
            {...fade(1.3, M)}
          >
            DINING
          </motion.text>
          <motion.text
            x="755"
            y="210"
            textAnchor="middle"
            fontSize="6"
            fontFamily="monospace"
            fill={c}
            {...fade(1.4, S)}
          >
            18.6 m²
          </motion.text>
          <motion.text
            x="215"
            y="280"
            textAnchor="middle"
            fontSize="9"
            fontFamily="monospace"
            letterSpacing="2"
            fill={c}
            {...fade(1.3, M)}
          >
            BATH
          </motion.text>
          <motion.text
            x="215"
            y="295"
            textAnchor="middle"
            fontSize="6"
            fontFamily="monospace"
            fill={c}
            {...fade(1.4, S)}
          >
            6.8 m²
          </motion.text>
          <motion.text
            x="215"
            y="470"
            textAnchor="middle"
            fontSize="10"
            fontFamily="monospace"
            letterSpacing="2"
            fill={c}
            {...fade(1.4, M)}
          >
            MASTER BED
          </motion.text>
          <motion.text
            x="215"
            y="485"
            textAnchor="middle"
            fontSize="6"
            fontFamily="monospace"
            fill={c}
            {...fade(1.5, S)}
          >
            22.5 m²
          </motion.text>
          <motion.text
            x="460"
            y="470"
            textAnchor="middle"
            fontSize="10"
            fontFamily="monospace"
            letterSpacing="2"
            fill={c}
            {...fade(1.4, M)}
          >
            BEDROOM 2
          </motion.text>
          <motion.text
            x="460"
            y="485"
            textAnchor="middle"
            fontSize="6"
            fontFamily="monospace"
            fill={c}
            {...fade(1.5, S)}
          >
            14.2 m²
          </motion.text>
          <motion.text
            x="735"
            y="420"
            textAnchor="middle"
            fontSize="10"
            fontFamily="monospace"
            letterSpacing="2"
            fill={c}
            {...fade(1.5, M)}
          >
            STUDY
          </motion.text>
          <motion.text
            x="735"
            y="550"
            textAnchor="middle"
            fontSize="9"
            fontFamily="monospace"
            letterSpacing="2"
            fill={c}
            {...fade(1.5, M)}
          >
            BALCONY
          </motion.text>

          {/* KITCHEN FIXTURES */}
          <motion.rect
            x="100"
            y="80"
            width="230"
            height="18"
            stroke={c}
            strokeWidth="0.5"
            fill="url(#h45)"
            {...fade(1.8, S)}
          />
          <motion.rect
            x="140"
            y="84"
            width="22"
            height="10"
            rx="3"
            stroke={c}
            strokeWidth="0.35"
            {...fade(1.9, S)}
          />
          <motion.rect
            x="168"
            y="84"
            width="22"
            height="10"
            rx="3"
            stroke={c}
            strokeWidth="0.35"
            {...fade(1.9, S)}
          />
          <motion.circle
            cx="245"
            cy="89"
            r="6"
            stroke={c}
            strokeWidth="0.35"
            {...fade(2, S)}
          />
          <motion.circle
            cx="245"
            cy="89"
            r="3"
            stroke={c}
            strokeWidth="0.2"
            {...fade(2, S)}
          />
          <motion.circle
            cx="263"
            cy="89"
            r="6"
            stroke={c}
            strokeWidth="0.35"
            {...fade(2, S)}
          />
          <motion.circle
            cx="263"
            cy="89"
            r="3"
            stroke={c}
            strokeWidth="0.2"
            {...fade(2, S)}
          />
          <motion.circle
            cx="281"
            cy="89"
            r="6"
            stroke={c}
            strokeWidth="0.35"
            {...fade(2.1, S)}
          />
          <motion.circle
            cx="281"
            cy="89"
            r="3"
            stroke={c}
            strokeWidth="0.2"
            {...fade(2.1, S)}
          />
          <motion.circle
            cx="299"
            cy="89"
            r="6"
            stroke={c}
            strokeWidth="0.35"
            {...fade(2.1, S)}
          />
          <motion.circle
            cx="299"
            cy="89"
            r="3"
            stroke={c}
            strokeWidth="0.2"
            {...fade(2.1, S)}
          />
          <motion.rect
            x="100"
            y="102"
            width="35"
            height="45"
            stroke={c}
            strokeWidth="0.4"
            {...fade(1.9, S)}
          />
          <motion.line
            x1="100"
            y1="124"
            x2="135"
            y2="124"
            stroke={c}
            strokeWidth="0.25"
            {...fade(2, S)}
          />
          <motion.rect
            x="160"
            y="120"
            width="80"
            height="40"
            rx="2"
            stroke={c}
            strokeWidth="0.4"
            {...fade(1.8, S)}
          />

          {/* LIVING ROOM */}
          <motion.path
            d="M 380 245 L 380 315 L 590 315 L 590 285 L 410 285 L 410 245 Z"
            stroke={c}
            strokeWidth="0.45"
            fill="none"
            {...fade(1.6, S)}
          />
          <motion.rect
            x="440"
            y="245"
            width="60"
            height="30"
            rx="3"
            stroke={c}
            strokeWidth="0.35"
            {...fade(1.7, S)}
          />
          <motion.rect
            x="360"
            y="80"
            width="250"
            height="8"
            stroke={c}
            strokeWidth="0.35"
            {...fade(1.7, S)}
          />
          <motion.rect
            x="410"
            y="225"
            width="160"
            height="100"
            rx="4"
            stroke={c}
            strokeWidth="0.25"
            strokeDasharray="4 3"
            fill="none"
            {...fade(1.5, S)}
          />

          {/* DINING */}
          <motion.rect
            x="690"
            y="125"
            width="100"
            height="55"
            rx="4"
            stroke={c}
            strokeWidth="0.4"
            {...fade(1.6, S)}
          />
          {[0, 1, 2, 3].map((i) => (
            <motion.rect
              key={`ch-t-${i}`}
              x={700 + i * 24}
              y="115"
              width="14"
              height="8"
              rx="2"
              stroke={c}
              strokeWidth="0.25"
              {...fade(1.8 + i * 0.05, S)}
            />
          ))}
          {[0, 1, 2, 3].map((i) => (
            <motion.rect
              key={`ch-b-${i}`}
              x={700 + i * 24}
              y="183"
              width="14"
              height="8"
              rx="2"
              stroke={c}
              strokeWidth="0.25"
              {...fade(1.8 + i * 0.05, S)}
            />
          ))}
          <motion.rect
            x="682"
            y="140"
            width="8"
            height="14"
            rx="2"
            stroke={c}
            strokeWidth="0.25"
            {...fade(1.9, S)}
          />
          <motion.rect
            x="790"
            y="140"
            width="8"
            height="14"
            rx="2"
            stroke={c}
            strokeWidth="0.25"
            {...fade(1.9, S)}
          />

          {/* BATHROOM */}
          <motion.rect
            x="105"
            y="220"
            width="80"
            height="35"
            rx="8"
            stroke={c}
            strokeWidth="0.4"
            {...fade(1.7, S)}
          />
          <motion.rect
            x="112"
            y="225"
            width="66"
            height="25"
            rx="5"
            stroke={c}
            strokeWidth="0.25"
            {...fade(1.8, S)}
          />
          <motion.rect
            x="215"
            y="223"
            width="20"
            height="12"
            rx="2"
            stroke={c}
            strokeWidth="0.35"
            {...fade(1.8, S)}
          />
          <motion.ellipse
            cx="225"
            cy="250"
            rx="12"
            ry="15"
            stroke={c}
            strokeWidth="0.35"
            fill="none"
            {...fade(1.8, S)}
          />
          <motion.circle
            cx="275"
            cy="230"
            r="10"
            stroke={c}
            strokeWidth="0.35"
            {...fade(1.9, S)}
          />
          <motion.circle
            cx="275"
            cy="230"
            r="4"
            stroke={c}
            strokeWidth="0.2"
            {...fade(2, S)}
          />

          {/* MASTER BEDROOM */}
          <motion.rect
            x="135"
            y="385"
            width="100"
            height="130"
            stroke={c}
            strokeWidth="0.45"
            {...fade(1.6, S)}
          />
          <motion.line
            x1="135"
            y1="385"
            x2="235"
            y2="515"
            stroke={c}
            strokeWidth="0.15"
            {...fade(1.8, S)}
          />
          <motion.line
            x1="235"
            y1="385"
            x2="135"
            y2="515"
            stroke={c}
            strokeWidth="0.15"
            {...fade(1.8, S)}
          />
          <motion.rect
            x="145"
            y="390"
            width="35"
            height="18"
            rx="4"
            stroke={c}
            strokeWidth="0.25"
            {...fade(1.9, S)}
          />
          <motion.rect
            x="190"
            y="390"
            width="35"
            height="18"
            rx="4"
            stroke={c}
            strokeWidth="0.25"
            {...fade(1.9, S)}
          />
          <motion.rect
            x="110"
            y="425"
            width="20"
            height="20"
            stroke={c}
            strokeWidth="0.25"
            {...fade(2, S)}
          />
          <motion.rect
            x="240"
            y="425"
            width="20"
            height="20"
            stroke={c}
            strokeWidth="0.25"
            {...fade(2, S)}
          />
          <motion.rect
            x="110"
            y="555"
            width="120"
            height="18"
            fill="url(#h45)"
            stroke={c}
            strokeWidth="0.35"
            {...fade(1.7, S)}
          />

          {/* BEDROOM 2 */}
          <motion.rect
            x="380"
            y="400"
            width="80"
            height="110"
            stroke={c}
            strokeWidth="0.45"
            {...fade(1.6, S)}
          />
          <motion.line
            x1="380"
            y1="400"
            x2="460"
            y2="510"
            stroke={c}
            strokeWidth="0.15"
            {...fade(1.8, S)}
          />
          <motion.line
            x1="460"
            y1="400"
            x2="380"
            y2="510"
            stroke={c}
            strokeWidth="0.15"
            {...fade(1.8, S)}
          />
          <motion.rect
            x="480"
            y="365"
            width="60"
            height="22"
            stroke={c}
            strokeWidth="0.25"
            {...fade(1.8, S)}
          />
          <motion.rect
            x="500"
            y="390"
            width="18"
            height="18"
            rx="9"
            stroke={c}
            strokeWidth="0.25"
            {...fade(1.9, S)}
          />

          {/* STUDY */}
          <motion.rect
            x="660"
            y="365"
            width="80"
            height="40"
            stroke={c}
            strokeWidth="0.35"
            {...fade(1.7, S)}
          />
          <motion.rect
            x="690"
            y="410"
            width="18"
            height="18"
            rx="9"
            stroke={c}
            strokeWidth="0.25"
            {...fade(1.8, S)}
          />
          <motion.rect
            x="830"
            y="355"
            width="12"
            height="120"
            fill="url(#h45)"
            stroke={c}
            strokeWidth="0.25"
            {...fade(1.7, S)}
          />

          {/* WINDOWS */}
          {[
            { x1: 490, y1: 60, x2: 570, y2: 60 },
            { x1: 710, y1: 60, x2: 810, y2: 60 },
          ].map((w, i) => (
            <motion.g key={`win-t-${i}`}>
              <motion.line
                x1={w.x1}
                y1={w.y1}
                x2={w.x2}
                y2={w.y2}
                stroke={c}
                strokeWidth="1.2"
                {...draw(0.9 + i * 0.1)}
              />
              <motion.line
                x1={w.x1}
                y1={w.y1 + 4}
                x2={w.x2}
                y2={w.y2 + 4}
                stroke={c}
                strokeWidth="0.3"
                {...drawM(1 + i * 0.1)}
              />
              <motion.line
                x1={w.x1}
                y1={w.y1 + 8}
                x2={w.x2}
                y2={w.y2 + 8}
                stroke={c}
                strokeWidth="0.3"
                {...drawM(1 + i * 0.1)}
              />
            </motion.g>
          ))}
          <motion.line
            x1="886"
            y1="145"
            x2="886"
            y2="265"
            stroke={c}
            strokeWidth="1.2"
            {...draw(1)}
          />
          <motion.line
            x1="80"
            y1="385"
            x2="80"
            y2="485"
            stroke={c}
            strokeWidth="1.2"
            {...draw(1)}
          />
          <motion.line
            x1="690"
            y1="606"
            x2="790"
            y2="606"
            stroke={c}
            strokeWidth="1.2"
            {...draw(1.1)}
          />

          {/* STAIRS */}
          <motion.g {...fade(2, S)}>
            <motion.rect
              x="635"
              y="245"
              width="60"
              height="80"
              stroke={c}
              strokeWidth="0.35"
              fill="none"
            />
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <motion.line
                key={`s-${i}`}
                x1="635"
                y1={253 + i * 9}
                x2="695"
                y2={253 + i * 9}
                stroke={c}
                strokeWidth="0.25"
              />
            ))}
            <motion.polygon
              points="665,250 660,265 670,265"
              fill={c}
              opacity="0.15"
            />
          </motion.g>

          {/* COMPASS ROSE */}
          <motion.g {...fade(2.5, M)}>
            <motion.circle
              cx="840"
              cy="285"
              r="25"
              stroke={c}
              strokeWidth="0.4"
              fill="none"
            />
            <motion.circle
              cx="840"
              cy="285"
              r="18"
              stroke={c}
              strokeWidth="0.2"
              fill="none"
            />
            <motion.line
              x1="840"
              y1="260"
              x2="840"
              y2="310"
              stroke={c}
              strokeWidth="0.35"
            />
            <motion.line
              x1="815"
              y1="285"
              x2="865"
              y2="285"
              stroke={c}
              strokeWidth="0.35"
            />
            <motion.line
              x1="823"
              y1="268"
              x2="857"
              y2="302"
              stroke={c}
              strokeWidth="0.15"
            />
            <motion.line
              x1="857"
              y1="268"
              x2="823"
              y2="302"
              stroke={c}
              strokeWidth="0.15"
            />
            <motion.polygon
              points="840,259 836,270 844,270"
              fill={c}
              opacity="0.25"
            />
            <motion.text
              x="840"
              y="255"
              textAnchor="middle"
              fontSize="7"
              fontFamily="monospace"
              fontWeight="bold"
              fill={c}
            >
              N
            </motion.text>
          </motion.g>

          {/* DIMENSION LINES - TOP */}
          <motion.g {...fade(3, S)}>
            <motion.line
              x1="80"
              y1="40"
              x2="340"
              y2="40"
              stroke={c}
              strokeWidth="0.35"
            />
            <motion.line
              x1="80"
              y1="35"
              x2="80"
              y2="45"
              stroke={c}
              strokeWidth="0.25"
            />
            <motion.line
              x1="340"
              y1="35"
              x2="340"
              y2="45"
              stroke={c}
              strokeWidth="0.25"
            />
            <motion.text
              x="210"
              y="36"
              textAnchor="middle"
              fontSize="6"
              fontFamily="monospace"
              fill={c}
            >
              293
            </motion.text>
          </motion.g>
          <motion.g {...fade(3, S)}>
            <motion.line
              x1="352"
              y1="40"
              x2="620"
              y2="40"
              stroke={c}
              strokeWidth="0.35"
            />
            <motion.line
              x1="352"
              y1="35"
              x2="352"
              y2="45"
              stroke={c}
              strokeWidth="0.25"
            />
            <motion.line
              x1="620"
              y1="35"
              x2="620"
              y2="45"
              stroke={c}
              strokeWidth="0.25"
            />
            <motion.text
              x="486"
              y="36"
              textAnchor="middle"
              fontSize="6"
              fontFamily="monospace"
              fill={c}
            >
              278
            </motion.text>
          </motion.g>
          <motion.g {...fade(3, S)}>
            <motion.line
              x1="632"
              y1="40"
              x2="900"
              y2="40"
              stroke={c}
              strokeWidth="0.35"
            />
            <motion.line
              x1="632"
              y1="35"
              x2="632"
              y2="45"
              stroke={c}
              strokeWidth="0.25"
            />
            <motion.line
              x1="900"
              y1="35"
              x2="900"
              y2="45"
              stroke={c}
              strokeWidth="0.25"
            />
            <motion.text
              x="766"
              y="36"
              textAnchor="middle"
              fontSize="6"
              fontFamily="monospace"
              fill={c}
            >
              227
            </motion.text>
          </motion.g>
          <motion.g {...fade(3.2, S)}>
            <motion.line
              x1="80"
              y1="24"
              x2="900"
              y2="24"
              stroke={c}
              strokeWidth="0.35"
            />
            <motion.line
              x1="80"
              y1="19"
              x2="80"
              y2="29"
              stroke={c}
              strokeWidth="0.25"
            />
            <motion.line
              x1="900"
              y1="19"
              x2="900"
              y2="29"
              stroke={c}
              strokeWidth="0.25"
            />
            <motion.text
              x="490"
              y="20"
              textAnchor="middle"
              fontSize="6"
              fontFamily="monospace"
              fill={c}
            >
              828
            </motion.text>
          </motion.g>

          {/* DIMENSION LINES - RIGHT */}
          <motion.g {...fade(3, S)}>
            <motion.line
              x1="920"
              y1="60"
              x2="920"
              y2="205"
              stroke={c}
              strokeWidth="0.35"
            />
            <motion.line
              x1="915"
              y1="60"
              x2="925"
              y2="60"
              stroke={c}
              strokeWidth="0.25"
            />
            <motion.line
              x1="915"
              y1="205"
              x2="925"
              y2="205"
              stroke={c}
              strokeWidth="0.25"
            />
            <motion.text
              x="930"
              y="137"
              fontSize="6"
              fontFamily="monospace"
              fill={c}
              transform="rotate(90,930,137)"
            >
              254
            </motion.text>
          </motion.g>
          <motion.g {...fade(3.1, S)}>
            <motion.line
              x1="920"
              y1="215"
              x2="920"
              y2="328"
              stroke={c}
              strokeWidth="0.35"
            />
            <motion.line
              x1="915"
              y1="215"
              x2="925"
              y2="215"
              stroke={c}
              strokeWidth="0.25"
            />
            <motion.line
              x1="915"
              y1="328"
              x2="925"
              y2="328"
              stroke={c}
              strokeWidth="0.25"
            />
            <motion.text
              x="930"
              y="276"
              fontSize="6"
              fontFamily="monospace"
              fill={c}
              transform="rotate(90,930,276)"
            >
              90
            </motion.text>
          </motion.g>
          <motion.g {...fade(3.1, S)}>
            <motion.line
              x1="920"
              y1="340"
              x2="920"
              y2="480"
              stroke={c}
              strokeWidth="0.35"
            />
            <motion.line
              x1="915"
              y1="340"
              x2="925"
              y2="340"
              stroke={c}
              strokeWidth="0.25"
            />
            <motion.line
              x1="915"
              y1="480"
              x2="925"
              y2="480"
              stroke={c}
              strokeWidth="0.25"
            />
            <motion.text
              x="930"
              y="415"
              fontSize="6"
              fontFamily="monospace"
              fill={c}
              transform="rotate(90,930,415)"
            >
              140
            </motion.text>
          </motion.g>
          <motion.g {...fade(3.2, S)}>
            <motion.line
              x1="945"
              y1="60"
              x2="945"
              y2="620"
              stroke={c}
              strokeWidth="0.35"
            />
            <motion.line
              x1="940"
              y1="60"
              x2="950"
              y2="60"
              stroke={c}
              strokeWidth="0.25"
            />
            <motion.line
              x1="940"
              y1="620"
              x2="950"
              y2="620"
              stroke={c}
              strokeWidth="0.25"
            />
            <motion.text
              x="955"
              y="345"
              fontSize="6"
              fontFamily="monospace"
              fill={c}
              transform="rotate(90,955,345)"
            >
              750
            </motion.text>
          </motion.g>

          {/* BOTTOM DIMS */}
          <motion.g {...fade(3.2, S)}>
            <motion.line
              x1="80"
              y1="640"
              x2="340"
              y2="640"
              stroke={c}
              strokeWidth="0.35"
            />
            <motion.line
              x1="80"
              y1="635"
              x2="80"
              y2="645"
              stroke={c}
              strokeWidth="0.25"
            />
            <motion.line
              x1="340"
              y1="635"
              x2="340"
              y2="645"
              stroke={c}
              strokeWidth="0.25"
            />
            <motion.text
              x="210"
              y="655"
              textAnchor="middle"
              fontSize="6"
              fontFamily="monospace"
              fill={c}
            >
              293
            </motion.text>
          </motion.g>

          {/* SECTION MARKS */}
          <motion.g {...fade(3, M)}>
            <motion.circle
              cx="45"
              cy="335"
              r="10"
              stroke={c}
              strokeWidth="0.4"
              fill="none"
            />
            <motion.line
              x1="45"
              y1="325"
              x2="45"
              y2="345"
              stroke={c}
              strokeWidth="0.25"
            />
            <motion.text
              x="45"
              y="332"
              textAnchor="middle"
              fontSize="5"
              fontFamily="monospace"
              fill={c}
            >
              A
            </motion.text>
            <motion.text
              x="45"
              y="342"
              textAnchor="middle"
              fontSize="5"
              fontFamily="monospace"
              fill={c}
            >
              A
            </motion.text>
            <motion.line
              x1="55"
              y1="335"
              x2="80"
              y2="335"
              stroke={c}
              strokeWidth="0.35"
            />
            <motion.polygon
              points="77,332 80,335 77,338"
              fill={c}
              opacity="0.2"
            />
          </motion.g>
          <motion.g {...fade(3, M)}>
            <motion.circle
              cx="960"
              cy="335"
              r="10"
              stroke={c}
              strokeWidth="0.4"
              fill="none"
            />
            <motion.text
              x="960"
              y="332"
              textAnchor="middle"
              fontSize="5"
              fontFamily="monospace"
              fill={c}
            >
              A
            </motion.text>
            <motion.text
              x="960"
              y="342"
              textAnchor="middle"
              fontSize="5"
              fontFamily="monospace"
              fill={c}
            >
              A
            </motion.text>
            <motion.line
              x1="950"
              y1="335"
              x2="900"
              y2="335"
              stroke={c}
              strokeWidth="0.35"
            />
            <motion.polygon
              points="903,332 900,335 903,338"
              fill={c}
              opacity="0.2"
            />
          </motion.g>

          {/* GRID REFERENCE BUBBLES */}
          <motion.g {...fade(3.5, S)}>
            {["1", "2", "3", "4", "5"].map((n, i) => (
              <motion.g key={`gh-${n}`}>
                <motion.circle
                  cx={80 + i * 205}
                  cy="680"
                  r="8"
                  stroke={c}
                  strokeWidth="0.3"
                  fill="none"
                />
                <motion.text
                  x={80 + i * 205}
                  y="683"
                  textAnchor="middle"
                  fontSize="6"
                  fontFamily="monospace"
                  fill={c}
                >
                  {n}
                </motion.text>
              </motion.g>
            ))}
            {["A", "B", "C", "D"].map((l, i) => (
              <motion.g key={`gv-${l}`}>
                <motion.circle
                  cx="35"
                  cy={60 + i * 187}
                  r="8"
                  stroke={c}
                  strokeWidth="0.3"
                  fill="none"
                />
                <motion.text
                  x="35"
                  y={63 + i * 187}
                  textAnchor="middle"
                  fontSize="6"
                  fontFamily="monospace"
                  fill={c}
                >
                  {l}
                </motion.text>
              </motion.g>
            ))}
          </motion.g>

          {/* TITLE BLOCK */}
          <motion.g {...fade(4, M)}>
            <motion.rect
              x="980"
              y="690"
              width="200"
              height="50"
              stroke={c}
              strokeWidth="0.5"
            />
            <motion.line
              x1="980"
              y1="710"
              x2="1180"
              y2="710"
              stroke={c}
              strokeWidth="0.25"
            />
            <motion.line
              x1="980"
              y1="725"
              x2="1180"
              y2="725"
              stroke={c}
              strokeWidth="0.25"
            />
            <motion.line
              x1="1080"
              y1="690"
              x2="1080"
              y2="740"
              stroke={c}
              strokeWidth="0.25"
            />
            <motion.text
              x="990"
              y="705"
              fontSize="5.5"
              fontFamily="monospace"
              letterSpacing="1"
              fill={c}
            >
              RAYTRACE DESIGN STUDIO
            </motion.text>
            <motion.text
              x="990"
              y="720"
              fontSize="5"
              fontFamily="monospace"
              fill={c}
            >
              RESIDENTIAL VILLA
            </motion.text>
            <motion.text
              x="990"
              y="735"
              fontSize="5"
              fontFamily="monospace"
              fill={c}
            >
              GROUND FLOOR PLAN
            </motion.text>
            <motion.text
              x="1090"
              y="705"
              fontSize="5"
              fontFamily="monospace"
              fill={c}
            >
              SCALE: 1:100
            </motion.text>
            <motion.text
              x="1090"
              y="720"
              fontSize="5"
              fontFamily="monospace"
              fill={c}
            >
              DWG: A-101
            </motion.text>
            <motion.text
              x="1090"
              y="735"
              fontSize="5"
              fontFamily="monospace"
              fill={c}
            >
              REV: 04
            </motion.text>
          </motion.g>

          {/* SCALE BAR */}
          <motion.g {...fade(4, S)}>
            <motion.rect
              x="980"
              y="660"
              width="200"
              height="8"
              stroke={c}
              strokeWidth="0.25"
              fill="none"
            />
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.rect
                key={`sb-${i}`}
                x={980 + i * 40}
                y="660"
                width="40"
                height="8"
                fill={i % 2 === 0 ? c : "none"}
                stroke={c}
                strokeWidth="0.15"
                opacity={i % 2 === 0 ? 0.12 : 1}
              />
            ))}
            <motion.text
              x="980"
              y="678"
              fontSize="4.5"
              fontFamily="monospace"
              fill={c}
            >
              0
            </motion.text>
            <motion.text
              x="1080"
              y="678"
              textAnchor="middle"
              fontSize="4.5"
              fontFamily="monospace"
              fill={c}
            >
              2.5m
            </motion.text>
            <motion.text
              x="1180"
              y="678"
              textAnchor="end"
              fontSize="4.5"
              fontFamily="monospace"
              fill={c}
            >
              5m
            </motion.text>
          </motion.g>
        </g>
      </svg>
    </div>
  );
}
