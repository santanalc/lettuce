/* Ícones inline e controles compartilhados do redesign. */

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const IcoSprout = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" {...stroke}>
    <path d="M12 20v-7" />
    <path d="M12 13c0-3.5-2.7-6-6.5-6C5.5 10.6 8.2 13 12 13Z" />
    <path d="M12 11c0-3.2 2.5-5.5 6-5.5 0 3.3-2.5 5.5-6 5.5Z" />
    <path d="M5 20h14" />
  </svg>
);

export const IcoChat = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" {...stroke}>
    <path d="M20 12a8 8 0 1 0-3.5 6.6L20 20l-.9-3.2A8 8 0 0 0 20 12Z" />
    <path d="M8.5 10.5h7M8.5 13.5h4.5" />
  </svg>
);

export const IcoGauge = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" {...stroke}>
    <path d="M4 13a8 8 0 1 1 16 0" />
    <path d="m12 13 3.5-3.5" />
    <path d="M4 17h16M6 20h12" />
  </svg>
);

export const IcoArrow = () => (
  <svg aria-hidden="true" viewBox="0 0 18 18" {...stroke}>
    <path d="M3 9h11M10 4l5 5-5 5" />
  </svg>
);

export const IcoLock = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" {...stroke}>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);

export const IcoSprinkler = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" {...stroke}>
    <path d="M12 21v-8M8 21h8" />
    <path d="M12 9V7M7 10 5.7 8.5M17 10l1.3-1.5M9.5 6.5 8.8 4.6M14.5 6.5l.7-1.9" />
  </svg>
);

export const IcoDrip = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" {...stroke}>
    <path d="M12 4c2.8 3.4 4.5 6 4.5 8.5a4.5 4.5 0 0 1-9 0C7.5 10 9.2 7.4 12 4Z" />
    <path d="M12 21v-1" />
  </svg>
);

export const IcoSun = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" {...stroke}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
  </svg>
);

export const IcoCheck = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" {...stroke} strokeWidth={2.4}>
    <path d="m5 13 4.5 4.5L19 8" />
  </svg>
);

export const IcoX = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" {...stroke} strokeWidth={2.4}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

export const IcoChevron = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" {...stroke}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);

export const IcoInfo = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" {...stroke}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 10.5V17M12 7.2v.3" />
  </svg>
);

export const IcoAlert = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" {...stroke}>
    <path d="M12 4 2.8 20h18.4L12 4Z" />
    <path d="M12 10v4.5M12 17.5v.3" />
  </svg>
);

export const IcoSend = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" {...stroke}>
    <path d="m4 12 16-7-4.5 16-3.5-6.5L4 12Z" />
  </svg>
);

export const IcoLeafSmall = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" {...stroke}>
    <path d="M6 18C6 10 11 5 19 5c0 8-5 13-13 13Z" />
    <path d="M6 18c3-3 6-5 9-6" />
  </svg>
);

/** Stepper numérico grande: − valor + */
export function Stepper({
  value,
  onChange,
  step = 1,
  min = 0,
  suffix,
  ariaLabel,
  format,
  parse,
}: {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  suffix?: string;
  ariaLabel: string;
  format?: (v: number) => string;
  parse?: (raw: string) => number;
}) {
  const shown = format ? format(value) : String(value);
  return (
    <div className="stepper">
      <button
        type="button"
        aria-label={`Diminuir ${ariaLabel}`}
        onClick={() => onChange(Math.max(min, value - step))}
      >
        −
      </button>
      <input
        inputMode="decimal"
        aria-label={ariaLabel}
        value={suffix ? `${shown}${suffix}` : shown}
        onChange={(e) => {
          const raw = e.target.value.replace(suffix ?? "", "");
          const parsed = parse ? parse(raw) : Number(raw.replace(",", "."));
          if (Number.isFinite(parsed)) onChange(Math.max(min, parsed));
        }}
      />
      <button
        type="button"
        aria-label={`Aumentar ${ariaLabel}`}
        onClick={() => onChange(value + step)}
      >
        +
      </button>
    </div>
  );
}
