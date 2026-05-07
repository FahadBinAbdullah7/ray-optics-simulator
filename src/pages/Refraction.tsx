import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import { Microscope, Play, Pause, Info, Plus, Trash2, Lightbulb } from "lucide-react";

type Mode = "slab" | "prism" | "stick";

// ============== LEARNING OUTCOMES ==============
interface LearningOutcome {
  mode: Mode;
  title: string;
  message: string;
  tips: string[];
}

const LEARNING_OUTCOMES: Record<Mode, LearningOutcome> = {
  slab: {
    mode: "slab",
    title: "কাঁচের স্ল্যাব",
    message: "কাঁচের স্ল্যাব দিয়ে আলো বাঁকা হয় কারণ বিভিন্ন মাধ্যমে আলোর গতি ভিন্ন।",
    tips: [
      "আলো ঘন মাধ্যমে প্রবেশ করলে গতি কমে এবং স্বাভাবিক থেকে দূরে সরে",
      "প্রতিসরণ সূত্র: n₁sin(i) = n₂sin(r) (স্নেলের সূত্র)",
      "সমান্তরাল স্ল্যাব থেকে বেরিয়ে আসা আলো আগের দিকে সমান্তরাল থাকে, শুধু স্থানান্তরিত হয়",
    ],
  },
  prism: {
    mode: "prism",
    title: "প্রিজম",
    message: "প্রিজম আলোকে বিভিন্ন রঙে বিচ্ছুরিত করে কারণ বিভিন্ন রঙের তরঙ্গদৈর্ঘ্য ভিন্ন।",
    tips: [
      "বেগুনি আলো বেশি বাঁকে (কম তরঙ্গদৈর্ঘ্য), লাল আলো কম বাঁকে",
      "প্রিজম দিয়ে সাদা আলো বিচ্ছুরিত হয়ে রংধনুর রঙ তৈরি করে",
      "ন্যূনতম বিচ্লন কোণে প্রিজমের মধ্য দিয়ে আলো সমান কোণে প্রবেশ ও বেরিয়ে যায়",
    ],
  },
  stick: {
    mode: "stick",
    title: "জল ও লাঠি",
    message: "পানিতে ডোবানো লাঠি বাঁকা দেখায় কারণ পানি ও বাতাসের প্রতিসরণাঙ্ক ভিন্ন।",
    tips: [
      "পানির প্রতিসরণাঙ্ক ≈ ১.৩৩, বাতাসের ≈ ১",
      "পানি থেকে বেরিয়ে আসা আলো বেঁকে যায়, যা লাঠিকে বাঁকা দেখায়",
      "এই প্রভাব তীরন্দাজ এবং মাছ ধরার সময় গুরুত্বপূর্ণ",
    ],
  },
};

const SPECTRUM = [
  { name: "বেগুনি", en: "Violet", color: "#B14BFF", n: 1.532 },
  { name: "নীল", en: "Indigo", color: "#6A5BFF", n: 1.528 },
  { name: "আসমানী", en: "Blue", color: "#3DA5FF", n: 1.525 },
  { name: "সবুজ", en: "Green", color: "#3BFF6B", n: 1.519 },
  { name: "হলুদ", en: "Yellow", color: "#FFE234", n: 1.517 },
  { name: "কমলা", en: "Orange", color: "#FF9A2E", n: 1.514 },
  { name: "লাল", en: "Red", color: "#FF3B3B", n: 1.510 },
];

const RAY_PRESET_COLORS = ["#FFFFFF", "#FFD166", "#06D6A0", "#EF476F", "#118AB2", "#F78C6B"];

type PrismRay = {
  id: number;
  // Source position normalized to canvas size (0..1) so it stays consistent on resize
  sx: number;
  sy: number;
};

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');
:root {
  --ten-red: #E8001D; --ten-red-dark: #931212;
  --success: #1CAB55; --success-dark: #0E7B4F;
  --ten-ink: #111827;
  --gray-100: #F3F4F6; --gray-200: #E5E7EB; --gray-300: #D1D5DB;
  --gray-500: #6B7280; --gray-600: #4B5563;
  --border: #E5E7EB; --bg: #FFFFFF; --surface: #F9FAFB;
  --info-soft: #D8F3FF;
}
.ref-root { font-family: 'Hind Siliguri','Inter',sans-serif; color: var(--ten-ink); background: var(--surface); min-height: 100vh; padding: 16px; box-sizing: border-box; line-height: 1.5; max-width: 361px; margin: 0 auto; }
@media (min-width: 768px) { .ref-root { max-width: 720px; padding: 24px; } }
@media (min-width: 1440px) { .ref-root { max-width: 1216px; } }
.ref-root *, .ref-root *::before, .ref-root *::after { box-sizing: border-box; }
.ref-header { background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 10px 12px; margin-bottom: 8px; border-top: 3px solid var(--ten-red); display: flex; align-items: center; gap: 10px; }
.ref-header .icon { width: 32px; height: 32px; background: #FFF5F6; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
.ref-header .icon svg { width: 16px; height: 16px; color: var(--ten-red); }
.ref-header h1 { font-size: 14px; font-weight: 700; margin: 0; }
.ref-header p { font-size: 10px; color: var(--gray-500); margin: 0; font-family: 'Inter',sans-serif; }
.ref-card { background: var(--bg); border: 1px solid var(--border); border-radius: 12px; padding: 12px; margin-bottom: 10px; }
.experiment-row { display: flex; flex-direction: column; gap: 10px; margin-bottom: 10px; }
@media (min-width: 768px) { .experiment-row { flex-direction: row; } }
.experiment-canvas { flex: 1; min-width: 0; }
.experiment-controls { flex: 0 0 auto; width: 100%; }
@media (min-width: 768px) { .experiment-controls { width: 280px; } }
.canvas-card { padding: 8px; }
.tabs { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
.tab-btn { padding: 8px 12px; border: 1px solid var(--border); background: #fff; border-radius: 8px; font-weight: 700; font-size: 14px; color: var(--gray-600); cursor: pointer; transition: all 180ms; min-height: 44px; font-family: inherit; display: flex; align-items: center; justify-content: center; text-align: center; }
.tab-btn.active { border-color: var(--ten-red); background: #FFF5F6; color: var(--ten-red); box-shadow: 0 0 0 2px rgba(232,0,29,0.06); }
.canvas-wrap { position: relative; width: 100%; background: #0B1220; border-radius: 10px; overflow: auto; max-height: 70vh; }
.canvas-wrap canvas { display: block; }
.action-row { display: flex; gap: 8px; margin-top: 10px; }
.anim-btn { flex: 1; min-height: 48px; padding: 12px 16px; border-radius: 12px; border: 1px solid var(--success-dark); background: var(--success); color: #fff; font-weight: 700; font-size: 15px; font-family: inherit; cursor: pointer; transition: all 180ms; box-shadow: 0 2px 8px rgba(28,171,85,0.25); display: flex; align-items: center; justify-content: center; gap: 8px; }
.anim-btn:active { transform: scale(0.98); }
.anim-btn.on { background: linear-gradient(135deg,#FF7B2A,#E8001D); border-color: #931212; box-shadow: 0 0 0 3px rgba(232,0,29,0.15), 0 4px 14px rgba(232,123,42,0.4); }
.anim-btn svg { width: 18px; height: 18px; }
.add-btn { min-height: 40px; padding: 8px 12px; border-radius: 10px; border: 1px solid var(--ten-red-dark); background: var(--ten-red); color: #fff; font-weight: 700; font-size: 13px; font-family: inherit; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; }
.add-btn svg { width: 14px; height: 14px; }
.del-btn { background: transparent; border: none; cursor: pointer; color: var(--gray-500); padding: 4px; border-radius: 6px; }
.del-btn:hover { color: var(--ten-red); background: #FFF5F6; }
.del-btn svg { width: 16px; height: 16px; }
.slider-row { margin-bottom: 14px; }
.slider-row:last-child { margin-bottom: 0; }
.slider-row label { display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; margin-bottom: 4px; }
.slider-row .val { color: var(--ten-red); font-family: 'Inter',sans-serif; }
input[type="range"] { -webkit-appearance: none; appearance: none; width: 100%; height: 36px; background: transparent; cursor: pointer; }
input[type="range"]::-webkit-slider-runnable-track { height: 6px; background: var(--gray-200); border-radius: 999px; }
input[type="range"]::-moz-range-track { height: 6px; background: var(--gray-200); border-radius: 999px; }
input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; height: 20px; width: 20px; border-radius: 50%; background: var(--success); border: 2px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.2); margin-top: -7px; }
input[type="range"]::-moz-range-thumb { height: 20px; width: 20px; border-radius: 50%; background: var(--success); border: 2px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.2); }
input[type="range"]:focus { outline: none; }
.formula-card { padding: 16px; }
.formula-display { display: flex; align-items: center; justify-content: center; gap: 12px; padding: 16px; background: linear-gradient(135deg, #FFF8E7, #FFFAEF); border-radius: 12px; margin-bottom: 12px; flex-wrap: wrap; }
.fraction { display: inline-flex; flex-direction: column; align-items: center; position: relative; padding: 0 4px; }
.fraction .num { font-family: 'Inter',serif; font-weight: 700; font-size: 18px; line-height: 1.2; border-bottom: 2px solid var(--ten-ink); padding-bottom: 2px; min-width: 36px; text-align: center; }
.fraction .den { font-family: 'Inter',serif; font-weight: 600; font-size: 18px; line-height: 1.2; color: var(--ten-red); padding-top: 2px; min-width: 36px; text-align: center; }
.op { font-family: 'Inter',serif; font-size: 22px; font-weight: 700; color: var(--gray-600); }
.data-rows { }
.data-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; border-bottom: 1px dashed var(--gray-200); gap: 8px; }
.data-row:last-child { border-bottom: none; }
.data-row .k { color: var(--gray-600); }
.data-row .v { font-weight: 700; font-family: 'Inter',sans-serif; text-align: right; }
.data-row .v.bn { font-family: 'Hind Siliguri',sans-serif; }
.explain-card { background: linear-gradient(135deg, #FFF8E7 0%, #FFFAEF 50%, #FFF5F0 100%); border: 1px solid #F5E2A8; padding: 16px; }
.explain-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.explain-header svg { width: 20px; height: 20px; color: #8A6100; flex-shrink: 0; }
.explain-title { font-weight: 700; font-size: 15px; color: #8A6100; }
.explain-body { font-size: 14px; line-height: 1.7; color: #5A4000; }
.spectrum-row { display: flex; align-items: center; gap: 8px; padding: 4px 0; font-size: 12px; border-bottom: 1px dashed var(--gray-200); }
.spectrum-row:last-child { border-bottom: none; }
.spectrum-swatch { width: 14px; height: 12px; border-radius: 2px; flex-shrink: 0; }
.spectrum-name { font-weight: 600; min-width: 50px; }
.spectrum-n { font-family: 'Inter',sans-serif; color: var(--gray-600); }
.spectrum-dev { font-family: 'Inter',sans-serif; color: var(--ten-red); font-weight: 600; margin-left: auto; }
.ray-card { border: 1px solid var(--border); border-radius: 10px; padding: 10px; margin-bottom: 8px; background: #fff; }
.ray-card.active { border-color: var(--ten-red); box-shadow: 0 0 0 2px rgba(232,0,29,0.08); }
.ray-card-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; gap: 8px; }
.ray-tag { display: inline-flex; align-items: center; gap: 6px; font-weight: 700; font-size: 13px; }
.ray-dot { width: 12px; height: 12px; border-radius: 50%; box-shadow: 0 0 6px currentColor; }
.controls-title { font-weight: 700; font-size: 13px; color: var(--ten-red); margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; }
.section-title { font-weight: 700; font-size: 14px; margin-bottom: 10px; color: var(--ten-ink); }
.calc-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
@media (min-width: 768px) { .calc-grid { grid-template-columns: 1fr 1fr; } }
.calc-block { border: 1px solid var(--border); border-radius: 10px; padding: 10px; background: #FAFAFB; }
.calc-block-head { display: flex; align-items: center; gap: 6px; font-weight: 700; font-size: 13px; margin-bottom: 6px; }

/* Learning Outcomes Section */
.learning-outcomes-section { background: linear-gradient(135deg, #E8F8FF 0%, #F0F2FF 100%); border: 1.5px solid #81D4FA; border-left: 4px solid #0EA5E9; }
.learning-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.learning-icon { color: #0EA5E9; display: flex; align-items: center; }
.learning-title { font-size: 13px; font-weight: 700; color: #0369A1; margin: 0; }
.learning-message { font-size: 13px; color: #1E40AF; line-height: 1.6; margin-bottom: 12px; margin-top: 6px; }
.learning-tips-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
@media (max-width: 600px) { .learning-tips-grid { grid-template-columns: 1fr; } }
.learning-tip-item { display: flex; gap: 8px; padding: 8px; background: rgba(255,255,255,0.6); border-radius: 8px; font-size: 12px; color: #0369A1; line-height: 1.4; align-items: flex-start; }
.tip-icon { flex-shrink: 0; width: 20px; height: 20px; border-radius: 50%; background: #0EA5E9; color: #fff; font-weight: 700; font-size: 11px; display: flex; align-items: center; justify-content: center; }
.tip-text { flex: 1; }
.math { font-family: 'Inter', serif; font-style: italic; font-weight: 600; }
.math-frac { display: inline-flex; flex-direction: column; align-items: center; vertical-align: middle; padding: 0 4px; font-size: 0.85em; line-height: 1.1; }
.math-frac .num { border-bottom: 1px solid currentColor; width: 100%; text-align: center; padding: 0 2px; }
.math-frac .den { width: 100%; text-align: center; padding: 0 2px; }
.math-sup { vertical-align: super; font-size: 0.75em; }
.math-sub { vertical-align: sub; font-size: 0.75em; }
`;

function refract(
  d: { x: number; y: number },
  nOut: { x: number; y: number },
  eta: number
) {
  let nn = nOut;
  let cosI = -(d.x * nn.x + d.y * nn.y);
  if (cosI < 0) { nn = { x: -nn.x, y: -nn.y }; cosI = -cosI; }
  const sin2T = eta * eta * (1 - cosI * cosI);
  if (sin2T > 1) return null;
  const cosT = Math.sqrt(1 - sin2T);
  return {
    x: eta * d.x + (eta * cosI - cosT) * nn.x,
    y: eta * d.y + (eta * cosI - cosT) * nn.y,
  };
}

function angBetween(a: { x: number; y: number }, b: { x: number; y: number }) {
  const dot = Math.max(-1, Math.min(1, a.x * b.x + a.y * b.y));
  return (Math.acos(dot) * 180) / Math.PI;
}

function intersectSeg(
  O: { x: number; y: number },
  D: { x: number; y: number },
  A: { x: number; y: number },
  B: { x: number; y: number }
) {
  const ex = B.x - A.x, ey = B.y - A.y;
  const denom = D.x * ey - D.y * ex;
  if (Math.abs(denom) < 1e-9) return null;
  const s = ((A.x - O.x) * ey - (A.y - O.y) * ex) / denom;
  const t = ((A.x - O.x) * D.y - (A.y - O.y) * D.x) / denom;
  if (s > 1e-4 && t >= -1e-4 && t <= 1 + 1e-4) return s;
  return null;
}

const REF_PATH_TO_MODE: Record<string, Mode> = {
  "/refraction/slab": "slab",
  "/refraction/prism": "prism",
  "/refraction/stick": "stick",
};
const REF_MODE_TO_PATH: Record<Mode, string> = {
  slab: "/refraction/slab",
  prism: "/refraction/prism",
  stick: "/refraction/stick",
};

const Refraction = ({ hideNav = false }: { hideNav?: boolean }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryMode = searchParams.get("mode") as Mode;
  const initialMode: Mode = queryMode && Object.values(REF_PATH_TO_MODE).includes(queryMode)
    ? queryMode
    : (REF_PATH_TO_MODE[location.pathname] ?? "slab");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [mode, setMode] = useState<Mode>(initialMode);

  useEffect(() => {
    const qm = searchParams.get("mode") as Mode;
    if (qm && qm !== mode) {
      setMode(qm);
    } else {
      const m = REF_PATH_TO_MODE[location.pathname];
      if (m && m !== mode) setMode(m);
    }
  }, [location.pathname, searchParams]);

  const [angleDeg, setAngleDeg] = useState(() => {
    const q = searchParams.get("angle");
    return q ? parseInt(q) : 35;
  });
  const [n, setN] = useState(() => {
    const q = searchParams.get("n");
    return q ? parseFloat(q) : 1.5;
  });
  const [thickness, setThickness] = useState(() => {
    const q = searchParams.get("t");
    const parsed = q ? parseInt(q) : 45;
    // 160 was the old default — treat it as if no param was set
    return parsed === 160 ? 45 : parsed;
  });
  const [animate, setAnimate] = useState(true);
  const tRef = useRef(0);
  const [animProgress, setAnimProgress] = useState(0);
  const animProgressRef = useRef(0);

  // Stick-in-water controls
  const [stickAngleDeg, setStickAngleDeg] = useState(55); // angle of stick from vertical (0 = straight down, 90 = flat)
  const [stickWaterN, setStickWaterN] = useState(1.33);
  const [stickSubmerged, setStickSubmerged] = useState(170); // submerged length in px

  // Multiple rays for prism
  const [rays, setRays] = useState<PrismRay[]>([
    { id: 1, sx: 0.12, sy: 0.35 },
  ]);
  const nextRayId = useRef(2);

  // Per-ray, per-color deviation results (for under-canvas display)
  const [rayResults, setRayResults] = useState<
    { id: number; theta_i: number; deviations: number[] }[]
  >([]);

  // Sync search params when state changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("mode", mode);
    params.set("angle", angleDeg.toString());
    params.set("n", n.toFixed(2));
    params.set("t", thickness.toString());
    
    // Only update if something actually changed to avoid infinite loops
    if (params.toString() !== searchParams.toString()) {
      setSearchParams(params, { replace: true });
    }
  }, [mode, angleDeg, n, thickness, setSearchParams, searchParams]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    let initialScrollDone = false;
    const fit = () => {
      const container = canvas.parentElement;
      if (!container) return;
      const isMobile = window.innerWidth < 768;
      // On mobile: fit exactly to container width; on desktop: minimum 800px with horizontal scroll
      const w = isMobile ? container.clientWidth : Math.max(container.clientWidth, 800);
      const h = isMobile ? 260 : 480;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      if (!isMobile && !initialScrollDone && container.clientWidth < w) {
        container.scrollLeft = (w - container.clientWidth) / 2;
        initialScrollDone = true;
      }
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;

    const draw = () => {
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#0a0a18");
      bg.addColorStop(1, "#1a1530");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = "rgba(255,255,255,0.25)";
      for (let i = 0; i < 60; i++) {
        const sx = (i * 97) % W;
        const sy = (i * 53) % H;
        ctx.fillRect(sx, sy, 1, 1);
      }

      if (mode === "slab") drawSlab(ctx, W, H);
      else if (mode === "prism") drawPrism(ctx, W, H);
      else drawStick(ctx, W, H);
    };

    const drawSlab = (ctx: CanvasRenderingContext2D, W: number, H: number) => {
      const cy = H / 2;
      const slabLeft = W / 2 - thickness / 2;
      const slabRight = W / 2 + thickness / 2;
      const slabTop = H * 0.35;
      const slabBot = H * 0.65;

      const grad = ctx.createLinearGradient(slabLeft, 0, slabRight, 0);
      grad.addColorStop(0, "rgba(140,200,255,0.10)");
      grad.addColorStop(0.5, "rgba(180,220,255,0.22)");
      grad.addColorStop(1, "rgba(140,200,255,0.10)");
      ctx.fillStyle = grad;
      ctx.strokeStyle = "rgba(180,220,255,0.55)";
      ctx.lineWidth = 1.5;
      ctx.fillRect(slabLeft, slabTop, thickness, slabBot - slabTop);
      ctx.strokeRect(slabLeft, slabTop, thickness, slabBot - slabTop);

      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.font = "12px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`কাঁচের স্ল্যাব  (n = ${n.toFixed(2)})`, (slabLeft + slabRight) / 2, slabTop - 10);

      const theta1 = (angleDeg * Math.PI) / 180;
      const sinTheta2 = Math.sin(theta1) / n;
      const theta2 = Math.asin(Math.max(-1, Math.min(1, sinTheta2)));

      const entryX = slabLeft;
      const entryY = cy;
      const inDist = W * 0.38;
      const outDist = W * 0.38;
      const rayStartX = entryX - inDist;
      const rayStartY = entryY - inDist * Math.tan(theta1);
      const insideDx = thickness;
      const insideDy = thickness * Math.tan(theta2);
      const exitX = entryX + insideDx;
      const exitY = entryY + insideDy;
      const outDx = outDist;
      const outDy = outDist * Math.tan(theta1);
      const outEndX = exitX + outDx;
      const outEndY = exitY + outDy;

      const dashOffset = animate ? -(tRef.current * 0.03) : 0;
      const prog = animProgressRef.current;

      const normalLen = H * 0.18;
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(entryX, entryY - normalLen);
      ctx.lineTo(entryX, entryY + normalLen);
      ctx.moveTo(exitX, exitY - normalLen);
      ctx.lineTo(exitX, exitY + normalLen);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.setLineDash([2, 5]);
      ctx.beginPath();
      ctx.moveTo(entryX, entryY);
      const ghostEndX = outEndX;
      const ghostEndY = entryY + (ghostEndX - entryX) * Math.tan(theta1);
      ctx.lineTo(ghostEndX, ghostEndY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Progressive ray drawing: 3 segments, each takes 1/3 of progress
      const seg1Len = Math.hypot(entryX - rayStartX, entryY - rayStartY);
      const seg2Len = Math.hypot(exitX - entryX, exitY - entryY);
      const seg3Len = Math.hypot(outEndX - exitX, outEndY - exitY);
      const totalLen = seg1Len + seg2Len + seg3Len;
      const allowed = prog * totalLen;

      const drawProgressiveRay = (x1: number, y1: number, x2: number, y2: number, consumed: number): number => {
        const segL = Math.hypot(x2 - x1, y2 - y1);
        if (consumed >= allowed) return consumed;
        const take = Math.min(segL, allowed - consumed);
        const t = take / segL;
        const ex = x1 + (x2 - x1) * t;
        const ey = y1 + (y2 - y1) * t;
        ctx.save();
        ctx.shadowColor = "rgba(255,235,150,0.8)";
        ctx.shadowBlur = 14;
        ctx.strokeStyle = "rgba(255,235,150,0.95)";
        ctx.lineWidth = 2.2;
        ctx.setLineDash([10, 6]);
        ctx.lineDashOffset = dashOffset;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(ex, ey);
        ctx.stroke();
        ctx.restore();
        // Draw a bright dot at the leading edge
        if (t < 1 && t > 0) {
          ctx.save();
          ctx.shadowColor = "rgba(255,255,200,1)";
          ctx.shadowBlur = 20;
          ctx.fillStyle = "#fff";
          ctx.beginPath();
          ctx.arc(ex, ey, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        return consumed + segL;
      };

      let consumed = 0;
      consumed = drawProgressiveRay(rayStartX, rayStartY, entryX, entryY, consumed);
      consumed = drawProgressiveRay(entryX, entryY, exitX, exitY, consumed);
      consumed = drawProgressiveRay(exitX, exitY, outEndX, outEndY, consumed);

      // Lateral shift indicator (only show when ray is complete)
      if (prog > 0.95) {
        ctx.strokeStyle = "rgba(255,120,180,0.85)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(outEndX, ghostEndY);
        ctx.lineTo(outEndX, outEndY);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.font = "bold 13px Inter, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(`i = ${angleDeg}°`, entryX - 8, entryY - 8);
      ctx.textAlign = "left";
      ctx.fillText(`r = ${((theta2 * 180) / Math.PI).toFixed(1)}°`, entryX + 8, entryY + 18);
    };

    const drawPrism = (ctx: CanvasRenderingContext2D, W: number, H: number) => {
      const cx = W / 2;
      const cy = H / 2;
      const size = Math.min(W, H) * (W < 500 ? 0.25 : 0.38);

      const depth3D = size * 0.18;
      const apex = { x: cx, y: cy - size * 0.55 };
      const left = { x: cx - size * 0.5, y: cy + size * 0.32 };
      const right = { x: cx + size * 0.5, y: cy + size * 0.32 };

      const apexB = { x: apex.x + depth3D, y: apex.y - depth3D * 0.5 };
      const leftB = { x: left.x + depth3D, y: left.y - depth3D * 0.5 };
      const rightB = { x: right.x + depth3D, y: right.y - depth3D * 0.5 };

      // Back face
      ctx.save();
      const bgGrad = ctx.createLinearGradient(leftB.x, leftB.y, rightB.x, rightB.y);
      bgGrad.addColorStop(0, "rgba(100,140,200,0.08)");
      bgGrad.addColorStop(0.5, "rgba(120,160,220,0.15)");
      bgGrad.addColorStop(1, "rgba(100,140,200,0.08)");
      ctx.fillStyle = bgGrad;
      ctx.strokeStyle = "rgba(180,210,255,0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(apexB.x, apexB.y);
      ctx.lineTo(leftB.x, leftB.y);
      ctx.lineTo(rightB.x, rightB.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Right face
      ctx.save();
      const sideGrad = ctx.createLinearGradient(right.x, right.y, rightB.x, rightB.y);
      sideGrad.addColorStop(0, "rgba(140,180,240,0.18)");
      sideGrad.addColorStop(1, "rgba(100,140,200,0.10)");
      ctx.fillStyle = sideGrad;
      ctx.strokeStyle = "rgba(180,210,255,0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(right.x, right.y);
      ctx.lineTo(rightB.x, rightB.y);
      ctx.lineTo(apexB.x, apexB.y);
      ctx.lineTo(apex.x, apex.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Bottom face
      ctx.save();
      const botGrad = ctx.createLinearGradient(left.x, left.y, leftB.x, leftB.y);
      botGrad.addColorStop(0, "rgba(120,160,220,0.12)");
      botGrad.addColorStop(1, "rgba(80,120,180,0.06)");
      ctx.fillStyle = botGrad;
      ctx.strokeStyle = "rgba(180,210,255,0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(left.x, left.y);
      ctx.lineTo(leftB.x, leftB.y);
      ctx.lineTo(rightB.x, rightB.y);
      ctx.lineTo(right.x, right.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Front face
      ctx.save();
      const pg = ctx.createLinearGradient(left.x, left.y, right.x, right.y);
      pg.addColorStop(0, "rgba(180,210,255,0.10)");
      pg.addColorStop(0.5, "rgba(220,235,255,0.28)");
      pg.addColorStop(1, "rgba(180,210,255,0.10)");
      ctx.fillStyle = pg;
      ctx.strokeStyle = "rgba(220,235,255,0.7)";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(apex.x, apex.y);
      ctx.lineTo(left.x, left.y);
      ctx.lineTo(right.x, right.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // 3D edge highlights
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(apex.x, apex.y);
      ctx.lineTo(apexB.x, apexB.y);
      ctx.moveTo(right.x, right.y);
      ctx.lineTo(rightB.x, rightB.y);
      ctx.moveTo(left.x, left.y);
      ctx.lineTo(leftB.x, leftB.y);
      ctx.stroke();
      ctx.restore();

      const centroid = {
        x: (apex.x + left.x + right.x) / 3,
        y: (apex.y + left.y + right.y) / 3,
      };
      const outwardNormal = (a: { x: number; y: number }, b: { x: number; y: number }) => {
        const ex = b.x - a.x, ey = b.y - a.y;
        const cand = { x: -ey, y: ex };
        const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        const toC = { x: centroid.x - mid.x, y: centroid.y - mid.y };
        const dot = cand.x * toC.x + cand.y * toC.y;
        const nn = dot < 0 ? cand : { x: ey, y: -ex };
        const L = Math.hypot(nn.x, nn.y);
        return { x: nn.x / L, y: nn.y / L };
      };
      const nLeft = outwardNormal(apex, left);
      const nRight = outwardNormal(apex, right);
      const nBottom = outwardNormal(left, right);

      const dashOffset = animate ? -(tRef.current * 0.02) : 0;
      const tNorm = (Math.sin(tRef.current * 0.012) + 1) / 2;

      const results: { id: number; theta_i: number; deviations: number[] }[] = [];

      // Helper to find which face the source-to-prism ray actually hits.
      const faces: { a: { x: number; y: number }; b: { x: number; y: number }; n: { x: number; y: number } }[] = [
        { a: apex, b: left, n: nLeft },
        { a: apex, b: right, n: nRight },
        { a: left, b: right, n: nBottom },
      ];

      rays.forEach((ray) => {
        const inStart = { x: ray.sx * W, y: ray.sy * H };

        // Aim ray from source toward prism centroid as a sensible default direction.
        const aim = { x: centroid.x - inStart.x, y: centroid.y - inStart.y };
        const aimLen = Math.hypot(aim.x, aim.y) || 1;
        const incDir = { x: aim.x / aimLen, y: aim.y / aimLen };

        // Find nearest face hit
        let bestS = Infinity;
        let hit: { x: number; y: number } | null = null;
        let entryNormal: { x: number; y: number } | null = null;
        for (const f of faces) {
          const s = intersectSeg(inStart, incDir, f.a, f.b);
          if (s !== null && s < bestS) {
            bestS = s;
            hit = { x: inStart.x + incDir.x * s, y: inStart.y + incDir.y * s };
            entryNormal = f.n;
          }
        }
        if (!hit || !entryNormal) {
          // Source is inside or ray misses prism — just draw a stub
          ctx.save();
          ctx.fillStyle = "#fff";
          ctx.beginPath();
          ctx.arc(inStart.x, inStart.y, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          results.push({ id: ray.id, theta_i: 0, deviations: SPECTRUM.map(() => NaN) });
          return;
        }

        // White incoming beam — progressive
        const prog = animProgressRef.current;
        const incLen = Math.hypot(hit.x - inStart.x, hit.y - inStart.y);
        const incTake = Math.min(1, prog * 3); // first 1/3 of progress for incoming
        const incEndX = inStart.x + (hit.x - inStart.x) * incTake;
        const incEndY = inStart.y + (hit.y - inStart.y) * incTake;
        ctx.save();
        ctx.shadowColor = "rgba(255,255,255,0.85)";
        ctx.shadowBlur = 18;
        ctx.strokeStyle = "rgba(255,255,255,0.55)";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(inStart.x, inStart.y);
        ctx.lineTo(incEndX, incEndY);
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(255,255,255,1)";
        ctx.lineWidth = 1.8;
        ctx.setLineDash([10, 6]);
        ctx.lineDashOffset = dashOffset;
        ctx.beginPath();
        ctx.moveTo(inStart.x, inStart.y);
        ctx.lineTo(incEndX, incEndY);
        ctx.stroke();
        ctx.restore();
        // Leading dot
        if (incTake < 1 && incTake > 0) {
          ctx.save();
          ctx.shadowColor = "rgba(255,255,255,1)";
          ctx.shadowBlur = 20;
          ctx.fillStyle = "#fff";
          ctx.beginPath();
          ctx.arc(incEndX, incEndY, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Source dot (the "lamp")
        ctx.save();
        ctx.shadowColor = colorFor(ray.id);
        ctx.shadowBlur = 16;
        ctx.fillStyle = colorFor(ray.id);
        ctx.beginPath();
        ctx.arc(inStart.x, inStart.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(inStart.x, inStart.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Normal at hit (along entryNormal)
        ctx.save();
        ctx.strokeStyle = "rgba(255,255,255,0.30)";
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(hit.x - entryNormal.x * 50, hit.y - entryNormal.y * 50);
        ctx.lineTo(hit.x + entryNormal.x * 50, hit.y + entryNormal.y * 50);
        ctx.stroke();
        ctx.restore();

        const negInc = { x: -incDir.x, y: -incDir.y };
        const theta_i_deg = angBetween(negInc, entryNormal);

        // Ray label
        ctx.save();
        ctx.fillStyle = "rgba(255,255,255,0.95)";
        ctx.font = "bold 11px Inter, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(`R${ray.id}  i=${theta_i_deg.toFixed(0)}°`, inStart.x + 10, inStart.y - 8);
        ctx.restore();

        const deviations: number[] = [];

        SPECTRUM.forEach((c) => {
          const dIn = refract(incDir, entryNormal!, 1 / c.n);
          if (!dIn) { deviations.push(NaN); return; }

          // Find nearest exit face (any face that isn't the entry one)
          let s: number | null = null;
          let exitNormal: { x: number; y: number } | null = null;
          for (const f of faces) {
            if (f.n === entryNormal) continue;
            const ss = intersectSeg(hit, dIn, f.a, f.b);
            if (ss !== null && (s === null || ss < s)) { s = ss; exitNormal = f.n; }
          }
          if (s === null || !exitNormal) { deviations.push(NaN); return; }

          const exitX = hit.x + s * dIn.x;
          const exitY = hit.y + s * dIn.y;

          const dOut = refract(dIn, exitNormal, c.n);
          if (!dOut) { deviations.push(NaN); return; }

          const outLen = 360;
          const outEndX = exitX + dOut.x * outLen;
          const outEndY = exitY + dOut.y * outLen;

          const dev = angBetween(incDir, dOut);
          deviations.push(dev);

          // Progressive: inside ray (phase 2: prog 0.33-0.66), outgoing (phase 3: prog 0.66-1.0)
          const insideProg = Math.max(0, Math.min(1, (prog - 0.33) / 0.33));
          const outProg = Math.max(0, Math.min(1, (prog - 0.66) / 0.34));

          // inside ray
          if (insideProg > 0) {
            const iex = hit.x + (exitX - hit.x) * insideProg;
            const iey = hit.y + (exitY - hit.y) * insideProg;
            ctx.save();
            ctx.shadowColor = c.color;
            ctx.shadowBlur = 8;
            ctx.strokeStyle = c.color;
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.moveTo(hit.x, hit.y);
            ctx.lineTo(iex, iey);
            ctx.stroke();
            ctx.restore();
            if (insideProg < 1) {
              ctx.save();
              ctx.shadowColor = c.color;
              ctx.shadowBlur = 14;
              ctx.fillStyle = "#fff";
              ctx.beginPath();
              ctx.arc(iex, iey, 2.5, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }
          }

          // outgoing dispersed ray
          if (outProg > 0) {
            const oex = exitX + (outEndX - exitX) * outProg;
            const oey = exitY + (outEndY - exitY) * outProg;
            ctx.save();
            ctx.shadowColor = c.color;
            ctx.shadowBlur = 20;
            ctx.strokeStyle = c.color;
            ctx.lineWidth = 2.6;
            ctx.beginPath();
            ctx.moveTo(exitX, exitY);
            ctx.lineTo(oex, oey);
            ctx.stroke();
            ctx.restore();
            if (outProg < 1) {
              ctx.save();
              ctx.shadowColor = c.color;
              ctx.shadowBlur = 14;
              ctx.fillStyle = "#fff";
              ctx.beginPath();
              ctx.arc(oex, oey, 3, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }
          }

          if (animate && prog >= 1) {
            const px = exitX + (outEndX - exitX) * tNorm;
            const py = exitY + (outEndY - exitY) * tNorm;
            ctx.save();
            ctx.shadowColor = c.color;
            ctx.shadowBlur = 14;
            ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.arc(px, py, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        });

        results.push({ id: ray.id, theta_i: theta_i_deg, deviations });
      });

      // publish results to React state (only when changed enough)
      setRayResults((prev) => {
        if (prev.length !== results.length) return results;
        let same = true;
        for (let i = 0; i < results.length; i++) {
          const a = prev[i], b = results[i];
          if (!a || a.id !== b.id || Math.abs(a.theta_i - b.theta_i) > 0.05) { same = false; break; }
        }
        return same ? prev : results;
      });
    };

    const drawStick = (ctx: CanvasRenderingContext2D, W: number, H: number) => {
      // Scale all absolute sizes to canvas dimensions (designed for H=480 desktop)
      const drawScale = H / 480;
      const cx = W / 2;
      const waterTop = H * 0.52;
      const waterBot = H * 0.85;
      const glassLeft = cx - W * 0.08;
      const glassRight = cx + W * 0.08;

      // Glass body (subtle)
      ctx.save();
      const glassGrad = ctx.createLinearGradient(glassLeft, 0, glassRight, 0);
      glassGrad.addColorStop(0, "rgba(255,255,255,0.05)");
      glassGrad.addColorStop(0.5, "rgba(255,255,255,0.12)");
      glassGrad.addColorStop(1, "rgba(255,255,255,0.05)");
      ctx.fillStyle = glassGrad;
      ctx.strokeStyle = "rgba(255,255,255,0.45)";
      ctx.lineWidth = 2;
      // glass walls
      ctx.beginPath();
      ctx.moveTo(glassLeft, H * 0.35);
      ctx.lineTo(glassLeft, waterBot + 14);
      ctx.lineTo(glassRight, waterBot + 14);
      ctx.lineTo(glassRight, H * 0.35);
      ctx.stroke();
      // water
      const waterGrad = ctx.createLinearGradient(0, waterTop, 0, waterBot);
      waterGrad.addColorStop(0, "rgba(80,170,255,0.55)");
      waterGrad.addColorStop(1, "rgba(20,90,200,0.75)");
      ctx.fillStyle = waterGrad;
      ctx.fillRect(glassLeft, waterTop, glassRight - glassLeft, waterBot - waterTop);

      // Water surface line
      ctx.strokeStyle = "rgba(180,220,255,0.9)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(glassLeft - 10, waterTop);
      ctx.lineTo(glassRight + 10, waterTop);
      ctx.stroke();
      ctx.fillStyle = "rgba(180,220,255,0.9)";
      ctx.font = "12px 'Hind Siliguri', sans-serif";
      ctx.fillText("পানির পৃষ্ঠ", glassRight + 16, waterTop + 4);
      ctx.restore();

      // Stick geometry driven by sliders
      // stickAngleDeg = angle of stick from vertical (0 = straight down, 90 = horizontal along surface)
      const aStick = (stickAngleDeg * Math.PI) / 180;
      // entry point on the water surface (slightly left of center so eye on right has a clear view)
      const entryX = cx - 12;
      const entryY = waterTop;
      // direction unit vector pointing INTO the water (down-right when angle > 0)
      const dirX = Math.sin(aStick);
      const dirY = Math.cos(aStick);
      const submergedLen = stickSubmerged * drawScale;
      const realEndX = entryX + dirX * submergedLen;
      const realEndY = entryY + dirY * submergedLen;
      // Above-water portion: extend opposite direction
      const aboveLen = 130 * drawScale;
      const stickTopX = entryX - dirX * aboveLen;
      const stickTopY = entryY - dirY * aboveLen;
      const stickW = Math.max(4, 10 * drawScale);

      // Draw real stick (above water + faint dashed continuation underwater)
      ctx.save();
      ctx.lineCap = "round";
      // Above-water portion (solid brown)
      ctx.strokeStyle = "#C98B4B";
      ctx.lineWidth = stickW;
      ctx.beginPath();
      ctx.moveTo(stickTopX, stickTopY);
      ctx.lineTo(entryX, entryY);
      ctx.stroke();
      // Real underwater path (dashed, faint) — "actual position"
      ctx.setLineDash([6, 6]);
      ctx.strokeStyle = "rgba(201,139,75,0.55)";
      ctx.lineWidth = stickW * 0.85;
      ctx.beginPath();
      ctx.moveTo(entryX, entryY);
      ctx.lineTo(realEndX, realEndY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Apparent position: apparent depth = real depth / n (textbook approximation for near-vertical viewing).
      // Horizontal position roughly preserved.
      const apparentEndX = realEndX;
      const apparentEndY = entryY + (realEndY - entryY) / stickWaterN;

      ctx.save();
      ctx.lineCap = "round";
      ctx.strokeStyle = "#E0A45C";
      ctx.lineWidth = stickW;
      ctx.beginPath();
      ctx.moveTo(entryX, entryY);
      ctx.lineTo(apparentEndX, apparentEndY);
      ctx.stroke();
      // small highlight
      ctx.strokeStyle = "rgba(255,235,200,0.55)";
      ctx.lineWidth = Math.max(1.5, 2 * drawScale);
      ctx.beginPath();
      ctx.moveTo(entryX, entryY);
      ctx.lineTo(apparentEndX, apparentEndY);
      ctx.stroke();
      ctx.restore();

      // Light rays from the real submerged tip to the eye, bending at the surface
      const eyeX = W * 0.82;
      const eyeY = H * 0.22;
      // Refraction point on the surface (between real tip and eye, but on water line)
      // Use a point where the ray would refract — pick midway horizontally between realEnd and apparentEnd at the surface
      const refractX = entryX + (realEndX - entryX) * 0.55;
      const refractY = waterTop;

      // Progressive light ray animation
      const stickProg = animProgressRef.current;
      const seg1L = Math.hypot(refractX - realEndX, refractY - realEndY);
      const seg2L = Math.hypot(eyeX - refractX, eyeY - refractY);
      const totalRayLen = seg1L + seg2L;
      const rayAllowed = stickProg * totalRayLen;

      ctx.save();
      ctx.strokeStyle = "rgba(255,230,120,0.85)";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 4]);

      // underwater ray (real tip -> surface) — progressive
      const take1 = Math.min(seg1L, rayAllowed);
      const t1 = take1 / seg1L;
      const uwEndX = realEndX + (refractX - realEndX) * t1;
      const uwEndY = realEndY + (refractY - realEndY) * t1;
      ctx.beginPath();
      ctx.moveTo(realEndX, realEndY);
      ctx.lineTo(uwEndX, uwEndY);
      ctx.stroke();

      // air ray (surface -> eye) — progressive
      if (rayAllowed > seg1L) {
        const take2 = Math.min(seg2L, rayAllowed - seg1L);
        const t2 = take2 / seg2L;
        const airEndX = refractX + (eyeX - refractX) * t2;
        const airEndY = refractY + (eyeY - refractY) * t2;
        ctx.beginPath();
        ctx.moveTo(refractX, refractY);
        ctx.lineTo(airEndX, airEndY);
        ctx.stroke();
        // Leading dot
        if (t2 < 1 && t2 > 0) {
          ctx.setLineDash([]);
          ctx.shadowColor = "rgba(255,230,120,1)";
          ctx.shadowBlur = 16;
          ctx.fillStyle = "#fff";
          ctx.beginPath();
          ctx.arc(airEndX, airEndY, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      } else if (t1 < 1 && t1 > 0) {
        // Leading dot on underwater segment
        ctx.setLineDash([]);
        ctx.shadowColor = "rgba(255,230,120,1)";
        ctx.shadowBlur = 16;
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(uwEndX, uwEndY, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Backward extension from eye through refract point — meets at apparent tip (only when complete)
      if (stickProg > 0.95) {
        ctx.strokeStyle = "rgba(255,230,120,0.35)";
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.moveTo(refractX, refractY);
        ctx.lineTo(apparentEndX, apparentEndY);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.restore();

      // Normal at refraction point
      const normalLen = Math.max(28, 60 * drawScale);
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.55)";
      ctx.setLineDash([3, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(refractX, refractY - normalLen);
      ctx.lineTo(refractX, refractY + normalLen);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Eye icon
      const eyeRx = Math.max(10, 18 * drawScale);
      const eyeRy = Math.max(6, 11 * drawScale);
      const eyePupilR = Math.max(3, 6 * drawScale);
      ctx.save();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.ellipse(eyeX, eyeY, eyeRx, eyeRy, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#1a1a2a";
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, eyePupilR, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "12px 'Hind Siliguri', sans-serif";
      ctx.fillText("পর্যবেক্ষক", eyeX - 28, eyeY + eyeRy + 14);
      ctx.restore();

      // Legend box — top-left corner, color-coded line samples
      ctx.save();
      const fontSize = Math.max(10, Math.round(12 * drawScale));
      ctx.font = `${fontSize}px 'Hind Siliguri', sans-serif`;
      const lineLen = Math.max(18, 24 * drawScale);
      const pad = 8;
      const rowH = fontSize + 10;
      const legendLabelW = ctx.measureText("আপাত অবস্থান").width;
      const legendW = pad + lineLen + 6 + legendLabelW + pad;
      const legendH = pad + rowH * 2 + pad * 0.5;
      const lx = 12;
      const ly = 12;
      // Background
      ctx.fillStyle = "rgba(0,0,0,0.52)";
      ctx.beginPath();
      if ((ctx as unknown as {roundRect?: unknown}).roundRect)
        (ctx as unknown as {roundRect:(x:number,y:number,w:number,h:number,r:number)=>void})
          .roundRect(lx, ly, legendW, legendH, 7);
      else ctx.rect(lx, ly, legendW, legendH);
      ctx.fill();
      ctx.textBaseline = "middle";
      // Row 1 — apparent position (solid orange)
      const r1y = ly + pad + rowH * 0.5 - 1;
      ctx.strokeStyle = "#E0A45C";
      ctx.lineWidth = Math.max(2, 3 * drawScale);
      ctx.setLineDash([]);
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(lx + pad, r1y);
      ctx.lineTo(lx + pad + lineLen, r1y);
      ctx.stroke();
      ctx.fillStyle = "#E0A45C";
      ctx.fillText("আপাত অবস্থান", lx + pad + lineLen + 6, r1y);
      // Row 2 — real position (dashed brown)
      const r2y = ly + pad + rowH * 1.5 - 1;
      ctx.strokeStyle = "rgba(201,139,75,0.9)";
      ctx.lineWidth = Math.max(2, 3 * drawScale);
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(lx + pad, r2y);
      ctx.lineTo(lx + pad + lineLen, r2y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(220,160,95,1)";
      ctx.fillText("প্রকৃত অবস্থান", lx + pad + lineLen + 6, r2y);
      ctx.textBaseline = "alphabetic";
      ctx.restore();
      // Light ray label along the ray path
      ctx.save();
      ctx.font = `${Math.max(10, Math.round(11 * drawScale))}px 'Hind Siliguri', sans-serif`;
      ctx.fillStyle = "rgba(255,230,120,0.92)";
      ctx.fillText("আলোর পথ", (refractX + eyeX) / 2 - 30, (refractY + eyeY) / 2 - 6);
      ctx.restore();
    };

    const loop = (now: number) => {
      tRef.current += 0.3;
      if (animate) {
        animProgressRef.current = Math.min(1, animProgressRef.current + 0.004);
        setAnimProgress(animProgressRef.current);
      } else {
        animProgressRef.current = 1;
        setAnimProgress(1);
      }
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };
    loop(performance.now());
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [mode, angleDeg, n, thickness, animate, rays, stickAngleDeg, stickWaterN, stickSubmerged]);

  // Slab values
  const theta1 = (angleDeg * Math.PI) / 180;
  const sinTheta2 = Math.sin(theta1) / n;
  const theta2 = Math.asin(Math.max(-1, Math.min(1, sinTheta2)));
  const rDeg = (theta2 * 180) / Math.PI;
  const shift = Math.abs((thickness * Math.sin(theta1 - theta2)) / Math.max(0.0001, Math.cos(theta2)));

  const addRay = () => {
    if (rays.length >= 6) return;
    const id = nextRayId.current++;
    // Place at a random spot on the left half of the canvas
    const sx = 0.05 + Math.random() * 0.25;
    const sy = 0.2 + Math.random() * 0.6;
    setRays((rs) => [...rs, { id, sx, sy }]);
  };
  const removeRay = (id: number) => setRays((rs) => rs.filter((r) => r.id !== id));
  const updateRay = (id: number, patch: Partial<PrismRay>) =>
    setRays((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  // Click-to-place mode: when on, the next canvas click adds a ray at that spot.
  const [placingRay, setPlacingRay] = useState(false);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== "prism") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = (e.clientX - rect.left) / rect.width;
    const sy = (e.clientY - rect.top) / rect.height;
    if (rays.length >= 6) {
      setPlacingRay(false);
      return;
    }
    const id = nextRayId.current++;
    setRays((rs) => [...rs, { id, sx, sy }]);
    // Reset animation so the new ray draws in slowly
    animProgressRef.current = 0;
    setAnimProgress(0);
    setPlacingRay(false);
  };

  const colorFor = (id: number) => RAY_PRESET_COLORS[(id - 1) % RAY_PRESET_COLORS.length];

  return (
    <>
      {!hideNav && <SiteNav />}
      <div className="ref-root">
        <style>{STYLES}</style>

        <div className="ref-header">
          <div className="icon"><Microscope /></div>
          <div>
            <h1 className="bn">আলোর প্রতিসরণ ও বিচ্ছুরণ</h1>
            <p>Refraction & Dispersion</p>
          </div>
        </div>

        <div className="ref-card">
          <div className="tabs" id="ref-tabs">
            <button
              className={"tab-btn " + (mode === "slab" ? "active" : "")}
              onClick={() => { setMode("slab"); if (!hideNav) navigate(REF_MODE_TO_PATH.slab); }}
            >
              কাঁচের স্ল্যাব
            </button>
            <button
              className={"tab-btn " + (mode === "prism" ? "active" : "")}
              onClick={() => { setMode("prism"); if (!hideNav) navigate(REF_MODE_TO_PATH.prism); }}
            >
              প্রিজম (বিচ্ছুরণ)
            </button>
            <button
              className={"tab-btn " + (mode === "stick" ? "active" : "")}
              onClick={() => { setMode("stick"); if (!hideNav) navigate(REF_MODE_TO_PATH.stick); }}
            >
              পানিতে লাঠি বাঁকা
            </button>
          </div>
        </div>

        <div className="experiment-row">
          <div className="experiment-canvas">
            <div className="ref-card canvas-card">
              <div className="canvas-wrap">
                <canvas ref={canvasRef} onClick={handleCanvasClick} className="block w-full" style={{ cursor: mode === "prism" && placingRay ? "crosshair" : "default" }} />
              </div>
              <div className="action-row">
                <button
                  className={"anim-btn " + (animate ? "on" : "")}
                  onClick={() => {
                    setAnimate((a) => !a);
                    if (!animate) {
                      // Turning animation back on — reset progress
                      setAnimProgress(0);
                      animProgressRef.current = 0;
                    }
                  }}
                >
                  {animate ? <Pause /> : <Play />}
                  {animate ? "অ্যানিমেশন বন্ধ" : "অ্যানিমেশন চালু"}
                </button>
              </div>
            </div>
          </div>

          <div className="experiment-controls" id="ref-controls">
            {mode === "slab" && (
              <div className="ref-card">
                <div className="controls-title"><span>স্ল্যাব নিয়ন্ত্রণ</span></div>
                <div className="slider-row">
                  <label><span>আপতন কোণ (i)</span><span className="val">{angleDeg}°</span></label>
                  <input type="range" min={5} max={75} value={angleDeg} onChange={(e) => setAngleDeg(+e.target.value)} />
                </div>
                <div className="slider-row">
                  <label><span>প্রতিসরাঙ্ক (n)</span><span className="val">{n.toFixed(2)}</span></label>
                  <input type="range" min={1.0} max={2.0} step={0.01} value={n} onChange={(e) => setN(+e.target.value)} />
                </div>
                <div className="slider-row">
                  <label><span>স্ল্যাবের পুরুত্ব</span><span className="val">{thickness}px</span></label>
                  <input type="range" min={40} max={180} value={thickness} onChange={(e) => setThickness(+e.target.value)} />
                </div>
              </div>
            )}
            {mode === "prism" && (
              <div className="ref-card">
                <div className="controls-title">
                  <span>আলোক উৎস ({rays.length})</span>
                  <button
                    className="add-btn"
                    onClick={() => setPlacingRay((p) => !p)}
                    disabled={rays.length >= 6}
                    style={placingRay ? { background: "var(--success)", borderColor: "var(--success-dark)" } : undefined}
                  >
                    <Plus /> {placingRay ? "ক্যানভাসে ক্লিক করুন" : "আলো যোগ"}
                  </button>
                </div>
                <div style={{ fontSize: 11, color: "var(--gray-500)", marginBottom: 8 }}>
                  "আলো যোগ" চাপুন, তারপর ক্যানভাসের যেকোনো জায়গায় ক্লিক করুন — সেখান থেকে আলো প্রিজমে গিয়ে পড়বে।
                </div>
                {rays.map((ray) => (
                  <div key={ray.id} className="ray-card">
                    <div className="ray-card-head">
                      <span className="ray-tag">
                        <span className="ray-dot" style={{ background: colorFor(ray.id), color: colorFor(ray.id) }} />
                        উৎস R{ray.id}
                      </span>
                      <button className="del-btn" onClick={() => removeRay(ray.id)} aria-label="remove">
                        <Trash2 />
                      </button>
                    </div>
                    <div className="slider-row">
                      <label><span>X অবস্থান</span><span className="val">{Math.round(ray.sx * 100)}%</span></label>
                      <input
                        type="range" min={0} max={1} step={0.01} value={ray.sx}
                        onChange={(e) => updateRay(ray.id, { sx: +e.target.value })}
                      />
                    </div>
                    <div className="slider-row">
                      <label><span>Y অবস্থান</span><span className="val">{Math.round(ray.sy * 100)}%</span></label>
                      <input
                        type="range" min={0} max={1} step={0.01} value={ray.sy}
                        onChange={(e) => updateRay(ray.id, { sy: +e.target.value })}
                      />
                    </div>
                  </div>
                ))}
                {rays.length === 0 && (
                  <div style={{ fontSize: 12, color: "var(--gray-500)", padding: 12, textAlign: "center", border: "1px dashed var(--gray-300)", borderRadius: 8 }}>
                    কোনো আলো নেই। উপরে "আলো যোগ" চাপুন।
                  </div>
                )}
                {rays.length >= 6 && (
                  <div style={{ fontSize: 11, color: "var(--gray-500)", marginTop: 4 }}>
                    সর্বাধিক ৬টি আলো যোগ করা যাবে।
                  </div>
                )}
              </div>
            )}
            {mode === "stick" && (
              <div className="ref-card">
                <div className="controls-title"><span>পর্যবেক্ষণ — পানিতে লাঠি</span></div>
                <div className="slider-row">
                  <label><span>লাঠির কোণ (উলম্ব থেকে)</span><span className="val">{stickAngleDeg}°</span></label>
                  <input type="range" min={0} max={80} value={stickAngleDeg} onChange={(e) => setStickAngleDeg(+e.target.value)} />
                </div>
                <div className="slider-row">
                  <label><span>পানির প্রতিসরাঙ্ক (n)</span><span className="val">{stickWaterN.toFixed(2)}</span></label>
                  <input type="range" min={1.0} max={1.8} step={0.01} value={stickWaterN} onChange={(e) => setStickWaterN(+e.target.value)} />
                </div>
                <div className="slider-row">
                  <label><span>নিমজ্জিত দৈর্ঘ্য</span><span className="val">{stickSubmerged}px</span></label>
                  <input type="range" min={60} max={240} value={stickSubmerged} onChange={(e) => setStickSubmerged(+e.target.value)} />
                </div>
                <div style={{ fontSize: 13, color: "var(--gray-700)", lineHeight: 1.7 }} className="bn">
                  পানিতে আংশিক নিমজ্জিত একটি সোজা লাঠি বা কলম উপর থেকে দেখলে
                  <b> বাঁকা </b> মনে হয়। কারণ পানি (ঘন মাধ্যম) থেকে আলো বাতাসে
                  (হালকা মাধ্যম) আসার সময় অভিলম্ব থেকে দূরে সরে যায়, ফলে আমাদের চোখে
                  লাঠির নিমজ্জিত অংশের <b>আপাত অবস্থান</b> প্রকৃত অবস্থানের চেয়ে
                  অগভীর ও সরে যাওয়া দেখায়।
                </div>
                <div style={{ marginTop: 10, fontSize: 12, color: "var(--gray-500)" }} className="bn">
                  <div>• কমলা কঠিন রেখা — আমরা যা <b>দেখি</b> (আপাত)</div>
                  <div>• বাদামি ড্যাশড রেখা — লাঠির <b>প্রকৃত</b> অবস্থান</div>
                  <div>• হলুদ রেখা — আলোক রশ্মির পথ (পৃষ্ঠে বেঁকেছে)</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SLAB FORMULA + DATA */}
        {mode === "slab" && (
          <div className="ref-card formula-card">
            <div className="section-title bn">সূত্র ও গণনা — কাঁচের স্ল্যাব</div>
            <div className="formula-display">
              <span className="math">n<span className="math-sub">1</span></span>
              <span className="op">·</span>
              <span className="math">sin(i)</span>
              <span className="op">=</span>
              <span className="math">n<span className="math-sub">2</span></span>
              <span className="op">·</span>
              <span className="math">sin(r)</span>
            </div>
            <div className="data-rows">
              <div className="data-row">
                <span className="k">স্নেলের সূত্র</span>
                <span className="v bn">
                  <span className="math">n<span className="math-sub">1</span> sin(i) = n<span className="math-sub">2</span> sin(r)</span>
                </span>
              </div>
              <div className="data-row"><span className="k">আপতন কোণ (i)</span><span className="v">{angleDeg}°</span></div>
              <div className="data-row"><span className="k">প্রতিসরণ কোণ (r)</span><span className="v">{rDeg.toFixed(2)}°</span></div>
              <div className="data-row"><span className="k">প্রতিসরাঙ্ক (n)</span><span className="v">{n.toFixed(2)}</span></div>
              <div className="data-row">
                <span className="k">পার্শ্বিক সরণ (d)</span>
                <span className="v">
                  <span className="math">d = </span>
                  <div className="math-frac">
                    <span className="num">t · sin(i − r)</span>
                    <span className="den">cos(r)</span>
                  </div>
                </span>
              </div>
              <div className="data-row">
                <span className="k">গণনা</span>
                <span className="v">
                  <span className="math">{thickness} · </span>
                  <div className="math-frac">
                    <span className="num">sin({(angleDeg - rDeg).toFixed(1)}°)</span>
                    <span className="den">cos({rDeg.toFixed(1)}°)</span>
                  </div>
                  <span className="math"> = {shift.toFixed(1)} px</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* PRISM FORMULA + PER-RAY CALCULATIONS */}
        {mode === "prism" && (
          <>
            <div className="ref-card formula-card">
              <div className="section-title bn">সূত্র — প্রিজম বিচ্ছুরণ</div>
              <div className="formula-display">
                <div className="math-frac">
                  <span className="num">sin(i)</span>
                  <span className="den">sin(r)</span>
                </div>
                <span className="op">=</span>
                <span className="math">n(λ)</span>
                <span className="op">,</span>
                <span className="math">δ = (i<span className="math-sub">1</span> + i<span className="math-sub">2</span>) − A</span>
              </div>
              <div className="data-rows">
                <div className="data-row"><span className="k">প্রিজম কোণ (A)</span><span className="v">60°</span></div>
                <div className="data-row"><span className="k">মোট রশ্মি</span><span className="v">{rays.length}</span></div>
                <div className="data-row"><span className="k">নিয়ম</span><span className="v bn">বেগুনি বেশি বাঁকে · লাল কম বাঁকে</span></div>
              </div>
            </div>

            <div className="ref-card">
              <div className="section-title bn">প্রতিটি রশ্মির বিচ্ছুরণ গণনা</div>
              <div className="calc-grid">
                {rayResults.map((res) => (
                  <div key={res.id} className="calc-block">
                    <div className="calc-block-head">
                      <span className="ray-dot" style={{ background: colorFor(res.id), color: colorFor(res.id) }} />
                      <span>রশ্মি R{res.id}</span>
                      <span style={{ marginLeft: "auto", color: "var(--gray-500)", fontWeight: 700 }}>
                        <span className="math">i ≈ {res.theta_i.toFixed(1)}°</span>
                      </span>
                    </div>
                    {SPECTRUM.map((c, i) => (
                      <div key={c.en} className="spectrum-row">
                        <div className="spectrum-swatch" style={{ background: c.color }} />
                        <span className="spectrum-name bn">{c.name}</span>
                        <span className="spectrum-n">n = {c.n.toFixed(3)}</span>
                        <span className="spectrum-dev">
                          <span className="math">δ = {Number.isFinite(res.deviations[i]) ? `${res.deviations[i].toFixed(1)}°` : "—"}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* STICK FORMULA */}
        {mode === "stick" && (
          <div className="ref-card formula-card">
            <div className="section-title bn">সূত্র ও গণনা — পানিতে লাঠি</div>
            <div className="formula-display">
              <span className="math">n = </span>
              <div className="math-frac">
                <span className="num">প্রকৃত গভীরতা (Real Depth)</span>
                <span className="den">আপাত গভীরতা (Apparent Depth)</span>
              </div>
            </div>
            <div className="data-rows">
              <div className="data-row"><span className="k">পানির প্রতিসরাঙ্ক (n)</span><span className="v">{stickWaterN.toFixed(2)}</span></div>
              <div className="data-row">
                <span className="k">প্রকৃত গভীরতা</span>
                <span className="v">{stickSubmerged} px</span>
              </div>
              <div className="data-row">
                <span className="k">আপাত গভীরতা</span>
                <span className="v">
                  <div className="math-frac">
                    <span className="num">{stickSubmerged} px</span>
                    <span className="den">{stickWaterN.toFixed(2)}</span>
                  </div>
                  <span className="math"> = {(stickSubmerged / stickWaterN).toFixed(1)} px</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* LEARNING OUTCOMES SECTION */}
        {(() => {
          const outcome = LEARNING_OUTCOMES[mode];
          return (
            <div className="ref-card learning-outcomes-section">
              <div className="learning-header">
                <div className="learning-icon"><Lightbulb size={18} /></div>
                <div className="learning-title bn">এই উপকরণ সম্পর্কে শিখুন:</div>
              </div>
              <p className="learning-message bn">{outcome.message}</p>
              <div className="learning-tips-grid">
                {outcome.tips.map((tip, i) => (
                  <div key={i} className="learning-tip-item bn">
                    <div className="tip-icon">{i + 1}</div>
                    <div className="tip-text">{tip}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* EXPLAIN CARD */}
        <div className="ref-card explain-card">
          <div className="explain-header">
            <Info />
            <div className="explain-title bn">
              {mode === "slab"
                ? "কেন আলো বাঁকা পথে চলে?"
                : mode === "prism"
                ? "কেন বিচ্ছুরণ ঘটে?"
                : "পানিতে লাঠি বাঁকা দেখায় কেন?"}
            </div>
          </div>
          <div className="explain-body bn">
            {mode === "slab" && (
              <>কাঁচের প্রতিসরাঙ্ক বাতাসের চেয়ে বেশি, তাই আলো কাঁচে ঢোকার সময় অভিলম্বের
              দিকে এবং বের হওয়ার সময় অভিলম্ব থেকে দূরে বাঁকে। দুই পৃষ্ঠ সমান্তরাল হওয়ায়
              বের হওয়া রশ্মি আপতন রশ্মির সমান্তরাল থাকে, কিন্তু কিছুটা পার্শ্বিক সরণ ঘটে।</>
            )}
            {mode === "prism" && (
              <>বিভিন্ন রঙের আলোর তরঙ্গদৈর্ঘ্য আলাদা, ফলে কাঁচে তাদের প্রতিসরাঙ্ক (n) আলাদা।
              বেগুনি আলোর n সবচেয়ে বেশি, তাই এটি সবচেয়ে বেশি বাঁকে; লাল আলোর n সবচেয়ে কম,
              তাই এটি সবচেয়ে কম বাঁকে। এখানে একাধিক রশ্মি যোগ করে প্রতিটির আলাদা বিচ্ছুরণ পর্যবেক্ষণ করা যায়।</>
            )}
            {mode === "stick" && (
              <>পানিতে আংশিক নিমজ্জিত একটি সোজা লাঠি বা কলম উপর থেকে দেখলে বাঁকা
              মনে হয়, কারণ পানি (ঘন মাধ্যম) থেকে আলো বাতাসে (হালকা মাধ্যম) আসার
              সময় অভিলম্ব থেকে দূরে সরে যায়। লাঠির নিমজ্জিত প্রান্ত থেকে আসা আলো
              পানির পৃষ্ঠে প্রতিসরিত হয়ে চোখে পৌঁছায়; কিন্তু মস্তিষ্ক ধরে নেয় আলো
              সরলরেখায় এসেছে, তাই লাঠির নিমজ্জিত অংশ প্রকৃত অবস্থানের চেয়ে
              উপরে ও সরে গিয়ে দেখা যায় — ফলে লাঠিটিকে পৃষ্ঠের কাছে বাঁকা দেখায়।</>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Refraction;
