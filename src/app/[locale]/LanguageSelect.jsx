"use client";

import { useState } from "react";
import { usePathname, useRouter } from "@/i18n/navigation"; // adjust path if needed
import { useLocale } from "next-intl";

const LANGS = [
    { code: "en", label: "English", flag: "https://flagcdn.com/w20/us.png" },
    { code: "ar", label: "Arabic", flag: "https://flagcdn.com/w20/ae.png" },
    // { code: "es", label: "Spanish", flag: "https://flagcdn.com/w20/es.png" },
    // { code: "zh", label: "Chinese (S)", flag: "https://flagcdn.com/w20/cn.png" },
    // { code: "hk", label: "Chinese (T)", flag: "https://flagcdn.com/w20/hk.png" },
    // { code: "hi", label: "Hindi", flag: "https://flagcdn.com/w20/in.png" },
    // { code: "de", label: "German", flag: "https://flagcdn.com/w20/de.png" },
    // { code: "fr", label: "French", flag: "https://flagcdn.com/w20/fr.png" },
    // { code: "ja", label: "Japanese", flag: "https://flagcdn.com/w20/jp.png" },
    // { code: "ko", label: "Korean", flag: "https://flagcdn.com/w20/kr.png" },
    // { code: "th", label: "Thai", flag: "https://flagcdn.com/w20/th.png" },
    // { code: "vi", label: "Vietnamese", flag: "https://flagcdn.com/w20/vn.png" },
    // { code: "ru", label: "Russian", flag: "https://flagcdn.com/w20/ru.png" },
    // { code: "ms", label: "Malay", flag: "https://flagcdn.com/w20/my.png" },
    // { code: "pt", label: "Portuguese", flag: "https://flagcdn.com/w20/pt.png" },
    // { code: "tr", label: "Turkish", flag: "https://flagcdn.com/w20/tr.png" },
];

export default function LanguageSelect() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const locale = useLocale(); // 👈 gives you "en", "ar", etc.

    const current =
        LANGS.find((l) => l.code.toLowerCase() === locale.toLowerCase()) ||
        LANGS[0];

    const changeLang = (lang) => {
        router.replace(pathname, { locale: lang });
        setOpen(false);
    };
    return (
        <div className="relative">
            <button
                onClick={() => setOpen((s) => !s)}
                className="flex items-center gap-2 rounded-md bg-white/10 px-3 py-1.5 text-sm text-white ring-1 ring-white/10 hover:bg-white/20"
            >
                <img src={current.flag} alt={current.code} className="h-5 w-7 rounded-sm" />
                {current.label}
                <svg
                    className="h-4 w-4 opacity-80"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.062l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
            {open && (
                <div className="absolute right-0 z-30 mt-2 max-h-72 w-40 overflow-auto rounded-lg bg-white p-2 text-slate-900 shadow-xl">
                    {LANGS.map((l) => (
                        <button
                            key={l.code}
                            onClick={() => changeLang(l.code)}
                            className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-slate-100 ${current.code === l.code ? "bg-slate-50" : ""
                                }`}
                        >
                            <img src={l.flag} alt={l.code} className="h-4 w-6 rounded-sm" />
                            <span className="font-medium">{l.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
