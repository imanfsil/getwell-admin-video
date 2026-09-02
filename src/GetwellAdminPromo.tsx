/* =========================================================================
   GETWELL ADMIN PROMO
   1920 x 1080 - 30 fps - 1350 frames (45.00 seconds)

   Everything the video needs lives in this one file: the design tokens taken
   from the real app's styles.css, the demo data, the rebuilt Getwell
   interface, the seven scenes and the master timeline. Poppins is embedded
   as base64 so there are no external assets to go missing.

   Composition id: GetwellAdminPromo   (registered in Root.tsx)
   ========================================================================= */

import React from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  Easing,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";



/* -------------------------------------------------------------------------
   Design tokens taken from the Getwell Admin web app (styles.css)
   ------------------------------------------------------------------------- */


/**
 * Design tokens taken directly from the Getwell Admin web app
 * (styles.css :root and its dark-theme block).
 */
export const C = {
  /* App (light) surface - the real product UI */
  navy: "#08142A",
  blue: "#2563EB",
  blueDeep: "#1D4ED8",
  blueSoft: "#3B82F6",
  page: "#EEF5FF",
  card: "#FFFFFF",
  surface: "#F8FBFF",
  border: "#D9E4F2",
  borderLight: "#E8EEF7",
  muted: "#64748B",
  soft: "#94A3B8",
  green: "#16A34A",
  greenSoft: "#ECFDF5",
  greenInk: "#15803D",
  orange: "#F59E0B",
  orangeSoft: "#FFF7ED",
  orangeInk: "#C2410C",
  red: "#DC2626",
  redSoft: "#FEF2F2",
  redInk: "#B91C1C",
  blueChip: "#E8F2FF",
  navHover: "#EAF2FF",
  navActive: "#DDEBFF",
  navInk: "#1759D6",
  sidebar: "#F7FAFF",

  /* Cinematic stage (dark) - matches the app's dark theme palette */
  stage0: "#060A14",
  stage1: "#0D1424",
  stage2: "#151E30",
  ink: "#F8FAFC",
  inkMuted: "#94A3B8",
} as const;

export const FONT =
  'Poppins, "Helvetica Neue", Helvetica, Arial, sans-serif';

/** Logical size of the recreated application window. */
export const WIN = {
  w: 1560,
  h: 880,
  sidebar: 300,
  topbar: 108,
  chrome: 52,
} as const;

export const SHADOW_CARD = "0 10px 34px rgba(15,23,42,.07)";


/* -------------------------------------------------------------------------
   Timeline - single source of truth for the video timing
   ------------------------------------------------------------------------- */


/**
 * Single source of truth for the video timing.
 * 1350 frames @ 30fps = 45 seconds, 1920 x 1080.
 */
export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export type SceneName =
  | "intro"
  | "dashboard"
  | "patients"
  | "profile"
  | "appointments"
  | "reports"
  | "outro";

export type SceneSpec = {
  name: SceneName;
  from: number;
  duration: number;
};

/** Cross-fade overlap between consecutive scenes, in frames. */
export const OVERLAP = 16;

export const SCENES: SceneSpec[] = [
  { name: "intro", from: 0, duration: 120 },          // 0.0s - 4.0s
  { name: "dashboard", from: 120, duration: 210 },    // 4.0s - 11.0s
  { name: "patients", from: 330, duration: 210 },     // 11.0s - 18.0s
  { name: "profile", from: 540, duration: 240 },      // 18.0s - 26.0s
  { name: "appointments", from: 780, duration: 210 }, // 26.0s - 33.0s
  { name: "reports", from: 990, duration: 180 },      // 33.0s - 39.0s
  { name: "outro", from: 1170, duration: 180 },       // 39.0s - 45.0s
];

export const TOTAL_FRAMES = SCENES.reduce(
  (max, s) => Math.max(max, s.from + s.duration),
  0
);


/* -------------------------------------------------------------------------
   Animation helpers
   ------------------------------------------------------------------------- */


/** Premium, decisive easing - fast out, long settle. */
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

/** 0 -> 1 progress ramp starting at `delay`, lasting `len` frames. */
export const ramp = (frame: number, delay: number, len: number) =>
  interpolate(frame, [delay, delay + len], [0, 1], {
    ...clamp,
    easing: EASE_OUT,
  });

/** Soft spring used for entrances. */
export const enter = (frame: number, fps: number, delay = 0) =>
  spring({
    frame: frame - delay,
    fps,
    config: { damping: 200, mass: 0.85, stiffness: 110 },
    durationInFrames: 34,
  });

/** Fade + rise. Returns inline style. */
export const fadeUp = (
  frame: number,
  fps: number,
  delay = 0,
  distance = 26
): React.CSSProperties => {
  const p = enter(frame, fps, delay);
  return {
    opacity: p,
    transform: `translateY(${(1 - p) * distance}px)`,
  };
};

/** Fade + slide from the left. */
export const fadeIn = (
  frame: number,
  fps: number,
  delay = 0,
  dx = -22
): React.CSSProperties => {
  const p = enter(frame, fps, delay);
  return {
    opacity: p,
    transform: `translateX(${(1 - p) * dx}px)`,
  };
};

/** Scene-level opacity: fades in at the head, out at the tail. */
export const sceneOpacity = (
  frame: number,
  duration: number,
  fadeInLen = 14,
  fadeOutLen = 16
) =>
  interpolate(
    frame,
    [0, fadeInLen, duration - fadeOutLen, duration],
    [0, 1, 1, 0],
    clamp
  );

/** A slow, continuous camera push-in across a scene. */
export const pushIn = (
  frame: number,
  duration: number,
  from = 0.845,
  to = 0.888
) => interpolate(frame, [0, duration], [from, to], clamp);

/** Counts a number up with easing. */
export const countUp = (
  frame: number,
  delay: number,
  len: number,
  to: number,
  decimals = 0
) => {
  const p = ramp(frame, delay, len);
  const v = p * to;
  return decimals === 0
    ? Math.round(v).toLocaleString("en-US")
    : v.toFixed(decimals);
};

/** Pulse between 0 and 1 and back, used for highlight rings. */
export const pulse = (
  frame: number,
  start: number,
  hold: number,
  fade = 14
) =>
  interpolate(
    frame,
    [start, start + fade, start + fade + hold, start + fade + hold + fade],
    [0, 1, 1, 0],
    clamp
  );


/* -------------------------------------------------------------------------
   Demonstration data (fictional - no real patient information)
   ------------------------------------------------------------------------- */


/**
 * Demonstration data only. All names are fictional - no real patient
 * information from the Getwell app is used anywhere in this video.
 * The field names, ID format (GW-XXXX), statuses, units and currency
 * all follow the real application.
 */

export type Patient = {
  id: string;
  name: string;
  initials: string;
  panel: string;
  current: number;
  goal: number;
  start: number;
  lastVisit: string;
  startDate: string;
  status: "Active" | "Inactive";
};

export const PATIENTS: Patient[] = [
  { id: "GW-1042", name: "Nurul Aisyah Rahman", initials: "NA", panel: "AIA Health", current: 74.2, goal: 66.0, start: 88.5, lastVisit: "28 Aug 2026", startDate: "2026-03-11", status: "Active" },
  { id: "GW-1039", name: "Daniel Tan Wei Jie", initials: "DT", panel: "Self Pay", current: 91.6, goal: 82.0, start: 104.0, lastVisit: "27 Aug 2026", startDate: "2026-02-24", status: "Active" },
  { id: "GW-1036", name: "Priya Nair", initials: "PN", panel: "Great Eastern", current: 68.4, goal: 61.0, start: 79.2, lastVisit: "26 Aug 2026", startDate: "2026-01-19", status: "Active" },
  { id: "GW-1031", name: "Amirul Hakim", initials: "AH", panel: "Allianz Care", current: 86.9, goal: 78.0, start: 97.4, lastVisit: "22 Aug 2026", startDate: "2026-01-08", status: "Active" },
  { id: "GW-1028", name: "Chloe Lim Mei Xin", initials: "CL", panel: "Self Pay", current: 63.1, goal: 58.0, start: 72.6, lastVisit: "21 Aug 2026", startDate: "2025-12-15", status: "Active" },
  { id: "GW-1024", name: "Ravi Kumar", initials: "RK", panel: "Prudential", current: 95.3, goal: 84.0, start: 108.7, lastVisit: "18 Aug 2026", startDate: "2025-11-30", status: "Active" },
  { id: "GW-1019", name: "Siti Zulaikha", initials: "SZ", panel: "AIA Health", current: 70.8, goal: 64.0, start: 81.0, lastVisit: "12 Aug 2026", startDate: "2025-11-04", status: "Active" },
  { id: "GW-1015", name: "Marcus Chong", initials: "MC", panel: "Self Pay", current: 88.2, goal: 80.0, start: 96.5, lastVisit: "05 Aug 2026", startDate: "2025-10-21", status: "Inactive" },
];

export const progressPercent = (p: Patient) => {
  if (p.start <= p.goal) return 0;
  const pct = ((p.start - p.current) / (p.start - p.goal)) * 100;
  return Math.max(0, Math.min(100, Math.round(pct)));
};

export type Appointment = {
  time: string;
  patient: string;
  id: string;
  type: string;
  doctor: string;
  status: "Upcoming" | "Completed" | "No Show" | "Cancelled";
};

export const TODAY_APPOINTMENTS: Appointment[] = [
  { time: "09:00 AM", patient: "Nurul Aisyah Rahman", id: "GW-1042", type: "Follow-Up", doctor: "Dr. Lim", status: "Completed" },
  { time: "09:45 AM", patient: "Daniel Tan Wei Jie", id: "GW-1039", type: "Body Composition", doctor: "Dr. Farah", status: "Completed" },
  { time: "10:30 AM", patient: "Priya Nair", id: "GW-1036", type: "Consultation", doctor: "Dr. Lim", status: "Upcoming" },
  { time: "11:15 AM", patient: "Amirul Hakim", id: "GW-1031", type: "Follow-Up", doctor: "Dr. Ng", status: "Upcoming" },
  { time: "02:00 PM", patient: "Chloe Lim Mei Xin", id: "GW-1028", type: "Programme Review", doctor: "Dr. Farah", status: "No Show" },
  { time: "03:30 PM", patient: "Ravi Kumar", id: "GW-1024", type: "Follow-Up", doctor: "Dr. Lim", status: "Upcoming" },
];

export type FollowUp = {
  name: string;
  id: string;
  initials: string;
  days: number;
  level: "due" | "overdue";
  label: string;
};

export const FOLLOW_UPS: FollowUp[] = [
  { name: "Marcus Chong", id: "GW-1015", initials: "MC", days: 42, level: "overdue", label: "12 days overdue" },
  { name: "Siti Zulaikha", id: "GW-1019", initials: "SZ", days: 35, level: "overdue", label: "5 days overdue" },
  { name: "Ravi Kumar", id: "GW-1024", initials: "RK", days: 31, level: "due", label: "1 day overdue" },
  { name: "Chloe Lim Mei Xin", id: "GW-1028", initials: "CL", days: 30, level: "due", label: "Due today" },
  { name: "Amirul Hakim", id: "GW-1031", initials: "AH", days: 29, level: "due", label: "Due in 1 day" },
];

/** Weight recorded at each visit for the profile scene (kg). */
export const WEIGHT_SERIES = [88.5, 85.9, 83.4, 81.2, 79.0, 77.1, 75.6, 74.2];
export const VISIT_LABELS = ["V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8"];

/** Arboleaf body-composition series used on the profile scene. */
export const BODY_FAT_SERIES = [41.2, 39.8, 38.4, 37.1, 35.9, 34.8, 33.9, 33.1];
export const MUSCLE_SERIES = [22.4, 22.6, 22.9, 23.1, 23.4, 23.6, 23.9, 24.1];

/** Monthly revenue for the reports scene (RM). */
export const REVENUE_SERIES = [
  { month: "Mar", value: 26400 },
  { month: "Apr", value: 31250 },
  { month: "May", value: 29800 },
  { month: "Jun", value: 37600 },
  { month: "Jul", value: 42150 },
  { month: "Aug", value: 48650 },
];

export const PANEL_ROWS = [
  { panel: "AIA Health", patients: 14, invoiced: 18450, claimed: 15200 },
  { panel: "Great Eastern", patients: 9, invoiced: 12300, claimed: 11150 },
  { panel: "Allianz Care", patients: 7, invoiced: 9800, claimed: 6400 },
  { panel: "Prudential", patients: 5, invoiced: 8100, claimed: 7350 },
];

export const money = (n: number) =>
  "RM " + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const moneyShort = (n: number) =>
  "RM " + n.toLocaleString("en-US");


/* -------------------------------------------------------------------------
   Poppins, embedded
   ------------------------------------------------------------------------- */


/**
 * Poppins (latin subset) embedded as base64 so the render never needs a
 * network request or an external asset file. Weights 400 / 500 / 600 / 700.
 */
const POPPINS_FACES: { weight: string; data: string }[] = [
  {
    weight: "400",
    data:
      "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",
  },
  {
    weight: "500",
    data:
      "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",
  },
  {
    weight: "600",
    data:
      "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",
  },
  {
    weight: "700",
    data:
      "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" +
      "Wirf8//1wjeTRqMyAAAAAA==",
  },
];

let fontsStarted = false;

/**
 * Registers Poppins with the browser before the first frame is captured.
 * The data URLs above mean this works on a completely offline machine.
 */
export const loadPoppins = () => {
  if (fontsStarted || typeof document === "undefined") {
    return;
  }
  fontsStarted = true;

  const handle = delayRender("Loading Poppins");

  Promise.all(
    POPPINS_FACES.map(({ weight, data }) => {
      const face = new FontFace(
        "Poppins",
        `url(data:font/woff2;base64,${data}) format("woff2")`,
        { weight, style: "normal" }
      );
      return face.load().then((loaded) => {
        document.fonts.add(loaded);
      });
    })
  )
    .then(() => continueRender(handle))
    .catch(() => continueRender(handle));
};

loadPoppins();


/* -------------------------------------------------------------------------
   Icon set lifted from the Getwell app
   ------------------------------------------------------------------------- */


/** Icon set lifted from the Getwell app (app.js ICONS). */
const base = (size: number): React.SVGProps<SVGSVGElement> => ({
  viewBox: "0 0 24 24",
  width: size,
  height: size,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const IconPeople: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg {...base(size)}>
    <path d="M16 20v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V20" />
    <circle cx="9" cy="7" r="3.2" />
    <path d="M22 20v-1.5a4 4 0 0 0-3-3.87" />
    <path d="M16.5 4.2a4 4 0 0 1 0 7.6" />
  </svg>
);

export const IconPerson: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg {...base(size)}>
    <path d="M19 20v-1.5a5 5 0 0 0-5-5h-4a5 5 0 0 0-5 5V20" />
    <circle cx="12" cy="7" r="3.6" />
  </svg>
);

export const IconClock: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg {...base(size)}>
    <rect x="3" y="4.5" width="18" height="16" rx="3" />
    <path d="M3 9.5h18M8 2.8v3.4M16 2.8v3.4" />
    <path d="M12 12.6v2.6l1.8 1.1" />
  </svg>
);

export const IconShield: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg {...base(size)}>
    <path d="M12 2.8 4.5 6v6c0 4.4 3.1 8.2 7.5 9.3 4.4-1.1 7.5-4.9 7.5-9.3V6Z" />
    <path d="m9 12.2 2.2 2.2L15.4 10" />
  </svg>
);

export const IconCalendar: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg {...base(size)} strokeWidth={1.8}>
    <rect x="3" y="4.5" width="18" height="16" rx="3" />
    <path d="M3 9.5h18M8 2.8v3.4M16 2.8v3.4" />
  </svg>
);

export const IconChart: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg {...base(size)} strokeWidth={1.8}>
    <path d="M3 17.5 9 11l4 3.6 7.2-7.4" />
    <path d="M15.4 7.2h4.8V12" />
  </svg>
);

export const IconSearch: React.FC<{ size?: number }> = ({ size = 19 }) => (
  <svg {...base(size)} strokeWidth={2}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.6-3.6" />
  </svg>
);

export const IconBell: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg {...base(size)} strokeWidth={1.8}>
    <path d="M18 9A6 6 0 0 0 6 9c0 5-2 6.5-2 6.5h16S18 14 18 9Z" />
    <path d="M10.5 19.5a2 2 0 0 0 3 0" />
  </svg>
);

export const IconMoon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg {...base(size)} strokeWidth={1.8}>
    <path d="M20 14.2A8.4 8.4 0 0 1 9.8 4 8.4 8.4 0 1 0 20 14.2Z" />
  </svg>
);

export const IconScale: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg {...base(size)} strokeWidth={1.8}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
    <path d="M8.4 9.6a3.8 3.8 0 0 1 7.2 0" />
    <path d="M12 9.6 10.2 7" />
    <path d="M7.5 15.2h9" />
  </svg>
);

export const IconMoney: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg {...base(size)} strokeWidth={1.8}>
    <rect x="2.5" y="6" width="19" height="12" rx="3" />
    <circle cx="12" cy="12" r="2.6" />
    <path d="M6 12h.01M18 12h.01" />
  </svg>
);

export const IconCheck: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg {...base(size)} strokeWidth={2.1}>
    <path d="m4.5 12.6 4.6 4.6L19.5 6.8" />
  </svg>
);

export const IconAlert: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg {...base(size)} strokeWidth={1.9}>
    <path d="M12 3.6 2.6 20h18.8L12 3.6Z" />
    <path d="M12 10v4.2M12 17.2h.01" />
  </svg>
);


/* -------------------------------------------------------------------------
   UI primitives - cards, KPIs, badges, tables
   ------------------------------------------------------------------------- */


export const Card: React.FC<{
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ style, children }) => (
  <div
    style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 16,
      boxShadow: SHADOW_CARD,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      ...style,
    }}
  >
    {children}
  </div>
);

export const CardHead: React.FC<{
  title: string;
  sub?: string;
  right?: React.ReactNode;
}> = ({ title, sub, right }) => (
  <div
    style={{
      padding: "22px 24px",
      borderBottom: `1px solid ${C.border}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 16,
    }}
  >
    <div>
      <h2
        style={{
          margin: 0,
          fontSize: 18,
          fontWeight: 600,
          color: C.navy,
          letterSpacing: -0.2,
        }}
      >
        {title}
      </h2>
      {sub ? (
        <p style={{ margin: "6px 0 0", fontSize: 14, color: C.muted }}>{sub}</p>
      ) : null}
    </div>
    {right ? (
      <div style={{ fontSize: 14, fontWeight: 600, color: C.blueDeep }}>
        {right}
      </div>
    ) : null}
  </div>
);

type Tone = "green" | "blue" | "gray" | "orange" | "red";

const TONES: Record<Tone, { bg: string; ink: string }> = {
  green: { bg: "#ECFDF5", ink: "#15803D" },
  blue: { bg: "#E8F2FF", ink: "#1D4ED8" },
  gray: { bg: "#F1F5F9", ink: "#475569" },
  orange: { bg: "#FFF7ED", ink: "#C2410C" },
  red: { bg: "#FEF2F2", ink: "#B91C1C" },
};

export const Badge: React.FC<{ tone: Tone; children: React.ReactNode }> = ({
  tone,
  children,
}) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      borderRadius: 999,
      padding: "6px 13px",
      fontSize: 13,
      fontWeight: 600,
      background: TONES[tone].bg,
      color: TONES[tone].ink,
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </span>
);

export const Avatar: React.FC<{
  children: React.ReactNode;
  size?: number;
  radius?: number;
}> = ({ children, size = 44, radius = 12 }) => (
  <span
    style={{
      width: size,
      height: size,
      borderRadius: radius,
      background: "#E7F0FF",
      color: C.blue,
      display: "grid",
      placeItems: "center",
      fontSize: size * 0.32,
      fontWeight: 700,
      flex: "0 0 auto",
      fontFamily: FONT,
    }}
  >
    {children}
  </span>
);

export const Kpi: React.FC<{
  label: string;
  value: React.ReactNode;
  sub?: string;
  subTone?: "up" | "warn" | "link" | "muted";
  icon?: React.ReactNode;
  iconTone?: "blue" | "green" | "amber" | "violet";
  style?: React.CSSProperties;
  valueSize?: number;
}> = ({ label, value, sub, subTone = "muted", icon, iconTone = "blue", style, valueSize = 36 }) => {
  const tones = {
    blue: { bg: "#E7F0FF", ink: "#2563EB" },
    green: { bg: "#E7F8EE", ink: "#16A34A" },
    amber: { bg: "#FFF4E0", ink: "#D97706" },
    violet: { bg: "#EEEAFE", ink: "#7C3AED" },
  }[iconTone];

  const subColor =
    subTone === "up"
      ? C.green
      : subTone === "warn"
      ? C.orange
      : subTone === "link"
      ? C.blueDeep
      : C.soft;

  return (
    <div
      style={{
        padding: 22,
        border: `1px solid ${C.border}`,
        background: C.card,
        borderRadius: 16,
        boxShadow: SHADOW_CARD,
        display: "flex",
        gap: 16,
        alignItems: "flex-start",
        ...style,
      }}
    >
      {icon ? (
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 13,
            background: tones.bg,
            color: tones.ink,
            display: "grid",
            placeItems: "center",
            flex: "0 0 auto",
          }}
        >
          {icon}
        </div>
      ) : null}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, color: C.muted, fontWeight: 500, letterSpacing: 0.3 }}>
          {label}
        </div>
        <div
          style={{
            fontSize: valueSize,
            fontWeight: 700,
            marginTop: 6,
            color: C.navy,
            lineHeight: 1.05,
            whiteSpace: "nowrap",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {value}
        </div>
        {sub ? (
          <div style={{ fontSize: 13, color: subColor, marginTop: 5, fontWeight: subTone === "muted" ? 400 : 600 }}>
            {sub}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export const Row: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  last?: boolean;
}> = ({ children, style, last }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 16,
      padding: "17px 22px",
      borderBottom: last ? "none" : `1px solid ${C.borderLight}`,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Th: React.FC<{ children?: React.ReactNode; align?: "left" | "right" }> = ({
  children,
  align = "left",
}) => (
  <th
    style={{
      background: C.surface,
      color: C.muted,
      fontSize: 13,
      fontWeight: 600,
      textAlign: align,
      padding: "14px 16px",
      borderBottom: `1px solid ${C.border}`,
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </th>
);

export const Td: React.FC<{
  children?: React.ReactNode;
  align?: "left" | "right";
  style?: React.CSSProperties;
}> = ({ children, align = "left", style }) => (
  <td
    style={{
      fontSize: 15,
      padding: "15px 16px",
      borderBottom: `1px solid ${C.borderLight}`,
      color: C.navy,
      textAlign: align,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </td>
);

export const ProgressBar: React.FC<{ percent: number; width?: number }> = ({
  percent,
  width = 110,
}) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
    <span
      style={{
        width,
        height: 8,
        borderRadius: 999,
        background: "#E4ECF8",
        overflow: "hidden",
        display: "inline-block",
      }}
    >
      <span
        style={{
          display: "block",
          height: "100%",
          width: `${percent}%`,
          borderRadius: 999,
          background: `linear-gradient(90deg, ${C.blueSoft}, ${C.blue})`,
        }}
      />
    </span>
    <span style={{ fontSize: 14, color: C.muted, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
      {percent}%
    </span>
  </span>
);

/** A soft blue focus ring drawn over a region of the UI. */
export const Highlight: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  opacity: number;
  radius?: number;
}> = ({ x, y, w, h, opacity, radius = 16 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: radius,
      border: `2px solid rgba(37,99,235,${0.85 * opacity})`,
      boxShadow: `0 0 0 6px rgba(37,99,235,${0.12 * opacity}), 0 0 40px rgba(37,99,235,${0.35 * opacity})`,
      opacity,
      pointerEvents: "none",
    }}
  />
);


/* -------------------------------------------------------------------------
   Charts
   ------------------------------------------------------------------------- */


type LineProps = {
  series: number[];
  width: number;
  height: number;
  progress: number;
  color?: string;
  fillFrom?: string;
  labels?: string[];
  padding?: { t: number; r: number; b: number; l: number };
  suffix?: string;
  gridLines?: number;
  id: string;
};

export const LineChart: React.FC<LineProps> = ({
  series,
  width,
  height,
  progress,
  color = C.blue,
  fillFrom = "rgba(37,99,235,0.22)",
  labels,
  padding = { t: 18, r: 18, b: 30, l: 46 },
  suffix = "",
  gridLines = 4,
  id,
}) => {
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;
  const lo = min - span * 0.22;
  const hi = max + span * 0.22;

  const iw = width - padding.l - padding.r;
  const ih = height - padding.t - padding.b;

  const x = (i: number) => padding.l + (i / (series.length - 1)) * iw;
  const y = (v: number) => padding.t + (1 - (v - lo) / (hi - lo)) * ih;

  const d = series.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(2)},${y(v).toFixed(2)}`).join(" ");
  const area = `${d} L${x(series.length - 1).toFixed(2)},${(padding.t + ih).toFixed(2)} L${x(0).toFixed(2)},${(padding.t + ih).toFixed(2)} Z`;

  const visible = Math.max(0, Math.min(series.length, progress * series.length));

  return (
    <svg width={width} height={height} style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fillFrom} />
          <stop offset="100%" stopColor="rgba(37,99,235,0)" />
        </linearGradient>
        <clipPath id={`clip-${id}`}>
          <rect x={0} y={0} width={padding.l + iw * progress} height={height} />
        </clipPath>
      </defs>

      {Array.from({ length: gridLines + 1 }).map((_, i) => {
        const gy = padding.t + (i / gridLines) * ih;
        return (
          <line
            key={i}
            x1={padding.l}
            x2={padding.l + iw}
            y1={gy}
            y2={gy}
            stroke={C.borderLight}
            strokeWidth={1}
          />
        );
      })}

      {Array.from({ length: gridLines + 1 }).map((_, i) => {
        const val = hi - (i / gridLines) * (hi - lo);
        return (
          <text
            key={i}
            x={padding.l - 10}
            y={padding.t + (i / gridLines) * ih + 4}
            textAnchor="end"
            fontSize={11.5}
            fill={C.soft}
          >
            {val.toFixed(0)}
            {suffix}
          </text>
        );
      })}

      <g clipPath={`url(#clip-${id})`}>
        <path d={area} fill={`url(#grad-${id})`} />
      </g>

      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - progress}
      />

      {series.map((v, i) => {
        const appear = Math.max(0, Math.min(1, visible - i));
        if (appear <= 0) return null;
        return (
          <g key={i} opacity={appear}>
            <circle cx={x(i)} cy={y(v)} r={5.5 * appear} fill="#fff" stroke={color} strokeWidth={2.6} />
          </g>
        );
      })}

      {labels
        ? labels.map((l, i) => (
            <text
              key={l + i}
              x={x(i)}
              y={height - 8}
              textAnchor="middle"
              fontSize={11.5}
              fill={C.soft}
            >
              {l}
            </text>
          ))
        : null}
    </svg>
  );
};

export const BarChart: React.FC<{
  data: { month: string; value: number }[];
  width: number;
  height: number;
  progress: number;
}> = ({ data, width, height, progress }) => {
  const pad = { t: 16, r: 10, b: 34, l: 60 };
  const iw = width - pad.l - pad.r;
  const ih = height - pad.t - pad.b;
  const max = Math.max(...data.map((d) => d.value)) * 1.12;
  const slot = iw / data.length;
  const bw = Math.min(58, slot * 0.52);

  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
      </defs>

      {Array.from({ length: 5 }).map((_, i) => {
        const gy = pad.t + (i / 4) * ih;
        return (
          <g key={i}>
            <line x1={pad.l} x2={pad.l + iw} y1={gy} y2={gy} stroke={C.borderLight} strokeWidth={1} />
            <text x={pad.l - 12} y={gy + 4} textAnchor="end" fontSize={11.5} fill={C.soft}>
              {Math.round((max - (i / 4) * max) / 1000)}k
            </text>
          </g>
        );
      })}

      {data.map((d, i) => {
        const local = Math.max(0, Math.min(1, progress * data.length - i * 0.55));
        const h = (d.value / max) * ih * local;
        const bx = pad.l + slot * i + (slot - bw) / 2;
        return (
          <g key={d.month}>
            <rect
              x={bx}
              y={pad.t + ih - h}
              width={bw}
              height={h}
              rx={7}
              fill={i === data.length - 1 ? "url(#barGrad)" : "#BFD6FB"}
            />
            <text x={bx + bw / 2} y={height - 10} textAnchor="middle" fontSize={12} fill={C.muted}>
              {d.month}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export const Donut: React.FC<{
  percent: number;
  progress: number;
  size?: number;
  label: string;
  caption: string;
}> = ({ percent, progress, size = 150, label, caption }) => {
  const r = size / 2 - 12;
  const circ = 2 * Math.PI * r;
  const shown = (percent / 100) * progress;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#E4ECF8" strokeWidth={13} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={C.blue}
          strokeWidth={13}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - shown)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text
          x={size / 2}
          y={size / 2 + 8}
          textAnchor="middle"
          fontSize={26}
          fontWeight={700}
          fill={C.navy}
        >
          {Math.round(percent * progress)}%
        </text>
      </svg>
      <div>
        <div style={{ fontSize: 16, fontWeight: 600, color: C.navy }}>{label}</div>
        <div style={{ fontSize: 13.5, color: C.muted, marginTop: 4, maxWidth: 190, lineHeight: 1.45 }}>
          {caption}
        </div>
      </div>
    </div>
  );
};


/* -------------------------------------------------------------------------
   Cinematic stage - background, headline, camera
   ------------------------------------------------------------------------- */


/** Continuous cinematic backdrop: dark gradient, drifting glows, faint grid. */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 190) * 60;
  const drift2 = Math.cos(frame / 240) * 80;

  return (
    <AbsoluteFill style={{ background: C.stage0 }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 90% at 50% -12%, #16233C 0%, ${C.stage1} 42%, ${C.stage0} 100%)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: -260 + drift,
          top: -220,
          width: 1150,
          height: 900,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(37,99,235,.30) 0%, rgba(37,99,235,0) 68%)",
          filter: "blur(20px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -320 - drift2,
          bottom: -340,
          width: 1250,
          height: 980,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(59,130,246,.22) 0%, rgba(59,130,246,0) 70%)",
          filter: "blur(24px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "38%",
          width: 1500,
          height: 700,
          transform: "translate(-50%,-50%)",
          background:
            "radial-gradient(ellipse, rgba(96,165,250,.14) 0%, rgba(96,165,250,0) 65%)",
        }}
      />

      {/* faint technical grid */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.030) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.030) 1px, transparent 1px)",
          backgroundSize: "90px 90px",
          maskImage:
            "radial-gradient(78% 68% at 50% 42%, rgba(0,0,0,.9) 0%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            "radial-gradient(78% 68% at 50% 42%, rgba(0,0,0,.9) 0%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(100% 80% at 50% 50%, rgba(0,0,0,0) 40%, rgba(0,0,0,.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

export const Headline: React.FC<{
  eyebrow: string;
  title: string;
  delay?: number;
  fps: number;
}> = ({ eyebrow, title, delay = 0, fps }) => {
  const frame = useCurrentFrame();
  const p1 = enter(frame, fps, delay);
  const p2 = enter(frame, fps, delay + 5);

  return (
    <div
      style={{
        position: "absolute",
        top: 46,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          fontSize: 15,
          letterSpacing: "0.24em",
          fontWeight: 600,
          color: "#60A5FA",
          textTransform: "uppercase",
          opacity: p1 * 0.95,
          transform: `translateY(${(1 - p1) * 14}px)`,
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          marginTop: 12,
          fontSize: 50,
          fontWeight: 600,
          color: C.ink,
          letterSpacing: -1.1,
          opacity: p2,
          transform: `translateY(${(1 - p2) * 22}px)`,
          textShadow: "0 6px 40px rgba(37,99,235,.28)",
        }}
      >
        {title}
      </div>
    </div>
  );
};

/**
 * Positions the application window on the stage with a slow camera push-in
 * and a gentle rise-into-frame entrance.
 */
export const WindowStage: React.FC<{
  scale: number;
  entrance: number;
  children: React.ReactNode;
  top?: number;
}> = ({ scale, entrance, children, top = 176 }) => {
  const lift = (1 - entrance) * 70;
  const blur = (1 - entrance) * 9;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top,
        transform: `translateX(-50%) translateY(${lift}px) scale(${scale})`,
        transformOrigin: "top center",
        opacity: entrance,
        filter: blur > 0.15 ? `blur(${blur}px)` : "none",
        width: WIN.w,
        height: WIN.h,
      }}
    >
      {/* glow bloom behind the window */}
      <div
        style={{
          position: "absolute",
          inset: -70,
          borderRadius: 60,
          background:
            "radial-gradient(60% 55% at 50% 45%, rgba(37,99,235,.28) 0%, rgba(37,99,235,0) 72%)",
          filter: "blur(30px)",
        }}
      />
      <div style={{ position: "relative" }}>{children}</div>
    </div>
  );
};

/** Utility: a scene-wide wrapper handling fade in / fade out. */
export const SceneFade: React.FC<{
  frame: number;
  duration: number;
  children: React.ReactNode;
}> = ({ frame, duration, children }) => {
  const opacity = interpolate(
    frame,
    [0, 13, duration - 15, duration],
    [0, 1, 1, 0],
    { ...clamp, easing: EASE_OUT }
  );
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};


/* -------------------------------------------------------------------------
   The Getwell application, rebuilt inside a browser window frame
   ------------------------------------------------------------------------- */


export type NavKey =
  | "dashboard"
  | "patients"
  | "appointments"
  | "panel"
  | "reports"
  | "settings";

const IconHome: React.FC<{ size?: number }> = ({ size = 19 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3.5 10.6 12 4l8.5 6.6V19a1.6 1.6 0 0 1-1.6 1.6H5.1A1.6 1.6 0 0 1 3.5 19Z" />
    <path d="M9.6 20.6v-6.2h4.8v6.2" />
  </svg>
);

const IconGear: React.FC<{ size?: number }> = ({ size = 19 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3.1" />
    <path d="M19.4 14.4a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.84 2.84l-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.04 1.56V21a2 2 0 1 1-4 0v-.12a1.7 1.7 0 0 0-1.1-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06A2 2 0 1 1 4.1 16.9l.06-.06a1.7 1.7 0 0 0 .34-1.88 1.7 1.7 0 0 0-1.56-1.04H3a2 2 0 1 1 0-4h.12a1.7 1.7 0 0 0 1.56-1.1 1.7 1.7 0 0 0-.34-1.88L4.28 6.9A2 2 0 1 1 7.12 4.06l.06.06a1.7 1.7 0 0 0 1.88.34H9.2a1.7 1.7 0 0 0 1.04-1.56V3a2 2 0 1 1 4 0v.12a1.7 1.7 0 0 0 1.04 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.84 2.84l-.06.06a1.7 1.7 0 0 0-.34 1.88v.06a1.7 1.7 0 0 0 1.56 1.04H21a2 2 0 1 1 0 4h-.12a1.7 1.7 0 0 0-1.48 1.04Z" />
  </svg>
);

const NAV: { group: string; key: NavKey; label: string; Icon: React.FC<{ size?: number }> }[] = [
  { group: "MAIN", key: "dashboard", label: "Dashboard", Icon: IconHome },
  { group: "MAIN", key: "patients", label: "Patients", Icon: IconPerson },
  { group: "MAIN", key: "appointments", label: "Appointments", Icon: IconCalendar },
  { group: "MANAGEMENT", key: "panel", label: "Panel", Icon: IconShield },
  { group: "MANAGEMENT", key: "reports", label: "Reports", Icon: IconChart },
  { group: "MANAGEMENT", key: "settings", label: "Settings", Icon: IconGear },
];

const NavLink: React.FC<{
  label: string;
  Icon: React.FC<{ size?: number }>;
  active: boolean;
}> = ({ label, Icon, active }) => (
  <div
    style={{
      display: "flex",
      gap: 13,
      alignItems: "center",
      padding: "14px 16px",
      borderRadius: 13,
      fontSize: 15,
      color: active ? C.navInk : "#17345F",
      fontWeight: active ? 600 : 400,
      background: active ? C.navActive : "transparent",
      margin: "5px 0",
    }}
  >
    <span style={{ display: "grid", placeItems: "center", width: 20, opacity: active ? 1 : 0.75 }}>
      <Icon />
    </span>
    <span>{label}</span>
  </div>
);

const Sidebar: React.FC<{ active: NavKey }> = ({ active }) => (
  <aside
    style={{
      width: WIN.sidebar,
      flex: `0 0 ${WIN.sidebar}px`,
      background: C.sidebar,
      borderRight: `1px solid ${C.border}`,
      display: "flex",
      flexDirection: "column",
    }}
  >
    <div
      style={{
        height: WIN.topbar,
        padding: "0 22px",
        borderBottom: `1px solid ${C.border}`,
        display: "flex",
        alignItems: "center",
        gap: 13,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          background: `linear-gradient(135deg, ${C.blueSoft}, ${C.blue})`,
          color: "#fff",
          display: "grid",
          placeItems: "center",
          fontWeight: 700,
          fontSize: 20,
          boxShadow: "0 8px 18px rgba(37,99,235,.30)",
        }}
      >
        G
      </div>
      <div>
        <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: 0.6, color: C.navy }}>
          GETWELL
        </div>
        <div style={{ fontSize: 12.5, color: C.muted, marginTop: 1 }}>Weight Loss Admin</div>
      </div>
    </div>

    <nav style={{ padding: "24px 14px", flex: 1 }}>
      {["MAIN", "MANAGEMENT"].map((group, gi) => (
        <div key={group} style={{ marginTop: gi === 0 ? 0 : 22 }}>
          <div
            style={{
              fontSize: 12,
              color: C.soft,
              letterSpacing: "0.12em",
              fontWeight: 600,
              margin: "0 12px 10px",
            }}
          >
            {group}
          </div>
          {NAV.filter((n) => n.group === group).map((n) => (
            <NavLink key={n.key} label={n.label} Icon={n.Icon} active={n.key === active} />
          ))}
        </div>
      ))}
    </nav>

    <div style={{ padding: 14, borderTop: `1px solid ${C.border}` }}>
      <div
        style={{
          padding: 14,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          background: "#fff",
          display: "flex",
          gap: 12,
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "#DCEBFF",
            color: C.blue,
            display: "grid",
            placeItems: "center",
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          DR
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>Dr. Rashid</div>
          <div style={{ fontSize: 12.5, color: C.muted }}>Administrator</div>
        </div>
      </div>
    </div>
  </aside>
);

const Topbar: React.FC<{
  title: string;
  subtitle: string;
  searchText?: string;
  searchFocus?: number;
}> = ({ title, subtitle, searchText, searchFocus = 0 }) => (
  <div
    style={{
      height: WIN.topbar,
      background: "#fff",
      borderBottom: `1px solid ${C.border}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px 0 32px",
      flex: `0 0 ${WIN.topbar}px`,
    }}
  >
    <div>
      <div style={{ fontSize: 23, fontWeight: 700, color: C.navy, letterSpacing: -0.3 }}>
        {title}
      </div>
      <div style={{ fontSize: 14.5, color: C.muted, marginTop: 3 }}>{subtitle}</div>
    </div>

    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          width: 330,
          height: 48,
          border: `1px solid ${searchFocus > 0 ? C.blue : C.border}`,
          borderRadius: 12,
          background: "#fff",
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 14px",
          boxShadow:
            searchFocus > 0
              ? `0 0 0 ${4 * searchFocus}px rgba(37,99,235,${0.14 * searchFocus})`
              : "none",
        }}
      >
        <span style={{ color: C.soft, display: "grid", placeItems: "center" }}>
          <IconSearch />
        </span>
        <span
          style={{
            fontSize: 15,
            color: searchText ? C.navy : C.soft,
            fontWeight: searchText ? 500 : 400,
          }}
        >
          {searchText || "Search patients, appointments…"}
        </span>
        {searchFocus > 0 && searchText ? (
          <span
            style={{
              width: 2,
              height: 20,
              background: C.blue,
              marginLeft: 1,
              opacity: 0.9,
            }}
          />
        ) : null}
      </div>

      {[<IconBell key="b" />, <IconMoon key="m" />].map((icon, i) => (
        <div
          key={i}
          style={{
            width: 48,
            height: 48,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            background: "#fff",
            display: "grid",
            placeItems: "center",
            color: "#334155",
            position: "relative",
          }}
        >
          {icon}
          {i === 0 ? (
            <span
              style={{
                position: "absolute",
                top: -5,
                right: -5,
                minWidth: 20,
                height: 20,
                borderRadius: 999,
                background: C.blue,
                color: "#fff",
                border: "2px solid #fff",
                fontSize: 11,
                fontWeight: 700,
                display: "grid",
                placeItems: "center",
              }}
            >
              5
            </span>
          ) : null}
        </div>
      ))}

      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: C.navy,
          color: "#fff",
          display: "grid",
          placeItems: "center",
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        DR
      </div>
    </div>
  </div>
);

/**
 * The application recreated inside a browser-style window frame.
 * Everything is laid out at a fixed logical size (WIN.w x WIN.h) and
 * scaled by the scene, so camera moves stay perfectly crisp.
 */
export const AppWindow: React.FC<{
  active: NavKey;
  title: string;
  subtitle: string;
  url: string;
  searchText?: string;
  searchFocus?: number;
  children: React.ReactNode;
  contentStyle?: React.CSSProperties;
}> = ({ active, title, subtitle, url, searchText, searchFocus, children, contentStyle }) => (
  <div
    style={{
      width: WIN.w,
      height: WIN.h,
      borderRadius: 20,
      overflow: "hidden",
      background: C.page,
      fontFamily: FONT,
      display: "flex",
      flexDirection: "column",
      boxShadow:
        "0 70px 130px rgba(2,6,23,.62), 0 12px 40px rgba(2,6,23,.45), 0 0 0 1px rgba(255,255,255,.10)",
    }}
  >
    {/* Browser chrome */}
    <div
      style={{
        height: WIN.chrome,
        flex: `0 0 ${WIN.chrome}px`,
        background: "#E9EFF8",
        borderBottom: `1px solid ${C.border}`,
        display: "flex",
        alignItems: "center",
        padding: "0 18px",
        gap: 18,
      }}
    >
      <div style={{ display: "flex", gap: 9 }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((col) => (
          <span
            key={col}
            style={{ width: 13, height: 13, borderRadius: "50%", background: col }}
          />
        ))}
      </div>
      <div
        style={{
          flex: 1,
          maxWidth: 520,
          height: 30,
          borderRadius: 999,
          background: "#fff",
          border: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          gap: 9,
          padding: "0 14px",
          margin: "0 auto",
        }}
      >
        <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke={C.green} strokeWidth={2.2} strokeLinecap="round">
          <rect x="5" y="10.5" width="14" height="9.5" rx="2.4" />
          <path d="M8.4 10.5V8a3.6 3.6 0 0 1 7.2 0v2.5" />
        </svg>
        <span style={{ fontSize: 13, color: C.muted }}>{url}</span>
      </div>
      <div style={{ width: 62 }} />
    </div>

    {/* Application */}
    <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
      <Sidebar active={active} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Topbar title={title} subtitle={subtitle} searchText={searchText} searchFocus={searchFocus} />
        <div
          style={{
            flex: 1,
            padding: "22px 30px 26px",
            overflow: "hidden",
            position: "relative",
            ...contentStyle,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  </div>
);


/* -------------------------------------------------------------------------
   SCENE 1 - Intro
   ------------------------------------------------------------------------- */


export const Intro: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mark = enter(frame, fps, 4);
  const title = enter(frame, fps, 18);
  const sub = enter(frame, fps, 30);
  const rule = interpolate(frame, [34, 62], [0, 1], { ...clamp, easing: EASE_OUT });

  // Everything drifts forward very slightly, then leaves toward the viewer.
  const drift = interpolate(frame, [0, duration], [1, 1.05], clamp);
  const exit = interpolate(frame, [duration - 22, duration], [0, 26], clamp);

  const glow = interpolate(frame, [0, 40], [0, 1], clamp);

  return (
    <AbsoluteFill
      style={{
        fontFamily: FONT,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 620,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(37,99,235,.30) 0%, rgba(37,99,235,0) 68%)",
          opacity: glow,
          filter: "blur(10px)",
        }}
      />

      <div
        style={{
          transform: `scale(${drift}) translateY(${-exit}px)`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 116,
            height: 116,
            borderRadius: 30,
            margin: "0 auto 40px",
            background: `linear-gradient(135deg, ${C.blueSoft}, ${C.blue})`,
            color: "#fff",
            display: "grid",
            placeItems: "center",
            fontSize: 54,
            fontWeight: 700,
            boxShadow:
              "0 26px 70px rgba(37,99,235,.55), 0 0 0 1px rgba(255,255,255,.14) inset",
            opacity: mark,
            transform: `scale(${0.82 + mark * 0.18})`,
          }}
        >
          G
        </div>

        <div
          style={{
            fontSize: 92,
            fontWeight: 700,
            color: C.ink,
            letterSpacing: -2.6,
            lineHeight: 1.04,
            opacity: title,
            transform: `translateY(${(1 - title) * 34}px)`,
            textShadow: "0 10px 60px rgba(37,99,235,.35)",
          }}
        >
          Meet Getwell Admin
        </div>

        <div
          style={{
            width: 120 * rule,
            height: 3,
            borderRadius: 999,
            background: `linear-gradient(90deg, rgba(37,99,235,0), ${C.blueSoft}, rgba(37,99,235,0))`,
            margin: "30px auto 26px",
            opacity: rule,
          }}
        />

        <div
          style={{
            fontSize: 31,
            fontWeight: 400,
            color: C.inkMuted,
            letterSpacing: 0.2,
            opacity: sub,
            transform: `translateY(${(1 - sub) * 20}px)`,
          }}
        >
          Smarter weight loss management.
        </div>
      </div>
    </AbsoluteFill>
  );
};


/* -------------------------------------------------------------------------
   SCENE 2 - Dashboard
   ------------------------------------------------------------------------- */


const focusRing = (v: number): React.CSSProperties =>
  v <= 0
    ? {}
    : {
        boxShadow: `0 10px 34px rgba(15,23,42,.07), 0 0 0 ${2 * v}px rgba(37,99,235,${
          0.9 * v
        }), 0 0 46px rgba(37,99,235,${0.4 * v})`,
        transform: `scale(${1 + 0.018 * v})`,
      };

export const Dashboard: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = enter(frame, fps, 0);
  const scale = pushIn(frame, duration, 0.845, 0.895);
  const ringFollowUp = pulse(frame, 112, 40, 15);

  const kpis = [
    {
      label: "TOTAL PATIENTS",
      value: countUp(frame, 20, 40, 128),
      sub: "↑ 9 new this month",
      subTone: "up" as const,
      icon: <IconPeople />,
      iconTone: "blue" as const,
    },
    {
      label: "ACTIVE PATIENTS",
      value: countUp(frame, 25, 40, 96),
      sub: "Currently in program",
      subTone: "muted" as const,
      icon: <IconPerson />,
      iconTone: "green" as const,
    },
    {
      label: "DUE FOLLOW-UP",
      value: countUp(frame, 30, 40, 12),
      sub: "● Requires attention",
      subTone: "warn" as const,
      icon: <IconClock />,
      iconTone: "amber" as const,
    },
    {
      label: "PANEL PATIENTS",
      value: countUp(frame, 35, 40, 35),
      sub: "Using panel / insurance",
      subTone: "link" as const,
      icon: <IconShield />,
      iconTone: "violet" as const,
    },
  ];

  return (
    <AbsoluteFill>
      <Headline eyebrow="Dashboard" title="Everything in one place." fps={fps} delay={2} />

      <WindowStage scale={scale} entrance={entrance}>
        <AppWindow
          active="dashboard"
          title="Dashboard"
          subtitle="Clinic overview for today"
          url="getwell.clinic/index.html"
        >
          {/* date pill */}
          <div style={{ ...fadeUp(frame, fps, 10, 14), marginBottom: 14 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                background: "#fff",
                border: `1px solid ${C.border}`,
                borderRadius: 999,
                padding: "8px 16px",
                fontSize: 14,
                color: C.muted,
                fontWeight: 500,
              }}
            >
              <span style={{ color: C.blue, display: "grid", placeItems: "center" }}>
                <IconCalendar size={17} />
              </span>
              Wednesday, 2 Sep 2026
            </span>
          </div>

          {/* KPI grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 16,
              marginBottom: 16,
            }}
          >
            {kpis.map((k, i) => (
              <Kpi
                key={k.label}
                {...k}
                style={{
                  ...fadeUp(frame, fps, 16 + i * 5, 24),
                  ...(i === 2 ? focusRing(ringFollowUp) : {}),
                }}
              />
            ))}
          </div>

          {/* three dashboard cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
              height: 484,
            }}
          >
            <Card style={{ ...fadeUp(frame, fps, 42, 26) }}>
              <CardHead
                title="Today's Appointments"
                sub="6 scheduled for today"
                right="View all"
              />
              <div style={{ flex: 1 }}>
                {TODAY_APPOINTMENTS.slice(0, 5).map((a, i) => {
                  const p = enter(frame, fps, 56 + i * 4);
                  return (
                    <div key={a.id + a.time} style={{ opacity: p, transform: `translateX(${(1 - p) * 14}px)` }}>
                      <Row>
                        <span
                          style={{
                            fontSize: 13.5,
                            fontWeight: 600,
                            color: C.blueDeep,
                            width: 76,
                            flex: "0 0 76px",
                          }}
                        >
                          {a.time}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: 14.5,
                              fontWeight: 600,
                              color: C.navy,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {a.patient}
                          </div>
                          <div
                            style={{
                              fontSize: 13,
                              color: C.muted,
                              marginTop: 2,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {a.id} · {a.type}
                          </div>
                        </div>
                        <Badge
                          tone={
                            a.status === "Completed"
                              ? "green"
                              : a.status === "No Show"
                              ? "red"
                              : "blue"
                          }
                        >
                          {a.status}
                        </Badge>
                      </Row>
                    </div>
                  );
                })}
              </div>
              <div
                style={{
                  padding: "14px 22px",
                  borderTop: `1px solid ${C.borderLight}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  fontSize: 14,
                  fontWeight: 600,
                  color: C.blueDeep,
                }}
              >
                <IconCalendar size={17} /> View Full Calendar
              </div>
            </Card>

            <Card style={{ ...fadeUp(frame, fps, 49, 26) }}>
              <CardHead
                title="Patients Due for Follow-Up"
                sub="12 due · 30 days due · 45 days overdue"
                right="View all"
              />
              <div style={{ flex: 1 }}>
                {FOLLOW_UPS.map((f, i) => {
                  const p = enter(frame, fps, 62 + i * 4);
                  return (
                    <div key={f.id} style={{ opacity: p, transform: `translateX(${(1 - p) * 14}px)` }}>
                      <Row>
                        <Avatar size={38} radius={11}>
                          {f.initials}
                        </Avatar>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: 14.5,
                              fontWeight: 600,
                              color: C.navy,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {f.name}
                          </div>
                          <div
                            style={{
                              fontSize: 13,
                              color: C.muted,
                              marginTop: 2,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {f.id} · {f.days} days since visit
                          </div>
                        </div>
                        <span
                          style={{
                            fontSize: 12.5,
                            fontWeight: 600,
                            color: f.level === "overdue" ? C.redInk : C.orangeInk,
                            background: f.level === "overdue" ? C.redSoft : C.orangeSoft,
                            borderRadius: 999,
                            padding: "5px 11px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {f.label}
                        </span>
                      </Row>
                    </div>
                  );
                })}
              </div>
              <div
                style={{
                  padding: "14px 22px",
                  borderTop: `1px solid ${C.borderLight}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  fontSize: 14,
                  fontWeight: 600,
                  color: C.blueDeep,
                }}
              >
                <IconChart size={17} /> View All Follow-Ups
              </div>
            </Card>

            <Card style={{ ...fadeUp(frame, fps, 56, 26) }}>
              <CardHead
                title="Programme Overview"
                sub="Clinic-wide totals across 118 patients"
              />
              <div style={{ padding: 20, flex: 1 }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                  }}
                >
                  {[
                    { label: "Patients Tracked", value: countUp(frame, 66, 34, 118), tone: C.navy },
                    { label: "Goals Achieved", value: countUp(frame, 70, 34, 41), tone: C.green },
                    { label: "On Track", value: countUp(frame, 74, 34, 58), tone: C.blue },
                    { label: "Not Yet Progressing", value: countUp(frame, 78, 34, 19), tone: C.navy },
                  ].map((t, i) => (
                    <div
                      key={t.label}
                      style={{
                        border: `1px solid ${C.border}`,
                        borderRadius: 12,
                        background: C.surface,
                        padding: "16px 16px",
                        ...fadeUp(frame, fps, 64 + i * 4, 18),
                      }}
                    >
                      <div style={{ fontSize: 12.5, color: C.muted }}>{t.label}</div>
                      <div
                        style={{
                          fontSize: 30,
                          fontWeight: 700,
                          marginTop: 6,
                          color: t.tone,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {t.value}
                      </div>
                    </div>
                  ))}
                </div>
                <p
                  style={{
                    fontSize: 13,
                    color: C.muted,
                    lineHeight: 1.55,
                    marginTop: 16,
                    marginBottom: 0,
                    ...fadeUp(frame, fps, 84, 14),
                  }}
                >
                  Clinic-level head counts. Individual weight and body-composition
                  progress is charted on each patient's own profile.
                </p>
              </div>
              <div
                style={{
                  padding: "14px 22px",
                  borderTop: `1px solid ${C.borderLight}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  fontSize: 14,
                  fontWeight: 600,
                  color: C.blueDeep,
                }}
              >
                <IconChart size={17} /> View Reports
              </div>
            </Card>
          </div>
        </AppWindow>
      </WindowStage>
    </AbsoluteFill>
  );
};


/* -------------------------------------------------------------------------
   SCENE 3 - Patients
   ------------------------------------------------------------------------- */


const QUERY = "Nurul";
const MATCH_ID = "GW-1042";

export const Patients: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = enter(frame, fps, 0);
  const scale = pushIn(frame, duration, 0.85, 0.9);

  const typedChars = Math.round(
    interpolate(frame, [66, 96], [0, QUERY.length], clamp)
  );
  const typed = QUERY.slice(0, typedChars);
  const searchFocus = interpolate(frame, [58, 70], [0, 1], clamp);
  const filtered = interpolate(frame, [100, 116], [0, 1], clamp);
  const ring = pulse(frame, 118, 58, 14);
  const openPulse = pulse(frame, 138, 40, 12);

  const rows = PATIENTS.slice(0, 5);

  return (
    <AbsoluteFill>
      <Headline eyebrow="Patients" title="Manage every patient with ease." fps={fps} delay={2} />

      <WindowStage scale={scale} entrance={entrance}>
        <AppWindow
          active="patients"
          title="Patients"
          subtitle="All patients use GW-XXXX IDs"
          url="getwell.clinic/patients.html"
        >
          {/* page head */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 14,
              ...fadeUp(frame, fps, 8, 16),
            }}
          >
            <div
              style={{
                background: C.blue,
                color: "#fff",
                borderRadius: 11,
                padding: "12px 20px",
                fontSize: 15,
                fontWeight: 600,
                boxShadow: "0 8px 20px rgba(37,99,235,.28)",
              }}
            >
              ＋ Add Patient
            </div>
          </div>

          {/* KPI row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 16,
              marginBottom: 16,
            }}
          >
            {[
              { label: "TOTAL PATIENTS", to: 128 },
              { label: "ACTIVE PATIENTS", to: 96 },
              { label: "PANEL PATIENTS", to: 35 },
              { label: "INACTIVE", to: 32 },
            ].map((k, i) => (
              <div
                key={k.label}
                style={{
                  padding: "18px 20px",
                  border: `1px solid ${C.border}`,
                  background: "#fff",
                  borderRadius: 16,
                  boxShadow: "0 10px 34px rgba(15,23,42,.07)",
                  ...fadeUp(frame, fps, 12 + i * 5, 22),
                }}
              >
                <div style={{ fontSize: 13, color: C.muted, fontWeight: 500 }}>{k.label}</div>
                <div
                  style={{
                    fontSize: 34,
                    fontWeight: 700,
                    color: C.navy,
                    marginTop: 4,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {countUp(frame, 16 + i * 5, 36, k.to)}
                </div>
              </div>
            ))}
          </div>

          {/* patient list */}
          <Card style={{ ...fadeUp(frame, fps, 34, 26) }}>
            <div
              style={{
                padding: "20px 24px",
                borderBottom: `1px solid ${C.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 20,
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: C.navy }}>
                  Patient List
                </h2>
                <p style={{ margin: "6px 0 0", fontSize: 14, color: C.muted }}>
                  {filtered > 0.5
                    ? "1 patient matching “" + QUERY + "”"
                    : "Showing 5 of 128 patients"}
                </p>
              </div>
              <div
                style={{
                  width: 340,
                  height: 46,
                  border: `1px solid ${searchFocus > 0.4 ? C.blue : C.border}`,
                  borderRadius: 11,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "0 14px",
                  background: "#fff",
                  boxShadow: `0 0 0 ${4 * searchFocus}px rgba(37,99,235,${0.13 * searchFocus})`,
                }}
              >
                <span style={{ color: searchFocus > 0.4 ? C.blue : C.soft, display: "grid" }}>
                  <IconSearch />
                </span>
                <span style={{ fontSize: 15, color: typed ? C.navy : C.soft, fontWeight: typed ? 500 : 400 }}>
                  {typed || "Search name, ID or phone"}
                </span>
                {searchFocus > 0.4 ? (
                  <span
                    style={{
                      width: 2,
                      height: 19,
                      background: C.blue,
                      opacity: frame % 20 < 12 ? 1 : 0.15,
                    }}
                  />
                ) : null}
              </div>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <Th>Patient</Th>
                  <Th>ID</Th>
                  <Th>Panel / Payment</Th>
                  <Th>Current</Th>
                  <Th>Goal</Th>
                  <Th>Last Visit</Th>
                  <Th>Status</Th>
                  <Th />
                </tr>
              </thead>
              <tbody>
                {rows.map((p, i) => {
                  const appear = enter(frame, fps, 44 + i * 4);
                  const isMatch = p.id === MATCH_ID;
                  const dim = isMatch ? 0 : filtered;
                  const opacity = appear * (1 - dim * 0.74);
                  const bg = isMatch
                    ? `rgba(37,99,235,${0.05 * ring})`
                    : "transparent";
                  return (
                    <tr
                      key={p.id}
                      style={{
                        opacity,
                        background: bg,
                        transform: `translateX(${(1 - appear) * 16}px)`,
                        outline: isMatch && ring > 0 ? `2px solid rgba(37,99,235,${0.75 * ring})` : "none",
                        outlineOffset: -2,
                      }}
                    >
                      <Td>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
                          <Avatar size={38} radius={11}>
                            {p.initials}
                          </Avatar>
                          <strong style={{ fontWeight: 600 }}>{p.name}</strong>
                        </span>
                      </Td>
                      <Td style={{ color: C.muted }}>{p.id}</Td>
                      <Td>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "6px 12px",
                            borderRadius: 999,
                            background: C.blueChip,
                            border: "1px solid #C7DFFF",
                            color: C.blueDeep,
                            fontSize: 13,
                            fontWeight: 600,
                          }}
                        >
                          {p.panel}
                        </span>
                      </Td>
                      <Td>{p.current.toFixed(1)} kg</Td>
                      <Td style={{ color: C.muted }}>{p.goal.toFixed(1)} kg</Td>
                      <Td style={{ color: C.muted }}>{p.lastVisit}</Td>
                      <Td>
                        <Badge tone={p.status === "Active" ? "green" : "gray"}>{p.status}</Badge>
                      </Td>
                      <Td align="right">
                        <span
                          style={{
                            display: "inline-block",
                            border: `1px solid ${isMatch ? C.blue : C.border}`,
                            color: C.blueDeep,
                            borderRadius: 9,
                            padding: "8px 13px",
                            fontSize: 13.5,
                            fontWeight: 600,
                            background: isMatch ? `rgba(37,99,235,${0.09 * openPulse})` : "#fff",
                            boxShadow: isMatch
                              ? `0 0 0 ${4 * openPulse}px rgba(37,99,235,${0.14 * openPulse})`
                              : "none",
                          }}
                        >
                          Open →
                        </span>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>

        </AppWindow>
      </WindowStage>
    </AbsoluteFill>
  );
};


/* -------------------------------------------------------------------------
   SCENE 4 - Patient Profile
   ------------------------------------------------------------------------- */


const TABS = [
  "Overview",
  "Visits",
  "Body Composition",
  "Appointments",
  "Panel Claims",
  "Files & Photos",
];

/** Two independently-scaled series drawn in one compact panel. */
const DualSpark: React.FC<{
  width: number;
  height: number;
  a: number[];
  b: number[];
  progress: number;
}> = ({ width, height, a, b, progress }) => {
  const pad = { t: 10, r: 10, b: 18, l: 10 };
  const iw = width - pad.l - pad.r;
  const ih = height - pad.t - pad.b;

  const path = (s: number[]) => {
    const min = Math.min(...s);
    const max = Math.max(...s);
    const span = max - min || 1;
    return s
      .map((v, i) => {
        const x = pad.l + (i / (s.length - 1)) * iw;
        const y = pad.t + (1 - (v - min) / span) * ih * 0.86 + ih * 0.07;
        return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");
  };

  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      {[0, 1, 2].map((i) => (
        <line
          key={i}
          x1={pad.l}
          x2={pad.l + iw}
          y1={pad.t + (i / 2) * ih}
          y2={pad.t + (i / 2) * ih}
          stroke={C.borderLight}
        />
      ))}
      <path
        d={path(a)}
        fill="none"
        stroke="#F59E0B"
        strokeWidth={2.8}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - progress}
      />
      <path
        d={path(b)}
        fill="none"
        stroke={C.blue}
        strokeWidth={2.8}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - progress}
      />
      {VISIT_LABELS.map((l, i) => (
        <text
          key={l}
          x={pad.l + (i / (VISIT_LABELS.length - 1)) * iw}
          y={height - 4}
          textAnchor="middle"
          fontSize={10.5}
          fill={C.soft}
        >
          {l}
        </text>
      ))}
    </svg>
  );
};

export const Profile: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = enter(frame, fps, 0);
  const scale = pushIn(frame, duration, 0.85, 0.902);

  const weightDraw = ramp(frame, 48, 72);
  const compDraw = ramp(frame, 96, 62);
  const lossRing = pulse(frame, 150, 46, 15);

  const tiles = [
    {
      label: "CURRENT WEIGHT",
      value: (74.2 * ramp(frame, 26, 32)).toFixed(1),
      unit: "kg",
      tone: C.navy,
    },
    {
      label: "TOTAL WEIGHT LOSS",
      value: "−" + (14.3 * ramp(frame, 30, 32)).toFixed(1),
      unit: "kg",
      tone: C.green,
    },
    { label: "BMI", value: (26.4 * ramp(frame, 34, 32)).toFixed(1), unit: "", tone: C.navy },
    {
      label: "RECORDED VISITS",
      value: String(Math.round(8 * ramp(frame, 38, 32))),
      unit: "",
      tone: C.navy,
    },
  ];

  return (
    <AbsoluteFill>
      <Headline eyebrow="Patient Profile" title="Track progress, visits & results." fps={fps} delay={2} />

      <WindowStage scale={scale} entrance={entrance}>
        <AppWindow
          active="patients"
          title="Patient Profile"
          subtitle="Nurul Aisyah Rahman · GW-1042"
          url="getwell.clinic/patient-profile.html?patient=GW-1042"
        >
          {/* hero */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 24,
              padding: "18px 24px",
              background: "#fff",
              border: `1px solid ${C.border}`,
              borderRadius: 16,
              boxShadow: "0 10px 34px rgba(15,23,42,.07)",
              marginBottom: 14,
              ...fadeUp(frame, fps, 8, 22),
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: 18,
                  background: "#DDEBFF",
                  color: C.blue,
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 700,
                  fontSize: 24,
                }}
              >
                NA
              </div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 700, color: C.navy, letterSpacing: -0.4 }}>
                  Nurul Aisyah Rahman
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginTop: 8,
                    fontSize: 13.5,
                    color: C.muted,
                  }}
                >
                  <span>GW-1042</span>
                  <Badge tone="green">Active</Badge>
                  <span
                    style={{
                      display: "inline-flex",
                      padding: "5px 12px",
                      borderRadius: 999,
                      background: C.blueChip,
                      border: "1px solid #C7DFFF",
                      color: C.blueDeep,
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    AIA Health
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 34, alignItems: "center" }}>
              {[
                { l: "Program Started", v: "11 Mar 2026" },
                { l: "Last Visit", v: "28 Aug 2026" },
                { l: "Next Expected", v: "11 Sep 2026" },
              ].map((d) => (
                <div key={d.l} style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                  <span style={{ fontSize: 12.5, color: C.soft }}>{d.l}</span>
                  <span style={{ fontSize: 14.5, fontWeight: 600, color: C.navy, marginTop: 3 }}>
                    {d.v}
                  </span>
                </div>
              ))}
              <div
                style={{
                  border: `1px solid ${C.border}`,
                  color: C.blueDeep,
                  borderRadius: 10,
                  padding: "11px 16px",
                  fontSize: 14,
                  fontWeight: 600,
                  background: "#fff",
                }}
              >
                ✎ Edit Patient
              </div>
            </div>
          </div>

          {/* tabs */}
          <div
            style={{
              display: "flex",
              gap: 26,
              background: "#fff",
              border: `1px solid ${C.border}`,
              borderRadius: 14,
              padding: "0 22px",
              marginBottom: 14,
              ...fadeUp(frame, fps, 14, 18),
            }}
          >
            {TABS.map((t) => {
              const active = t === "Body Composition";
              return (
                <div
                  key={t}
                  style={{
                    padding: "17px 4px 14px",
                    fontSize: 14,
                    color: active ? C.blueDeep : "#355277",
                    fontWeight: active ? 600 : 400,
                    borderBottom: `2px solid ${active ? C.blue : "transparent"}`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {t}
                </div>
              );
            })}
          </div>

          {/* main grid */}
          <div style={{ display: "grid", gridTemplateColumns: "730px 1fr", gap: 16, height: 486 }}>
            <Card style={{ ...fadeUp(frame, fps, 24, 26) }}>
              <CardHead title="Weight Progress" sub="Weight recorded at each visit (kg)" right="8 visits" />
              <div style={{ padding: "16px 20px 10px", flex: 1 }}>
                <LineChart
                  id="weight"
                  series={WEIGHT_SERIES}
                  labels={VISIT_LABELS}
                  width={686}
                  height={352}
                  progress={weightDraw}
                  suffix=""
                />
              </div>
            </Card>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {tiles.map((t, i) => (
                  <div
                    key={t.label}
                    style={{
                      border: `1px solid ${C.border}`,
                      borderRadius: 14,
                      background: i === 1 ? "#F3FBF6" : C.surface,
                      padding: "14px 18px",
                      ...fadeUp(frame, fps, 22 + i * 5, 20),
                      ...(i === 1 && lossRing > 0
                        ? {
                            boxShadow: `0 0 0 ${2 * lossRing}px rgba(22,163,74,${
                              0.75 * lossRing
                            }), 0 0 40px rgba(22,163,74,${0.28 * lossRing})`,
                            transform: `scale(${1 + 0.02 * lossRing})`,
                          }
                        : {}),
                    }}
                  >
                    <div style={{ fontSize: 12, color: C.muted, fontWeight: 500, letterSpacing: 0.3 }}>
                      {t.label}
                    </div>
                    <div
                      style={{
                        fontSize: 28,
                        fontWeight: 700,
                        color: t.tone,
                        marginTop: 4,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {t.value}
                      {t.unit ? (
                        <span style={{ fontSize: 16, fontWeight: 600, marginLeft: 4, color: C.muted }}>
                          {t.unit}
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>

              <Card style={{ flex: 1, ...fadeUp(frame, fps, 44, 24) }}>
                <div
                  style={{
                    padding: "16px 20px 10px",
                    borderBottom: `1px solid ${C.border}`,
                  }}
                >
                  <div style={{ fontSize: 17, fontWeight: 600, color: C.navy }}>
                    Body Composition Progress
                  </div>
                  <div style={{ display: "flex", gap: 18, marginTop: 9 }}>
                    {[
                      { c: "#F59E0B", l: "Body Fat", v: "33.1 %" },
                      { c: C.blue, l: "Skeletal Muscle", v: "24.1 kg" },
                    ].map((k) => (
                      <span
                        key={k.l}
                        style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, color: C.muted }}
                      >
                        <span style={{ width: 10, height: 10, borderRadius: 3, background: k.c }} />
                        {k.l}
                        <strong style={{ color: C.navy, fontWeight: 600 }}>{k.v}</strong>
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ padding: "8px 18px 4px" }}>
                  <DualSpark width={414} height={118} a={BODY_FAT_SERIES} b={MUSCLE_SERIES} progress={compDraw} />
                </div>
              </Card>
            </div>
          </div>
        </AppWindow>
      </WindowStage>
    </AbsoluteFill>
  );
};


/* -------------------------------------------------------------------------
   SCENE 5 - Appointments
   ------------------------------------------------------------------------- */


export const Appointments: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = enter(frame, fps, 0);
  const scale = pushIn(frame, duration, 0.85, 0.898);

  const noShowRing = pulse(frame, 104, 34, 14);
  const followRing = pulse(frame, 130, 46, 14);

  const kpis = [
    { label: "TODAY", value: countUp(frame, 18, 34, 6), sub: "Scheduled for today", icon: <IconCalendar />, iconTone: "blue" as const },
    { label: "UPCOMING", value: countUp(frame, 22, 34, 18), sub: "Next 14 days", icon: <IconClock />, iconTone: "violet" as const },
    { label: "COMPLETED", value: countUp(frame, 26, 34, 42), sub: "This month", icon: <IconCheck />, iconTone: "green" as const },
    { label: "NO SHOW", value: countUp(frame, 30, 34, 3), sub: "● Needs follow-up", subTone: "warn" as const, icon: <IconAlert />, iconTone: "amber" as const },
  ];

  return (
    <AbsoluteFill>
      <Headline eyebrow="Appointments" title="Never miss a follow-up." fps={fps} delay={2} />

      <WindowStage scale={scale} entrance={entrance}>
        <AppWindow
          active="appointments"
          title="Appointments"
          subtitle="Wednesday, 2 Sep 2026"
          url="getwell.clinic/appointments.html"
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 16,
              marginBottom: 16,
            }}
          >
            {kpis.map((k, i) => (
              <Kpi
                key={k.label}
                {...k}
                style={{
                  ...fadeUp(frame, fps, 10 + i * 5, 24),
                  ...(i === 3 && noShowRing > 0
                    ? {
                        boxShadow: `0 10px 34px rgba(15,23,42,.07), 0 0 0 ${2 * noShowRing}px rgba(245,158,11,${
                          0.85 * noShowRing
                        }), 0 0 44px rgba(245,158,11,${0.3 * noShowRing})`,
                        transform: `scale(${1 + 0.018 * noShowRing})`,
                      }
                    : {}),
                }}
              />
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "744px 1fr", gap: 16, height: 486 }}>
            <Card style={{ ...fadeUp(frame, fps, 34, 26) }}>
              <CardHead title="Appointment List" sub="Today's schedule across all doctors" right="Filter: Today" />
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <Th>Time</Th>
                    <Th>Patient</Th>
                    <Th>Type</Th>
                    <Th>Doctor</Th>
                    <Th>Status</Th>
                  </tr>
                </thead>
                <tbody>
                  {TODAY_APPOINTMENTS.map((a, i) => {
                    const p = enter(frame, fps, 46 + i * 4);
                    return (
                      <tr key={a.time} style={{ opacity: p, transform: `translateX(${(1 - p) * 16}px)` }}>
                        <Td style={{ fontWeight: 600, color: C.blueDeep }}>{a.time}</Td>
                        <Td>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 11 }}>
                            <Avatar size={34} radius={10}>
                              {a.patient
                                .split(" ")
                                .slice(0, 2)
                                .map((w) => w[0])
                                .join("")}
                            </Avatar>
                            <strong style={{ fontWeight: 600 }}>{a.patient}</strong>
                          </span>
                        </Td>
                        <Td>{a.type}</Td>
                        <Td style={{ color: C.muted }}>{a.doctor}</Td>
                        <Td>
                          <Badge
                            tone={
                              a.status === "Completed"
                                ? "green"
                                : a.status === "No Show"
                                ? "red"
                                : "blue"
                            }
                          >
                            {a.status}
                          </Badge>
                        </Td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>

            <Card style={{ ...fadeUp(frame, fps, 42, 26) }}>
              <CardHead title="Patients Due for Follow-Up" sub="12 due · 30 days due · 45 days overdue" />
              <div style={{ flex: 1 }}>
                {FOLLOW_UPS.slice(0, 4).map((f, i) => {
                  const p = enter(frame, fps, 56 + i * 5);
                  const hot = i === 0;
                  return (
                    <div
                      key={f.id}
                      style={{
                        opacity: p,
                        transform: `translateX(${(1 - p) * 14}px)`,
                        background: hot ? `rgba(220,38,38,${0.045 * followRing})` : "transparent",
                        outline: hot && followRing > 0 ? `2px solid rgba(220,38,38,${0.55 * followRing})` : "none",
                        outlineOffset: -2,
                      }}
                    >
                      <Row>
                        <Avatar size={38} radius={11}>
                          {f.initials}
                        </Avatar>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: 14.5,
                              fontWeight: 600,
                              color: C.navy,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {f.name}
                          </div>
                          <div
                            style={{
                              fontSize: 13,
                              color: C.muted,
                              marginTop: 2,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {f.id} · {f.days} days since visit
                          </div>
                        </div>
                        <span
                          style={{
                            fontSize: 12.5,
                            fontWeight: 600,
                            color: f.level === "overdue" ? C.redInk : C.orangeInk,
                            background: f.level === "overdue" ? C.redSoft : C.orangeSoft,
                            borderRadius: 999,
                            padding: "5px 11px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {f.label}
                        </span>
                      </Row>
                    </div>
                  );
                })}
              </div>
              <div style={{ padding: "16px 22px", borderTop: `1px solid ${C.borderLight}` }}>
                <div
                  style={{
                    background: C.blue,
                    color: "#fff",
                    borderRadius: 11,
                    padding: "13px 18px",
                    fontSize: 14.5,
                    fontWeight: 600,
                    textAlign: "center",
                    boxShadow: `0 8px 22px rgba(37,99,235,.30), 0 0 0 ${5 * followRing}px rgba(37,99,235,${
                      0.15 * followRing
                    })`,
                  }}
                >
                  Follow Up Now
                </div>
              </div>
            </Card>
          </div>
        </AppWindow>
      </WindowStage>
    </AbsoluteFill>
  );
};


/* -------------------------------------------------------------------------
   SCENE 6 - Reports
   ------------------------------------------------------------------------- */


export const Reports: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = enter(frame, fps, 0);
  const scale = pushIn(frame, duration, 0.85, 0.9);

  const bars = ramp(frame, 40, 62);
  const donut = ramp(frame, 62, 52);

  const revenue = Math.round(48650 * ramp(frame, 16, 42)).toLocaleString("en-US");

  const kpis = [
    { label: "TOTAL REVENUE", value: "RM " + revenue, sub: "Billing recorded from visits", icon: <IconMoney />, iconTone: "blue" as const, valueSize: 30 },
    { label: "TOTAL VISITS", value: countUp(frame, 20, 40, 214), sub: "196 completed", icon: <IconScale />, iconTone: "violet" as const },
    { label: "NEW PATIENTS", value: countUp(frame, 24, 40, 9), sub: "Started this month", icon: <IconPeople />, iconTone: "green" as const },
    { label: "ACTIVE PATIENTS", value: countUp(frame, 28, 40, 96), sub: "Currently active", icon: <IconChart />, iconTone: "amber" as const },
  ];

  return (
    <AbsoluteFill>
      <Headline eyebrow="Reports" title="Turn patient data into action." fps={fps} delay={2} />

      <WindowStage scale={scale} entrance={entrance}>
        <AppWindow
          active="reports"
          title="Reports"
          subtitle="Performance overview · August 2026"
          url="getwell.clinic/reports.html"
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 16,
              marginBottom: 16,
            }}
          >
            {kpis.map((k, i) => (
              <Kpi key={k.label} {...k} style={fadeUp(frame, fps, 8 + i * 5, 24)} />
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "736px 1fr", gap: 16, height: 494 }}>
            <Card style={{ ...fadeUp(frame, fps, 30, 26) }}>
              <CardHead
                title="Revenue Breakdown"
                sub="Monthly billing recorded from visits (RM)"
                right={<Badge tone="blue">August 2026</Badge>}
              />
              <div style={{ padding: "18px 20px 8px" }}>
                <BarChart data={REVENUE_SERIES} width={694} height={250} progress={bars} />
              </div>
              <div
                style={{
                  margin: "0 20px 18px",
                  padding: "16px 18px",
                  border: `1px solid ${C.border}`,
                  borderRadius: 13,
                  background: C.surface,
                  display: "flex",
                  justifyContent: "space-between",
                  ...fadeUp(frame, fps, 64, 18),
                }}
              >
                {[
                  { l: "Consultation", v: moneyShort(18400) },
                  { l: "Medication", v: moneyShort(16850) },
                  { l: "Body Composition", v: moneyShort(7900) },
                  { l: "Programme Fees", v: moneyShort(5500) },
                ].map((r) => (
                  <div key={r.l}>
                    <div style={{ fontSize: 12.5, color: C.muted }}>{r.l}</div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: C.navy, marginTop: 5 }}>
                      {r.v}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Card style={{ ...fadeUp(frame, fps, 38, 26) }}>
                <CardHead title="Panel Performance" sub="Claims during August 2026" />
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <Th>Panel</Th>
                      <Th align="right">Invoiced</Th>
                      <Th align="right">Claimed</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {PANEL_ROWS.slice(0, 3).map((r, i) => {
                      const p = enter(frame, fps, 50 + i * 5);
                      return (
                        <tr key={r.panel} style={{ opacity: p, transform: `translateX(${(1 - p) * 12}px)` }}>
                          <Td style={{ padding: "11px 16px" }}>
                            <strong style={{ fontWeight: 600 }}>{r.panel}</strong>
                            <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>
                              {r.patients} patients
                            </div>
                          </Td>
                          <Td align="right" style={{ padding: "11px 16px" }}>
                            {moneyShort(r.invoiced)}
                          </Td>
                          <Td
                            align="right"
                            style={{ color: C.green, fontWeight: 600, padding: "11px 16px" }}
                          >
                            {moneyShort(r.claimed)}
                          </Td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Card>

              <Card style={{ flex: 1, overflow: "hidden", ...fadeUp(frame, fps, 56, 26) }}>
                <div style={{ padding: "14px 18px" }}>
                  <Donut
                    percent={84}
                    progress={donut}
                    size={108}
                    label="Claims settled"
                    caption="RM 40,100 of RM 48,650 invoiced has been claimed back this month."
                  />
                </div>
              </Card>
            </div>
          </div>
        </AppWindow>
      </WindowStage>
    </AbsoluteFill>
  );
};


/* -------------------------------------------------------------------------
   SCENE 7 - Final CTA
   ------------------------------------------------------------------------- */


/** A very small abstraction of an app screen, used for the closing montage. */
const MiniPanel: React.FC<{
  x: number;
  y: number;
  rotate: number;
  progress: number;
  gather: number;
  accentRows: number;
  title: string;
  metric: string;
}> = ({ x, y, rotate, progress, gather, accentRows, title, metric }) => {
  const tx = x * (1 - gather);
  const ty = y * (1 - gather);
  const scale = (0.9 + progress * 0.1) * (1 - gather * 0.45);
  const opacity = progress * (1 - gather);

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: 340,
        marginLeft: -170,
        marginTop: -120,
        transform: `translate(${tx}px, ${ty}px) rotate(${rotate * (1 - gather)}deg) scale(${scale})`,
        opacity,
        background: "#fff",
        borderRadius: 18,
        border: `1px solid ${C.border}`,
        boxShadow: "0 40px 90px rgba(2,6,23,.55)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "14px 18px",
          borderBottom: `1px solid ${C.borderLight}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{title}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.blue }}>{metric}</span>
      </div>
      <div style={{ padding: "14px 18px 18px" }}>
        {Array.from({ length: accentRows }).map((_, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 11 }}>
            <span
              style={{
                width: 26,
                height: 26,
                borderRadius: 8,
                background: i === 0 ? "#DDEBFF" : C.surface,
                border: `1px solid ${C.borderLight}`,
              }}
            />
            <span
              style={{
                height: 9,
                borderRadius: 999,
                background: i === 0 ? "#CFE1FB" : "#E9EFF7",
                width: `${72 - i * 14}%`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export const Outro: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const panels = ramp(frame, 0, 22);
  const gather = interpolate(frame, [34, 66], [0, 1], { ...clamp, easing: EASE_OUT });

  const mark = enter(frame, fps, 52);
  const title = enter(frame, fps, 64);
  const sub = enter(frame, fps, 78);
  const rule = interpolate(frame, [92, 118], [0, 1], { ...clamp, easing: EASE_OUT });

  const words = ["Manage.", "Track.", "Grow."];
  const glow = interpolate(frame, [40, 90], [0, 1], clamp);
  const settle = interpolate(frame, [52, duration], [1.03, 1], clamp);

  return (
    <AbsoluteFill style={{ fontFamily: FONT, alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          position: "absolute",
          width: 1250,
          height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(37,99,235,.30) 0%, rgba(37,99,235,0) 66%)",
          opacity: glow,
          filter: "blur(12px)",
        }}
      />

      <MiniPanel x={-520} y={-120} rotate={-7} progress={panels} gather={gather} accentRows={3} title="Dashboard" metric="128" />
      <MiniPanel x={0} y={130} rotate={2} progress={panels} gather={gather} accentRows={3} title="Appointments" metric="6 today" />
      <MiniPanel x={520} y={-110} rotate={7} progress={panels} gather={gather} accentRows={3} title="Patient Profile" metric="−14.3 kg" />

      <div style={{ textAlign: "center", transform: `scale(${settle})` }}>
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 26,
            margin: "0 auto 34px",
            background: `linear-gradient(135deg, ${C.blueSoft}, ${C.blue})`,
            color: "#fff",
            display: "grid",
            placeItems: "center",
            fontSize: 44,
            fontWeight: 700,
            boxShadow: "0 24px 62px rgba(37,99,235,.55)",
            opacity: mark,
            transform: `scale(${0.85 + mark * 0.15})`,
          }}
        >
          G
        </div>

        <div
          style={{
            fontSize: 84,
            fontWeight: 700,
            color: C.ink,
            letterSpacing: -2.4,
            opacity: title,
            transform: `translateY(${(1 - title) * 28}px)`,
            textShadow: "0 10px 60px rgba(37,99,235,.35)",
          }}
        >
          Getwell Admin
        </div>

        <div
          style={{
            fontSize: 28,
            color: C.inkMuted,
            marginTop: 18,
            opacity: sub,
            transform: `translateY(${(1 - sub) * 18}px)`,
          }}
        >
          Built for smarter weight loss care.
        </div>

        <div
          style={{
            width: 460 * rule,
            height: 1,
            background:
              "linear-gradient(90deg, rgba(148,163,184,0), rgba(148,163,184,.45), rgba(148,163,184,0))",
            margin: "40px auto 32px",
            opacity: rule,
          }}
        />

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 26 }}>
          {words.map((w, i) => {
            const p = enter(frame, fps, 108 + i * 9);
            return (
              <React.Fragment key={w}>
                {i > 0 ? (
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: C.blueSoft,
                      opacity: p * 0.9,
                    }}
                  />
                ) : null}
                <span
                  style={{
                    fontSize: 34,
                    fontWeight: 600,
                    color: C.ink,
                    letterSpacing: 1.4,
                    opacity: p,
                    transform: `translateY(${(1 - p) * 14}px)`,
                  }}
                >
                  {w}
                </span>
              </React.Fragment>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 40,
            fontSize: 15,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#60A5FA",
            fontWeight: 600,
            opacity: enter(frame, fps, 136),
          }}
        >
          getwell.clinic
        </div>
      </div>
    </AbsoluteFill>
  );
};


/* -------------------------------------------------------------------------
   MASTER TIMELINE - the composition component itself
   ------------------------------------------------------------------------- */

const COMPONENTS: Record<SceneName, React.FC<{ duration: number }>> = {
  intro: Intro,
  dashboard: Dashboard,
  patients: Patients,
  profile: Profile,
  appointments: Appointments,
  reports: Reports,
  outro: Outro,
};

/** Cross-fades one scene in and (unless it is the last one) back out again. */
const SceneLayer: React.FC<{
  name: SceneName;
  duration: number;
  seqLen: number;
  isLast: boolean;
}> = ({ name, duration, seqLen, isLast }) => {
  const frame = useCurrentFrame();
  const Component = COMPONENTS[name];

  const opacity = isLast
    ? interpolate(frame, [0, 14], [0, 1], { ...clamp, easing: EASE_OUT })
    : interpolate(frame, [0, 14, seqLen - OVERLAP, seqLen], [0, 1, 1, 0], {
        ...clamp,
        easing: EASE_OUT,
      });

  return (
    <AbsoluteFill style={{ opacity }}>
      <Component duration={duration} />
    </AbsoluteFill>
  );
};

export const GetwellAdminPromo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.stage0, fontFamily: FONT }}>
      <Background />

      {SCENES.map((scene, i) => {
        const isLast = i === SCENES.length - 1;
        const seqLen = isLast ? scene.duration : scene.duration + OVERLAP;
        return (
          <Sequence
            key={scene.name}
            from={scene.from}
            durationInFrames={seqLen}
            name={scene.name}
          >
            <SceneLayer
              name={scene.name}
              duration={scene.duration}
              seqLen={seqLen}
              isLast={isLast}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
