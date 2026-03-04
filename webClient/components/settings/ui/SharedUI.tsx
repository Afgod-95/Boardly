'use client'
import { useState } from "react"
import { EyeOff, Eye, X, AlertTriangle, Loader2, Check } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import clsx from "clsx"




//input field
interface InputFieldProps {
    label: string
    placeholder?: string
    type?: "text" | "password" | "email" | "tel"
    value: string
    onChange: (val: string) => void
    error?: string
}


export const InputField: React.FC<InputFieldProps> = ({ label, placeholder, type = "text", value, onChange, error }) => {
    const [show, setShow] = useState(false)
    const isPassword = type === "password"
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
            <div className="relative">
                <input
                    type={isPassword && !show ? "password" : "text"}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`w-full px-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition-all placeholder:text-slate-300 ${
                        error ? "border-red-300 focus:ring-red-200 focus:border-red-400" : "border-slate-200 focus:ring-indigo-400/40 focus:border-indigo-400"
                    }`}
                />
                {isPassword && (
                    <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {show ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                )}
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    )
}

interface SelectFieldProps { label: string; value: string; options: string[]; onChange: (val: string) => void }
export const SelectField: React.FC<SelectFieldProps> = ({ label, value, options, onChange }) => (
    <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 transition-all appearance-none"
        >
            {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
    </div>
)

export const PlanBadge: React.FC<{ plan: string }> = ({ plan }) => (
    <span className="px-3 py-1 rounded-full text-xs font-bold" style={{
        background: plan === "Pro" ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "#f1f5f9",
        color: plan === "Pro" ? "white" : "#64748b"
    }}>{plan}</span>
)





interface SectionCardProps { children: React.ReactNode; className?: string }
export const SectionCard: React.FC<SectionCardProps> = ({ children, className = "" }) => (
    <div className={`bg-background rounded-2xl border shadow-2xl/15 overflow-hidden ${className}`}>
        {children}
    </div>
)


interface FieldRowProps { label: React.ReactNode; description?: string; children: React.ReactNode }
export const FieldRow: React.FC<FieldRowProps> = ({ label, description, children }) => (
    <div className="flex items-center justify-between py-4 px-6 border-b border-slate-50 last:border-0">
        <div className="flex-1 pr-6">
            <div className="text-sm font-medium text-slate-800">{label}</div>
            {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
        </div>
        <div>{children}</div>
    </div>
)


interface ModalProps { open: boolean; onClose: () => void; onConfirm: () => void; title: string; description: string; confirmLabel: string }
export const ConfirmModal: React.FC<ModalProps> = ({ open, onClose, onConfirm, title, description, confirmLabel }) => (
    <AnimatePresence>
        {open && (
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center"><AlertTriangle size={18} className="text-red-500" /></div>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
                    </div>
                    <h3 className="text-base font-bold text-slate-800 mb-1">{title}</h3>
                    <p className="text-sm text-slate-500 mb-6">{description}</p>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all">Cancel</button>
                        <button onClick={onConfirm} className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all">{confirmLabel}</button>
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
)




interface SaveButtonProps { loading: boolean; saved: boolean; onClick: () => void }
export const SaveButton: React.FC<SaveButtonProps> = ({ loading, saved, onClick }) => (
    <button
        onClick={onClick}
        disabled={loading}
        className= {clsx("px-6 py-2.5 text-sm font-semibold text-white rounded-xl flex",
            "items-center gap-2 transition-all disabled:opacity-70 min-w-32.5 justify-center",
            saved ? 'bg-green-600' : 'bg-violet-600 hover:bg-violet-700 transition-colors'

        )}
    >
        {loading ? <Loader2 size={15} className="animate-spin" /> : saved ? <><Check size={15} /> Saved!</> : "Save Changes"}
    </button>
)



interface NotificationItemProps {
    icon: React.FC<{ size?: number; style?: React.CSSProperties }>
    label: string
    description: string
    checked: boolean
    onChange: (val: boolean) => void
    color?: string
}
export const NotificationItem: React.FC<NotificationItemProps> = ({ icon: Icon, label, description, checked, onChange, color = "#6366f1" }) => (
    <FieldRow label={
        <span className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors" style={{ background: checked ? `${color}18` : "#f8fafc" }}>
                <Icon size={13} style={{ color: checked ? color : "#94a3b8" }} />
            </span>
            {label}
        </span>
    } description={description}>
        <Toggle checked={checked} onChange={onChange} accent={color} />
    </FieldRow>
)



// ─── Shared UI Components ──────────────────────────────────────────────────

interface ToggleProps {
    checked: boolean
    onChange: (val: boolean) => void
    accent?: string
}
const Toggle: React.FC<ToggleProps> = ({ checked, onChange, accent = "#6366f1" }) => (
    <button
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
        className="relative w-11 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-1"
        style={{ background: checked ? accent : "#e2e8f0", }}
    >
        <span
            className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300"
            style={{ transform: checked ? "translateX(20px)" : "translateX(0)" }}
        />
    </button>
)