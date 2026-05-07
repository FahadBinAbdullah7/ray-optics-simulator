import { useState, useEffect, useCallback, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
export interface TourStep {
  selector: string;
  title: string;
  desc: string;
  waitForClick?: boolean;
}
interface GuidedTourProps {
  steps: TourStep[];
  started: boolean;
  onEnd: () => void;
}
export function GuidedTour({ steps, started, onEnd }: GuidedTourProps) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const prevElRef = useRef<HTMLElement | null>(null);
  const elevateEl = useCallback((el: HTMLElement | null) => {
    if (prevElRef.current) {
      prevElRef.current.style.removeProperty("position");
      prevElRef.current.style.removeProperty("z-index");
      prevElRef.current.style.removeProperty("pointer-events");
      prevElRef.current = null;
    }
    if (el) {
      const pos = getComputedStyle(el).position;
      if (pos === "static") el.style.position = "relative";
      el.style.zIndex = "9005";
      el.style.pointerEvents = "auto";
      prevElRef.current = el;
    }
  }, []);
  const endTour = useCallback(() => {
    elevateEl(null);
    onEnd();
  }, [elevateEl, onEnd]);
  const goNext = useCallback(() => {
    if (step < steps.length - 1) setStep(s => s + 1);
    else endTour();
  }, [step, steps.length, endTour]);
  const measure = useCallback((selector: string) => {
    const el = document.querySelector(selector) as HTMLElement | null;
    if (!el) { setRect(null); elevateEl(null); return; }
    elevateEl(el);
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    const doMeasure = () => {
      const r = el.getBoundingClientRect();
      setRect(r);
    };
    doMeasure();
    setTimeout(doMeasure, 400);
    setTimeout(doMeasure, 700);
  }, [elevateEl]);
  useEffect(() => {
    if (!started) { setStep(0); setRect(null); elevateEl(null); return; }
    measure(steps[step]?.selector ?? "");
  }, [started, step, steps, measure, elevateEl]);
  useEffect(() => {
    if (!started) return;
    const update = () => {
      const el = document.querySelector(steps[step]?.selector ?? "");
      if (el) setRect(el.getBoundingClientRect());
    };
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => { window.removeEventListener("resize", update); window.removeEventListener("scroll", update, true); };
  }, [started, step, steps]);
  useEffect(() => {
    if (!started || !steps[step]?.waitForClick) return;
    const el = document.querySelector(steps[step].selector);
    if (!el) return;
    const handler = () => setTimeout(goNext, 250);
    el.addEventListener("click", handler, { once: true, capture: true });
    return () => el.removeEventListener("click", handler, true);
  }, [started, step, steps, goNext]);
  useEffect(() => { return () => elevateEl(null); }, [elevateEl]);
  if (!started) return null;
  const current = steps[step];
  const interactive = !!current.waitForClick;
  const PAD = 8;
  const accent = "#1d4ed8";
  const getCardPos = (): React.CSSProperties => {
    const cw = Math.min(280, window.innerWidth - 24);
    const CH = 200;
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    if (!rect) return { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: `${cw}px` };
    let top = rect.bottom + PAD + 10;
    let left = rect.left + rect.width / 2 - cw / 2;
    if (top + CH > vh - 12) top = rect.top - CH - PAD - 10;
    if (top < 12) top = 12;
    left = Math.max(12, Math.min(left, vw - cw - 12));
    return { position: "fixed", top: `${top}px`, left: `${left}px`, width: `${cw}px` };
  };
  return (
    <>
      <style>{`@keyframes _tIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>
      {/* Backdrop */}
      <div onClick={endTour} style={{ position:"fixed", inset:0, zIndex:9000, background:"rgba(0,0,0,0.6)" }} />
      {/* Spotlight */}
      {rect && (
        <div style={{
          position:"fixed",
          top: rect.top - PAD, left: rect.left - PAD,
          width: rect.width + PAD*2, height: rect.height + PAD*2,
          zIndex: 9001, borderRadius:"10px",
          boxShadow:`0 0 0 9999px rgba(0,0,0,0.6)`,
          border: interactive ? "2px solid rgba(74,222,128,0.85)" : "2px solid rgba(147,197,253,0.85)",
          pointerEvents:"none",
          transition:"top 0.35s ease, left 0.35s ease, width 0.35s ease, height 0.35s ease",
        }} />
      )}
      {/* Card */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          ...getCardPos(), zIndex:9006,
          background:"#fff", borderRadius:"14px", padding:"16px",
          boxShadow:"0 12px 40px rgba(0,0,0,0.25)",
          fontFamily:"'Hind Siliguri','Inter',sans-serif",
          animation:"_tIn 0.25s ease-out",
        }}
      >
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"6px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"8px", flex:1 }}>
            <span style={{ background:accent, color:"#fff", borderRadius:"20px", padding:"2px 10px", fontSize:"11px", fontWeight:800, flexShrink:0 }}>
              {step+1}/{steps.length}
            </span>
            <span style={{ fontWeight:800, fontSize:"14px", color:"#111827" }}>{current.title}</span>
          </div>
          <button onClick={endTour} style={{ background:"none", border:"none", cursor:"pointer", color:"#9CA3AF", padding:"2px 0 2px 8px" }}>
            <X size={15} />
          </button>
        </div>
        <p style={{ fontSize:"13px", color:"#374151", lineHeight:1.65, margin:"0 0 12px" }}>{current.desc}</p>
        {/* Dots */}
        <div style={{ display:"flex", gap:"4px", justifyContent:"center", marginBottom:"12px" }}>
          {steps.map((_,i) => (
            <div key={i} style={{
              width: i===step?"16px":"6px", height:"5px", borderRadius:"3px",
              background: i < step ? "#86efac" : i===step ? accent : "#E5E7EB",
              transition:"all 0.2s",
            }} />
          ))}
        </div>
        {/* Nav — always show Next */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <button onClick={endTour} style={{ background:"none", border:"none", color:"#9CA3AF", fontSize:"12px", cursor:"pointer", fontFamily:"inherit" }}>
            Skip
          </button>
          <div style={{ display:"flex", gap:"6px" }}>
            {step > 0 && (
              <button
                onClick={e => { e.stopPropagation(); setStep(s=>s-1); }}
                style={{ padding:"6px 12px", borderRadius:"8px", border:"1px solid #E5E7EB", background:"#fff", cursor:"pointer", fontSize:"12px", fontFamily:"inherit", color:"#374151", display:"flex", alignItems:"center", gap:"3px" }}
              >
                <ChevronLeft size={13}/> Back
              </button>
            )}
            <button
              onClick={e => { e.stopPropagation(); goNext(); }}
              style={{ padding:"6px 14px", borderRadius:"8px", border:"none", background:accent, color:"#fff", cursor:"pointer", fontSize:"12px", fontWeight:700, fontFamily:"inherit", display:"flex", alignItems:"center", gap:"3px" }}
            >
              {step===steps.length-1 ? "Finish" : (<>Next <ChevronRight size={13}/></>)}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
