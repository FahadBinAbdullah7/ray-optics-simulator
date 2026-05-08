import { useState } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import RayOptics from "@/components/RayOptics";
import Refraction from "./Refraction";
import { Sparkles, GraduationCap, Zap, Play, X, ChevronRight, Navigation, MessageCircle } from "lucide-react";
import { GuidedTour, TourStep } from "@/components/GuidedTour";

const LENS_MIRROR_TOUR: TourStep[] = [
  { selector: ".tabs", title: "অপটিক্যাল উপাদান", desc: "চার ধরনের উপাদান আছে — উত্তল লেন্স, অবতল লেন্স, উত্তল দর্পণ ও অবতল দর্পণ। যেকোনো একটি ক্লিক করুন।", waitForClick: true },
  { selector: ".canvas-wrap", title: "সিমুলেশন ক্যানভাস", desc: "এখানে রশ্মি চিত্র দেখা যাবে। মোমবাতিটি ধরে যেকোনো দিকে টেনে সরাতে পারবেন।" },
  { selector: ".light-btn", title: "আলো বাটন", desc: "এই বাটনে ক্লিক করুন — মোমবাতি জ্বলবে এবং আলোর রশ্মি চিত্র দেখা যাবে।", waitForClick: true },
  { selector: ".ctrl-toggle-switch", title: "সব রশ্মি টগল", desc: "এই টগলটি চালু করুন — সব দিক থেকে অনেক রশ্মি একসাথে দেখাবে!", waitForClick: true },
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
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  // Determine type from search param OR pathname
  const typeParam = searchParams.get("type");
  const type = typeParam || (location.pathname.includes("refraction") ? "refraction" : "lens-mirror");

  const SIM_NAMES: Record<string, string> = {
    convexLens: "convex_lens", concaveLens: "concave_lens",
    convexMirror: "convex_mirror", concaveMirror: "concave_mirror",
    slab: "glass_slab", prism: "prism", stick: "stick_in_water",
  };
  const currentMode = searchParams.get("mode") || (type === "refraction" ? "slab" : "convexLens");
  const simName = SIM_NAMES[currentMode] || currentMode;
  const tallyUrl = `https://tally.so/r/RG87VJ?simulation_name=${simName}`;

  const handleTypeChange = (newType: string) => {
    // Start fresh — don't carry over params from the other experiment type
    const params = new URLSearchParams();
    params.set("type", newType);
    if (newType === "refraction") {
      params.set("mode", "slab");
      params.set("t", "45");
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
        @keyframes _tourBtnPulse {
          0%,100% { box-shadow: 0 2px 10px rgba(232,0,29,0.35); }
          50%     { box-shadow: 0 2px 10px rgba(232,0,29,0.35), 0 0 0 6px rgba(232,0,29,0.1); }
        }
        .tour-btn {
          background: linear-gradient(135deg, #E8001D, #b91c1c);
          color: #fff; border: none; border-radius: 50px;
          padding: 9px 20px; font-weight: 700; font-size: 13px;
          cursor: pointer; display: flex; align-items: center; gap: 7px;
          box-shadow: 0 2px 10px rgba(232,0,29,0.35);
          transition: transform 0.2s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.2s cubic-bezier(0.2,0.8,0.2,1);
          font-family: Inter, sans-serif;
          flex-shrink: 0;
          animation: _tourBtnPulse 2.8s ease-in-out infinite;
        }
        .tour-btn:hover {
          transform: scale(1.06) translateY(-1px);
          box-shadow: 0 6px 20px rgba(232,0,29,0.5);
          animation: none;
        }
        .tour-btn:active {
          transform: scale(0.96);
          box-shadow: 0 1px 6px rgba(232,0,29,0.3);
          animation: none;
        }
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
          max-width: 1216px;
          margin-left: auto;
          margin-right: auto;
          width: 100%;
        }
        .header-logo {
          height: 44px;
          width: auto;
          object-fit: contain;
          flex-shrink: 0;
        }
        @media (max-width: 540px) {
          .central-header {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 0;
            padding: 12px 0 16px;
            max-width: none;
          }
          .header-logo {
            height: 34px;
          }
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

        /* Feedback FAB */
        .feedback-fab {
          position: fixed;
          bottom: 28px; right: 24px;
          z-index: 7500;
          display: flex; align-items: center; gap: 7px;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 50px;
          padding: 10px 16px 10px 13px;
          color: #374151;
          font-size: 13px; font-weight: 600;
          cursor: pointer;
          box-shadow: 0 2px 14px rgba(0,0,0,0.11);
          transition: transform 0.18s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.18s, background 0.15s;
          font-family: inherit;
        }
        .feedback-fab:hover {
          background: #fff;
          box-shadow: 0 6px 24px rgba(0,0,0,0.17);
          transform: translateY(-2px);
        }
        .feedback-fab:active { transform: scale(0.96); }
        .feedback-fab-label { white-space: nowrap; }
        @media (max-width: 540px) {
          .feedback-fab {
            bottom: 18px; right: 16px;
            padding: 11px; border-radius: 50%;
          }
          .feedback-fab-label { display: none; }
        }

        /* Feedback Modal */
        @keyframes _fdBdIn { from { opacity:0; } to { opacity:1; } }
        @keyframes _fdCardIn {
          from { transform: translateY(28px); opacity:0; }
          to   { transform: translateY(0);    opacity:1; }
        }
        .feedback-modal-bd {
          position: fixed; inset: 0;
          background: rgba(17,24,39,0.65);
          backdrop-filter: blur(5px);
          z-index: 9980;
          display: flex; align-items: center; justify-content: center;
          padding: 16px;
          animation: _fdBdIn 0.22s ease-out;
        }
        .feedback-modal-card {
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          width: 100%; max-width: 560px;
          height: min(82vh, 660px);
          display: flex; flex-direction: column;
          box-shadow: 0 25px 60px rgba(0,0,0,0.22);
          animation: _fdCardIn 0.28s cubic-bezier(0.16,1,0.3,1);
        }
        .feedback-modal-hdr {
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 18px;
          border-bottom: 1px solid #F3F4F6;
          flex-shrink: 0;
        }
        .feedback-modal-hdr span { font-weight: 700; font-size: 15px; color: #111827; font-family: inherit; }
        .feedback-modal-hdr button {
          background: none; border: none; cursor: pointer;
          color: #9CA3AF; padding: 5px; border-radius: 7px;
          display: flex; align-items: center;
          transition: color 0.15s, background 0.15s;
        }
        .feedback-modal-hdr button:hover { color: #374151; background: #F3F4F6; }
        .feedback-iframe { flex: 1; width: 100%; border: none; display: block; }
        @media (max-width: 540px) {
          .feedback-modal-bd { padding: 0; align-items: flex-end; }
          .feedback-modal-card {
            border-radius: 20px 20px 0 0;
            height: 90vh; max-width: 100%;
          }
        }
      `}</style>

      {showIntro && (
        <div className={`intro-overlay ${isExiting ? 'exiting' : ''}`}>
          <div className="intro-card">
            <div className="intro-header">
              <button className="close-intro" onClick={closeIntro}><X size={18}/></button>
              <div className="intro-title">আলোর রহস্য উন্মোচন করো!</div>
              <div className="intro-subtitle">লেন্স, দর্পণ ও প্রতিসরণ — নিজে পরীক্ষা করে শেখো</div>
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
        {/* Brand logo — left */}
        <img
          src="/logo.png"
          alt="টেন মিনিট স্কুল"
          className="header-logo"
        />
        {/* Tutorial button — right */}
        <button
          id="guided-tour-btn"
          className="tour-btn"
          onClick={() => { setShowIntro(false); setTourActive(true); }}
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

      {/* Feedback FAB — hidden while intro overlay or tour is active */}
      {!showIntro && !tourActive && (
        <button className="feedback-fab" onClick={() => setFeedbackOpen(true)} aria-label="মতামত জানাও">
          <MessageCircle size={17} />
          <span className="feedback-fab-label">তোমার মতামত জানাও</span>
        </button>
      )}

      {/* Feedback Modal */}
      {feedbackOpen && (
        <div className="feedback-modal-bd" onClick={() => setFeedbackOpen(false)}>
          <div className="feedback-modal-card" onClick={e => e.stopPropagation()}>
            <div className="feedback-modal-hdr">
              <span>তোমার মতামত জানাও</span>
              <button onClick={() => setFeedbackOpen(false)} aria-label="বন্ধ করো"><X size={17} /></button>
            </div>
            <iframe
              src={tallyUrl}
              className="feedback-iframe"
              title="Feedback Form"
              allow="fullscreen"
            />
          </div>
        </div>
      )}

      <GuidedTour
        steps={type === "refraction" ? REFRACTION_TOUR : LENS_MIRROR_TOUR}
        started={tourActive}
        onEnd={() => setTourActive(false)}
      />
    </div>
  );
};

export default SimulatorPage;
