import { createContext, useContext, useState } from "react";
import { translations, langs } from "./translations";

const LangContext = createContext();

export function LangProvider({ children }) {
    const [lang, setLang] = useState("uk");
    const t = translations[lang];

    function switchLang() {
        const i = langs.indexOf(lang);
        setLang(langs[(i + 1) % langs.length]);
    }

    return (
        <LangContext.Provider value={{ lang, t, switchLang }}>
            {children}
        </LangContext.Provider>
    );
}

export function useLang() {
    return useContext(LangContext);
}
