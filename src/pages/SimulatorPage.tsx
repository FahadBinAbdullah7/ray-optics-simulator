import { useSearchParams, useLocation } from "react-router-dom";
import RayOptics from "@/components/RayOptics";
import Refraction from "./Refraction";

const SimulatorPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  
  // Determine type from search param OR pathname
  const typeParam = searchParams.get("type");
  const type = typeParam || (location.pathname.includes("refraction") ? "refraction" : "lens-mirror");

  const handleTypeChange = (newType: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("type", newType);
    // Set sensible default modes for each type
    if (newType === "refraction") {
      params.set("mode", "slab");
    } else {
      params.set("mode", "convexLens");
    }
    setSearchParams(params);
  };

  return (
    <div className="simulator-page-root">
      <style>{`
        .simulator-page-root {
          background: #F9FAFB;
          min-height: 100vh;
          padding: 16px;
          font-family: 'Hind Siliguri', 'Inter', sans-serif;
        }
        .central-header {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 12px 0 24px;
        }
        .app-logo {
          height: 40px;
          width: auto;
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
        .main-tab-btn:hover:not(.active) {
          background: #F3F4F6;
          color: #374151;
        }
        .main-tab-btn.active {
          background: #E8001D;
          color: #fff;
          border-color: #E8001D;
          box-shadow: 0 4px 12px rgba(232, 0, 29, 0.25);
        }
        /* Mobile adjustments */
        @media (max-width: 480px) {
          .simulator-page-root {
            padding: 12px 8px;
          }
          .central-header {
            padding: 8px 0 16px;
          }
          .main-tab-btn {
            font-size: 15px;
            padding: 10px 12px;
          }
        }
      `}</style>

      <header className="central-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#E8001D', padding: '8px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 1 1-4 0V6a2 2 0 1 1 4 0v6Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/></svg>
          </div>
          <span style={{ fontSize: '24px', fontBold: '700', color: '#111827', fontWeight: 800 }}>টেন মিনিট স্কুল</span>
        </div>
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
          <Refraction hideNav />
        ) : (
          <RayOptics hideNav />
        )}
      </div>
    </div>
  );
};

export default SimulatorPage;
