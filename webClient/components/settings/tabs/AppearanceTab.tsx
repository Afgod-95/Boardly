'use client'
import { useState  } from "react"
import { Sun, Moon, Check } from "lucide-react"
import { INITIAL_APPEARANCE } from "../constants/setting.constants"
import { AppearanceSettings, Theme } from "../types/settings.types"
import { SectionCard, SaveButton } from "../ui/SharedUI"
import { motion } from "framer-motion"
import { ACCENT_COLORS, DENSITIES } from "../constants/setting.constants"

export const AppearanceTab: React.FC = () => {
    const [settings, setSettings] = useState<AppearanceSettings>(INITIAL_APPEARANCE)
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)

    const handleSave = async () => {
        setLoading(true)
        await new Promise(r => setTimeout(r, 700))
        setLoading(false); setSaved(true); setTimeout(() => setSaved(false), 2500)
    }

    return (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <SectionCard>
                <div className="px-6 py-4 border-b border-slate-50"><p className="text-sm font-semibold text-slate-700">Theme</p></div>
                <div className="p-6 grid grid-cols-2 gap-3">
                    {([["light", Sun, "Light"], ["dark", Moon, "Dark"]] as [Theme, React.FC<{size?: number; className?: string}>, string][]).map(([val, Icon, lbl]) => (
                        <button key={val} onClick={() => setSettings(p => ({ ...p, theme: val }))}
                            className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all ${settings.theme === val ? "border-indigo-400 bg-indigo-50" : "border-slate-100 hover:border-slate-200"}`}>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${settings.theme === val ? "bg-indigo-100" : "bg-slate-100"}`}>
                                <Icon size={18} className={settings.theme === val ? "text-indigo-600" : "text-slate-400"} />
                            </div>
                            <span className={`text-sm font-medium ${settings.theme === val ? "text-indigo-700" : "text-slate-500"}`}>{lbl}</span>
                        </button>
                    ))}
                </div>
            </SectionCard>

            <SectionCard>
                <div className="px-6 py-4 border-b border-slate-50"><p className="text-sm font-semibold text-slate-700">Accent Color</p></div>
                <div className="p-6 flex flex-wrap gap-3">
                    {ACCENT_COLORS.map(c => (
                        <button key={c} onClick={() => setSettings(p => ({ ...p, accent: c }))}
                            className="w-9 h-9 rounded-full transition-all hover:scale-110 relative shadow-sm"
                            style={{ background: c, outline: settings.accent === c ? `3px solid ${c}` : "none", outlineOffset: "2px" }}>
                            {settings.accent === c && <Check size={14} className="absolute inset-0 m-auto text-white" />}
                        </button>
                    ))}
                </div>
            </SectionCard>

            <SectionCard>
                <div className="px-6 py-4 border-b border-slate-50"><p className="text-sm font-semibold text-slate-700">Layout Density</p></div>
                <div className="p-6 flex flex-wrap gap-3">
                    {DENSITIES.map(d => (
                        <button key={d} onClick={() => setSettings(p => ({ ...p, density: d }))}
                            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize border transition-all ${settings.density === d ? "border-indigo-400 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"}`}>
                            {d}
                        </button>
                    ))}
                </div>
            </SectionCard>

            <div className="flex justify-end">
                <SaveButton loading={loading} saved={saved} onClick={handleSave} />
            </div>
        </motion.div>
    )
}