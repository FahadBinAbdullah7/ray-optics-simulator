import { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "bn" | "en";

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (bn: string, en: string) => string;
}

const LangContext = createContext<LangCtx>({
  lang: "bn",
  setLang: () => {},
  t: (bn) => bn,
});

export const LangProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>(() => {
    try { return (localStorage.getItem("ray_lang") as Lang) || "bn"; } catch { return "bn"; }
  });

  const setLangPersist = (l: Lang) => {
    try { localStorage.setItem("ray_lang", l); } catch { /* ignore */ }
    setLang(l);
  };

  const t = (bn: string, en: string) => lang === "en" ? en : bn;

  return (
    <LangContext.Provider value={{ lang, setLang: setLangPersist, t }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);
