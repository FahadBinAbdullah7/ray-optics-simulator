import { useState } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import RayOptics from "@/components/RayOptics";
import Refraction from "./Refraction";
import { Sparkles, GraduationCap, Zap, Play, X, ChevronRight, Navigation } from "lucide-react";
import { GuidedTour, TourStep } from "@/components/GuidedTour";

const LENS_MIRROR_TOUR: TourStep[] = [
  { selector: ".tabs", title: "অপটিক্যাল উপাদান", desc: "চার ধরনের উপাদান আছে — উত্তল লেন্স, অবতল লেন্স, উত্তল দর্পণ ও অবতল দর্পণ। যেকোনো একটি ক্লিক করুন।", waitForClick: true },
  { selector: ".canvas-wrap", title: "সিমুলেশন ক্যানভাস", desc: "এখানে রশ্মি চিত্র দেখা যাবে। মোমবাতিটি ধরে যেকোনো দিকে টেনে সরাতে পারবেন।" },
  { selector: ".light-btn", title: "আলো বাটন", desc: "এই বাটনে ক্লিক করুন — মোমবাতি জ্বলবে এবং আলোর রশ্মি চিত্র দেখা যাবে।", waitForClick: true },
  { selector: ".all-rays-btn", title: "সব রশ্মি", desc: "এই বাটনে ক্লিক করুন — সব দিক থেকে অনেক রশ্মি একসাথে দেখাবে!", waitForClick: true },
  { selector: ".slider-row", title: "দূরত্ব স্লাইডার", desc: "এই স্লাইডার দিয়ে বস্তুর দূরত্ব (u) এবং ফোকাস দূরত্ব (f) পরিবর্তন করুন। প্রতিবিম্ব কীভাবে বদলায় দেখুন!" },
  { selector: ".presets", title: "অবস্থান প্রিসেট", desc: "F ও 2F-এর মতো বিশেষ অবস্থানে মোমবাতি নিয়ে যান — যেকোনো একটি ক্লিক করুন।", waitForClick: true },
  { selector: ".formula-card", title: "সূত্র ও গণনা", desc: "এখানে লেন্স বা দর্পণের সূত্র এবং বর্তমান মানগুলো দিয়ে হিসাব দেখা যাবে।" },
  { selector: ".goto-usecase-btn", title: "ব্যবহার (Use Case)", desc: "এই বাটনে ক্লিক করলে বাস্তব জীবনে এই লেন্স বা দর্পণের ব্যবহার দেখা যাবে — যেমন চোখের চশমা, টেলিস্কোপ ইত্যাদি।", waitForClick: true },
  { selector: "#use-case-section", title: "ব্যবহারের উদাহরণ", desc: "এখানে বিভিন্ন বাস্তব ব্যবহারের অ্যানিমেশন দেখা যাবে। যেকোনো কার্ডে ক্লিক করুন।" },
  { selector: ".lab-test-btn", title: "ল্যাব টেস্ট", desc: "৫টি কুইজে অংশ নিয়ে পয়েন্ট অর্জন করুন এবং আপনার বোঝাপড়া যাচাই করুন!" },
];

const REFRACTION_TOUR: TourStep[] = [
  { selector: "#ref-tabs", title: "পরীক্ষা নির্বাচন", desc: "তিনটি পরীক্ষা আছে: কাঁচের স্ল্যাব, প্রিজম (বিচ্ছুরণ) এবং পানিতে লাঠি। যেকোনো একটি ট্যাবে ক্লিক করুন।", waitForClick: true },
  { selector: ".canvas-wrap", title: "সিমুলেশন ক্যানভাস", desc: "এখানে আলোর প্রতিসরণের চিত্র দেখা যাবে। কোণ ও মান পরিবর্তন করলে চিত্র সাথে সাথে আপডেট হয়।" },
  { selector: ".anim-btn", title: "অ্যানিমেশন বাটন", desc: "এই বাটনে ক্লিক করুন — আলোর চলাচল অ্যানিমেশন আকারে দেখা যাবে।", waitForClick: true },
  { selector: "#ref-controls", title: "নিয়ন্ত্রণ প্যানেল", desc: "এখান থেকে আপতন কোণ (i), প্রতিসরণ সূচক (n) এবং অন্যান্য মান স্লাইডার দিয়ে পরিবর্তন করুন।" },
  { selector: ".slider-row", title: "স্লাইডার", desc: "এই স্লাইডারগুলো টেনে কোণ ও প্রতিসরণ সূচক পরিবর্তন করুন — চিত্র সাথে সাথে আপডেট হবে।" },
  { selector: ".formula-card", title: "সূত্র ও গণনা", desc: "এখানে স্নেলের সূত্র এবং বর্তমান মানগুলো দিয়ে গণনা দেখা যাবে: n₁ sin θ₁ = n₂ sin θ₂" },
];

const PRESETS = [
  {
    title: "উত্তল লেন্সের প্রতিবিম্ব",
    desc: "ফোকাসের ভেতরে বস্তুর বিবর্ধিত চিত্র",
    type: "lens-mirror",
    mode: "convexLens",
    params: { u: "50", f: "80" }
  },
  {
    title: "অবতল লেন্সের প্রতিবিম্ব",
    desc: "সব সময় অভাসী ও সোজা প্রতিবিম্ব",
    type: "lens-mirror",
    mode: "concaveLens",
    params: { u: "150", f: "80" }
  },
  {
    title: "প্রিজমে বিচ্ছুরণ",
    desc: "সাত রঙের আলোর সুন্দর খেলা",
    type: "refraction",
    mode: "prism",
    params: { angle: "35" }
  },
  {
    title: "পানিতে লাঠি বাঁকা",
    desc: "প্রতিসরণের বাস্তব উদাহরণ",
    type: "refraction",
    mode: "stick",
    params: { n: "1.33" }
  }
];

const SimulatorPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [showIntro, setShowIntro] = useState(!searchParams.get("mode"));
  const [isExiting, setIsExiting] = useState(false);
  const [presetKey, setPresetKey] = useState(0);
  const [tourActive, setTourActive] = useState(false);
  
  // Determine type from search param OR pathname
  const typeParam = searchParams.get("type");
  const type = typeParam || (location.pathname.includes("refraction") ? "refraction" : "lens-mirror");

  const handleTypeChange = (newType: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("type", newType);
    if (newType === "refraction") {
      params.set("mode", "slab");
    } else {
      params.set("mode", "convexLens");
    }
    setSearchParams(params);
  };

  const closeIntro = () => {
    setIsExiting(true);
    setTimeout(() => {
      setShowIntro(false);
      setIsExiting(false);
    }, 400);
  };

  const loadPreset = (p: typeof PRESETS[0]) => {
    const params = new URLSearchParams();
    params.set("type", p.type);
    params.set("mode", p.mode);
    Object.entries(p.params).forEach(([k, v]) => params.set(k, v));
    setSearchParams(params);
    setPresetKey(k => k + 1); // Force remount so fresh mode is read from URL
    closeIntro();
  };

  return (
    <div className="simulator-page-root">
      <style>{`
        .simulator-page-root {
          background: #F9FAFB;
          min-height: 100vh;
          padding: 16px;
          font-family: 'Hind Siliguri', 'Inter', sans-serif;
          position: relative;
        }
        .central-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0 24px;
        }
        @media (max-width: 540px) {
          .central-header {
            flex-direction: column;
            align-items: center;
            gap: 12px;
            padding: 12px 0 16px;
          }
          .header-left-spacer { display: none; }
        }
        .main-nav-container {
          max-width: 1216px;
          margin: 0 auto 16px;
        }
        .main-tabs {
          display: flex;
          background: #fff;
          border: 1px solid #E5E7EB;
          border-radius: 16px;
          padding: 6px;
          gap: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .main-tab-btn {
          flex: 1;
          padding: 12px 20px;
          border-radius: 12px;
          border: 1px solid transparent;
          background: transparent;
          color: #6B7280;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: inherit;
          display: flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
        }
        .main-tab-btn.active {
          background: #E8001D;
          color: #fff;
          border-color: #E8001D;
          box-shadow: 0 4px 12px rgba(232, 0, 29, 0.25);
        }

        /* Intro Overlay */
        .intro-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(17, 24, 39, 0.85);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          transition: opacity 0.4s ease;
        }
        .intro-overlay.exiting {
          opacity: 0;
          pointer-events: none;
        }
        .intro-card {
          background: #fff;
          width: 100%;
          max-width: 600px;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .intro-overlay.exiting .intro-card {
          transform: translateY(-20px);
        }
        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .intro-header {
          background: linear-gradient(135deg, #E8001D, #931212);
          padding: 32px 24px;
          color: #fff;
          text-align: center;
          position: relative;
        }
        .close-intro {
          position: absolute;
          top: 16px; right: 16px;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          width: 32px; height: 32px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: #fff; cursor: pointer;
        }
        .intro-title { font-size: 28px; font-weight: 800; margin-bottom: 8px; }
        .intro-subtitle { font-size: 16px; opacity: 0.9; }
        
        .intro-body { padding: 24px; max-height: 70vh; overflow-y: auto; }
        .feature-list { display: grid; grid-template-columns: 1fr; gap: 16px; margin-bottom: 24px; }
        @media (min-width: 480px) { .feature-list { grid-template-columns: 1fr 1fr; } }
        .feature-item {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 12px; background: #F9FAFB; border-radius: 16px;
        }
        .feature-icon {
          background: #FFF5F6; padding: 8px; border-radius: 10px;
          color: #E8001D; flex-shrink: 0;
        }
        .feature-text h4 { font-weight: 700; font-size: 14px; margin-bottom: 2px; }
        .feature-text p { font-size: 12px; color: #6B7280; line-height: 1.4; }

        .presets-title { font-weight: 800; font-size: 18px; margin-bottom: 12px; color: #111827; }
        .presets-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
        @media (min-width: 480px) { .presets-grid { grid-template-columns: 1fr 1fr; } }
        .preset-btn {
          text-align: left; padding: 16px; border: 1px solid #E5E7EB; border-radius: 16px;
          background: #fff; cursor: pointer; transition: all 0.2s;
          display: flex; flex-direction: column; gap: 4px;
        }
        .preset-btn:hover { border-color: #E8001D; background: #FFF5F6; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(232, 0, 29, 0.1); }
        .preset-name { font-weight: 700; font-size: 14px; color: #111827; }
        .preset-desc { font-size: 12px; color: #6B7280; }

        .start-btn {
          width: 100%; margin-top: 24px; padding: 16px;
          background: #E8001D; color: #fff; border: none; border-radius: 16px;
          font-weight: 800; font-size: 16px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }

        @media (max-width: 480px) {
          .simulator-page-root { padding: 12px 8px; }
          .main-tab-btn { font-size: 14px; padding: 10px 8px; }
          .intro-title { font-size: 24px; }
        }
      `}</style>

      {showIntro && (
        <div className={`intro-overlay ${isExiting ? 'exiting' : ''}`}>
          <div className="intro-card">
            <div className="intro-header">
              <button className="close-intro" onClick={closeIntro}><X size={18}/></button>
              <div className="intro-title">সিমুলেটরে স্বাগতম!</div>
              <div className="intro-subtitle">আলোর বিজ্ঞানের এক জাদুকরী জগৎ</div>
            </div>
            <div className="intro-body">
              <div className="presets-title">কি কি করা যাবে?</div>
              <div className="feature-list">
                <div className="feature-item">
                  <div className="feature-icon"><Zap size={20}/></div>
                  <div className="feature-text">
                    <h4>রশ্মি চিত্র পর্যবেক্ষণ</h4>
                    <p>লেন্স ও দর্পণে আলোর গতিপথ সরাসরি দেখুন</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon"><GraduationCap size={20}/></div>
                  <div className="feature-text">
                    <h4>প্রতিবিম্বের বৈশিষ্ট্য</h4>
                    <p>বাস্তব, অভাসী, সোজা বা উল্টো প্রতিবিম্ব বুঝুন</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon"><Sparkles size={20}/></div>
                  <div className="feature-text">
                    <h4>আলোর বিচ্ছুরণ</h4>
                    <p>প্রিজমে সাদা আলোর সাতটি রঙে ভাগ হওয়া দেখুন</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon"><Play size={20}/></div>
                  <div className="feature-text">
                    <h4>বাস্তব উদাহরণ</h4>
                    <p>গ্লাসে লাঠি বাঁকা বা মেকআপ আয়নার কাজ বুঝুন</p>
                  </div>
                </div>
              </div>

              <div className="presets-title">দ্রুত শুরু করুন (Presets)</div>
              <div className="presets-grid">
                {PRESETS.map((p, i) => (
                  <button key={i} className="preset-btn" onClick={() => loadPreset(p)}>
                    <div className="preset-name">{p.title}</div>
                    <div className="preset-desc">{p.desc}</div>
                  </button>
                ))}
              </div>

              <button className="start-btn" onClick={closeIntro}>
                সরাসরি সিমুলেশন শুরু করি <ChevronRight size={20}/>
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="central-header">
        {/* Left spacer — mirrors Tutorial button width to keep logo centered on desktop */}
        <div className="header-left-spacer" style={{ flex: '0 0 120px' }} />
        {/* Centered branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, justifyContent: 'center' }}>
          <div style={{ background: '#E8001D', padding: '8px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 1 1-4 0V6a2 2 0 1 1 4 0v6Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/></svg>
          </div>
          <span style={{ fontSize: '24px', fontWeight: 800, color: '#111827' }}>টেন মিনিট স্কুল</span>
        </div>
        {/* Tutorial button — red */}
        <button
          id="guided-tour-btn"
          onClick={() => { setShowIntro(false); setTourActive(true); }}
          style={{
            background: 'linear-gradient(135deg, #E8001D, #b91c1c)',
            color: '#fff', border: 'none', borderRadius: '50px',
            padding: '8px 18px', fontWeight: 700, fontSize: '13px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px',
            boxShadow: '0 2px 10px rgba(232,0,29,0.35)',
            transition: 'transform 0.15s, box-shadow 0.15s',
            fontFamily: 'Inter, sans-serif',
            flexShrink: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(232,0,29,0.5)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(232,0,29,0.35)'; }}
        >
          <Navigation size={14} />
          Tutorial
        </button>
      </header>

      <div className="main-nav-container">
        <div className="main-tabs">
          <button 
            className={`main-tab-btn ${type === "lens-mirror" ? "active" : ""}`}
            onClick={() => handleTypeChange("lens-mirror")}
          >
            লেন্স ও দর্পণ
          </button>
          <button 
            className={`main-tab-btn ${type === "refraction" ? "active" : ""}`}
            onClick={() => handleTypeChange("refraction")}
          >
            আলোর প্রতিসরণ
          </button>
        </div>
      </div>

      <div className="simulator-content">
        {type === "refraction" ? (
          <Refraction key={`refraction-${presetKey}`} hideNav />
        ) : (
          <RayOptics key={`rayoptics-${presetKey}`} hideNav />
        )}
      </div>

      <GuidedTour
        steps={type === "refraction" ? REFRACTION_TOUR : LENS_MIRROR_TOUR}
        started={tourActive}
        onEnd={() => setTourActive(false)}
      />
    </div>
  );
};

export default SimulatorPage;
