import type { ReactNode, SVGProps } from "react";

/**
 * A local icon set rather than a package: the interface needs about forty
 * glyphs, each a handful of path commands, and a dependency would ship
 * thousands. Every glyph is drawn on the same 24x24 grid at one stroke weight
 * so they sit together instead of looking assembled from different sets.
 */
export type IconName =
  | "logo"
  | "menu"
  | "close"
  | "check"
  | "arrow-right"
  | "arrow-down"
  | "info"
  | "shield"
  | "calendar"
  | "price-tag"
  | "basket"
  | "receipt"
  | "wallet"
  | "sliders"
  | "users"
  | "breakfast"
  | "lunch"
  | "dinner"
  | "snack"
  | "hob"
  | "oven"
  | "microwave"
  | "air-fryer"
  | "slow-cooker"
  | "toaster"
  | "kettle"
  | "blender"
  | "quick"
  | "high-protein"
  | "leaf"
  | "recycle"
  | "layers"
  | "wheat"
  | "milk"
  | "egg"
  | "fish"
  | "shellfish"
  | "nut"
  | "plant"
  | "droplet"
  | "shaker"
  | "peppermill"
  | "cube"
  | "store"
  | "clock"
  | "check-circle"
  | "alert-circle"
  | "x-circle"
  | "refresh";

function Dot({ cx, cy }: { cx: number; cy: number }) {
  return <circle cx={cx} cy={cy} r="1" fill="currentColor" stroke="none" />;
}

const UI_GLYPHS: Partial<Record<IconName, ReactNode>> = {
  logo: (
    <>
      <path d="M4 11h16v2a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6v-2Z" />
      <path d="M4 13.5H2.6M20 13.5h1.4" />
      <path d="M9.5 8c0-1 1-1.2 1-2.2s-1-1.2-1-2.2M14.5 8c0-1 1-1.2 1-2.2s-1-1.2-1-2.2" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  "arrow-right": <path d="M4 12h15M13 6l6 6-6 6" />,
  "arrow-down": <path d="M12 4.5v15M6 13l6 6 6-6" />,
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11.5v5" />
      <Dot cx={12} cy={8} />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 3v6c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6l7-3Z" />
      <path d="M12 8.5v4" />
      <Dot cx={12} cy={15.5} />
    </>
  ),
  calendar: (
    <>
      <path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" />
      <path d="M4 10h16M8 3v4M16 3v4" />
    </>
  ),
  "price-tag": (
    <>
      <path d="M3 12.4V5.2A2.2 2.2 0 0 1 5.2 3h7.2c.6 0 1.1.2 1.5.6l6.5 6.5a2.2 2.2 0 0 1 0 3.1l-7.2 7.2a2.2 2.2 0 0 1-3.1 0L3.6 13.9a2.2 2.2 0 0 1-.6-1.5Z" />
      <circle cx="7.8" cy="7.8" r="1.4" />
    </>
  ),
  basket: (
    <>
      <path d="M3 9h18l-1.5 9.4a2 2 0 0 1-2 1.6H6.5a2 2 0 0 1-2-1.6L3 9Z" />
      <path d="M9 9 11 3.5M15 9 13 3.5" />
    </>
  ),
  receipt: (
    <>
      <path d="M6 3h12a1 1 0 0 1 1 1v17l-3-2-3 2-3-2-3 2V4a1 1 0 0 1 1-1Z" />
      <path d="M9 8h6M9 12h6" />
    </>
  ),
  wallet: (
    <>
      <path d="M3 8h16a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Z" />
      <path d="M3 8V6.5a2 2 0 0 1 2-2h11" />
      <Dot cx={17} cy={13.5} />
    </>
  ),
  sliders: (
    <>
      <path d="M4 6h9M19 6h1M4 12h3M13 12h7M4 18h9M19 18h1" />
      <circle cx="16" cy="6" r="2.2" />
      <circle cx="10" cy="12" r="2.2" />
      <circle cx="16" cy="18" r="2.2" />
    </>
  ),
  users: (
    <>
      <circle cx="9.5" cy="8" r="3.2" />
      <path d="M3.5 20a6 6 0 0 1 12 0" />
      <path d="M16.5 5.6a3 3 0 0 1 0 4.8M17.5 20a6.4 6.4 0 0 0-1.8-4" />
    </>
  ),
};

const MEAL_GLYPHS: Partial<Record<IconName, ReactNode>> = {
  breakfast: (
    <>
      <path d="M12 3.5v3M5.5 9.5 7 11M18.5 9.5 17 11M2.5 17h19M2.5 21h19" />
      <path d="M8 17a4 4 0 0 1 8 0" />
    </>
  ),
  lunch: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
    </>
  ),
  dinner: <path d="M20 14.4A8.5 8.5 0 0 1 9.6 4 8.5 8.5 0 1 0 20 14.4Z" />,
  snack: (
    <>
      <path d="M12 7.5C9 4.2 4 6 4 11c0 4 3 9 5.5 9 1 0 1.5-.6 2.5-.6s1.5.6 2.5.6C17 20 20 15 20 11c0-5-5-6.8-8-3.5Z" />
      <path d="M12 7.5c0-2 1-3.2 3-3.7" />
    </>
  ),
  quick: <path d="M13 2.5 4.5 14H11l-1 7.5L19.5 10H13l1-7.5Z" />,
  "high-protein": <path d="M4 9v6M7 6.5v11M17 6.5v11M20 9v6M7 12h10" />,
  leaf: (
    <>
      <path d="M4 20C4 10.5 11.5 4 20 4c0 8.5-5.5 16-15 16Z" />
      <path d="M4.5 19.5c3-5.5 7-8.5 11.5-10.5" />
    </>
  ),
  recycle: (
    <>
      <path d="M20.5 12a8.5 8.5 0 1 1-2.5-6" />
      <path d="M20.5 3.5v4.5H16" />
    </>
  ),
  layers: (
    <>
      <path d="M12 3 3 7.5 12 12l9-4.5L12 3Z" />
      <path d="M3 12.5 12 17l9-4.5M3 17 12 21.5l9-4.5" />
    </>
  ),
};

const APPLIANCE_GLYPHS: Partial<Record<IconName, ReactNode>> = {
  hob: <path d="M12 3s5 4 5 9a5 5 0 0 1-10 0c0-2 1-3.6 2-4.6 0 1.6 1 2.6 2 2.6 1.6 0 1.6-4 1-7Z" />,
  oven: (
    <>
      <path d="M4 4h16v16H4z" />
      <path d="M4 10h16M8 7h8M8 14h8" />
    </>
  ),
  microwave: (
    <>
      <path d="M3 6h18v12H3z" />
      <path d="M14 6v12M6 9.5h5M6 12.5h5" />
      <Dot cx={17.5} cy={10} />
    </>
  ),
  "air-fryer": (
    <>
      <path d="M5 5h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
      <path d="M4 14h16M9.5 17h5" />
      <Dot cx={17} cy={8.5} />
    </>
  ),
  "slow-cooker": (
    <>
      <path d="M5 9.5h14V15a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9.5Z" />
      <path d="M3 9.5h18M12 3.5v3M10.5 6.5h3" />
    </>
  ),
  toaster: (
    <>
      <path d="M4 10a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7Z" />
      <path d="M8.5 8V6M12 8V6M15.5 8V6M16 14h1.5" />
    </>
  ),
  kettle: (
    <>
      <path d="M7 8.5h8a5 5 0 0 1 5 5V17a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-3.5a5 5 0 0 1 2-5Z" />
      <path d="M15.5 8.5 18.5 5M9.5 5h4" />
    </>
  ),
  blender: (
    <>
      <path d="M8 3h8l-1 8H9L8 3Z" />
      <path d="M9 11h6v3.5a3 3 0 0 1-6 0V11Z" />
      <path d="M12 17.5V21M9.5 21h5" />
    </>
  ),
};

const ALLERGEN_GLYPHS: Partial<Record<IconName, ReactNode>> = {
  wheat: (
    <>
      <path d="M12 21V6" />
      <path d="M12 12c-2.2 0-3.8-1.6-3.8-3.8C10.4 8.2 12 9.8 12 12ZM12 12c2.2 0 3.8-1.6 3.8-3.8C13.6 8.2 12 9.8 12 12Z" />
      <path d="M12 17c-2.2 0-3.8-1.6-3.8-3.8C10.4 13.2 12 14.8 12 17ZM12 17c2.2 0 3.8-1.6 3.8-3.8C13.6 13.2 12 14.8 12 17Z" />
      <path d="M12 6c-1.4-1-1.4-2.5 0-3.5 1.4 1 1.4 2.5 0 3.5Z" />
    </>
  ),
  milk: (
    <>
      <path d="M9 3h6v3l2 3.5V20a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V9.5L9 6V3Z" />
      <path d="M7 12.5h10" />
    </>
  ),
  egg: <path d="M12 3c3.6 0 6 5.2 6 9.2A6 6 0 0 1 6 12.2C6 8.2 8.4 3 12 3Z" />,
  fish: (
    <>
      <path d="M2.5 12c4-6.2 12.2-6.2 16 0-3.8 6.2-12 6.2-16 0Z" />
      <path d="M18.5 12 22 8.8v6.4L18.5 12Z" />
      <Dot cx={8} cy={10.6} />
    </>
  ),
  shellfish: (
    <>
      <path d="M12 20.5a8.5 8.5 0 1 1 0-17 8.5 8.5 0 0 1 0 17Z" />
      <path d="M12 20.5V3.5M12 20.5 6.2 6.6M12 20.5l5.8-13.9" />
    </>
  ),
  nut: (
    <>
      <path d="M6 9.5h12l-1 3.5a6 6 0 0 1-10 0l-1-3.5Z" />
      <path d="M6 9.5a6 6 0 0 1 12 0M12 3.5v2" />
    </>
  ),
  plant: (
    <>
      <path d="M12 21V9.5" />
      <path d="M12 9.5C8.7 9.5 6.5 7.3 6.5 4c3.3 0 5.5 2.2 5.5 5.5ZM12 12c3.3 0 5.5-2.2 5.5-5.5C14.2 6.5 12 8.7 12 12Z" />
    </>
  ),
  droplet: <path d="M12 3s6 6.6 6 10.5a6 6 0 0 1-12 0C6 9.6 12 3 12 3Z" />,
};

const PANTRY_AND_STATUS_GLYPHS: Partial<Record<IconName, ReactNode>> = {
  shaker: (
    <>
      <path d="M8.5 9.5h7L17 20.5H7L8.5 9.5Z" />
      <path d="M8.8 9.5a3.2 3.2 0 0 1 6.4 0" />
      <Dot cx={10.5} cy={5.5} />
      <Dot cx={13.5} cy={5.5} />
      <Dot cx={12} cy={3.8} />
    </>
  ),
  peppermill: (
    <>
      <path d="M9 21c0-6.5 1.2-9.5 3-9.5s3 3 3 9.5H9Z" />
      <path d="M9.5 3h5l-.8 4h-3.4L9.5 3Z" />
      <path d="M10.3 7h3.4l.5 4.5H9.8L10.3 7Z" />
    </>
  ),
  cube: (
    <>
      <path d="M5 5h14v14H5z" />
      <path d="M5 12h14M12 5v14" />
    </>
  ),
  store: (
    <>
      <path d="M4 9.5h16V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5Z" />
      <path d="M3 9.5 5 4h14l2 5.5M9.5 20v-5.5h5V20" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5.3l3.5 2" />
    </>
  ),
  "check-circle": (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.2 12.3 11 15l4.8-5.5" />
    </>
  ),
  "alert-circle": (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5v5" />
      <Dot cx={12} cy={16} />
    </>
  ),
  "x-circle": (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.2 9.2 14.8 14.8M14.8 9.2 9.2 14.8" />
    </>
  ),
  refresh: (
    <>
      <path d="M20.5 12a8.5 8.5 0 1 1-2.5-6" />
      <path d="M20.5 3.5v4.5H16" />
    </>
  ),
};

const GLYPHS = {
  ...UI_GLYPHS,
  ...MEAL_GLYPHS,
  ...APPLIANCE_GLYPHS,
  ...ALLERGEN_GLYPHS,
  ...PANTRY_AND_STATUS_GLYPHS,
} as Record<IconName, ReactNode>;

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  /** Rendered size in pixels; every glyph is square. */
  size?: number;
}

/**
 * Decorative by default: every icon in this interface sits beside its own
 * label, so announcing it again would only repeat what the label already says.
 */
export function Icon({ name, size = 20, className, ...rest }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...rest}
    >
      {GLYPHS[name]}
    </svg>
  );
}
