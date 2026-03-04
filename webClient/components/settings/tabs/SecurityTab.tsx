'use client'
import { useState } from "react"
import { Check } from "lucide-react"
import { SecurityData, Session } from "../types/settings.types"
import { INITIAL_SESSIONS } from "../constants/setting.constants"
import { motion, AnimatePresence } from "framer-motion"
import { FieldRow, InputField, SectionCard, SaveButton } from "../ui/SharedUI"

export const SecurityTab: React.FC = () => {
    const [passwords, setPasswords] = useState<SecurityData>({ currentPassword: "", newPassword: "", confirmPassword: "" })
    const [errors, setErrors] = useState<Partial<SecurityData>>({})
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)
    const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS)
    const [twoFa, setTwoFa] = useState({ app: false, sms: false })

    const setPass = (field: keyof SecurityData) => (val: string) => {
        setPasswords(p => ({ ...p, [field]: val }))
        setErrors(e => ({ ...e, [field]: undefined }))
    }

    const validatePasswords = (): boolean => {
        const e: Partial<SecurityData> = {}
        if (!passwords.currentPassword) e.currentPassword = "Required"
        if (!passwords.newPassword) e.newPassword = "Required"
        else if (passwords.newPassword.length < 8) e.newPassword = "Minimum 8 characters"
        if (!passwords.confirmPassword) e.confirmPassword = "Required"
        else if (passwords.newPassword !== passwords.confirmPassword) e.confirmPassword = "Passwords don't match"
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleUpdatePassword = async () => {
        if (!validatePasswords()) return
        setLoading(true)
        await new Promise(r => setTimeout(r, 1000))
        setLoading(false); setSaved(true)
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" })
        setTimeout(() => setSaved(false), 2500)
    }

    const revokeSession = (id: string) => setSessions(s => s.filter(sess => sess.id !== id))

    return (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <SectionCard>
                <div className="px-6 py-4 border-b border-slate-50"><p className="text-sm font-semibold text-slate-700">Change Password</p></div>
                <div className="p-6 space-y-4">
                    <InputField label="Current Password" type="password" placeholder="••••••••" value={passwords.currentPassword} onChange={setPass("currentPassword")} error={errors.currentPassword} />
                    <InputField label="New Password" type="password" placeholder="••••••••" value={passwords.newPassword} onChange={setPass("newPassword")} error={errors.newPassword} />
                    <InputField label="Confirm New Password" type="password" placeholder="••••••••" value={passwords.confirmPassword} onChange={setPass("confirmPassword")} error={errors.confirmPassword} />
                    <SaveButton loading={loading} saved={saved} onClick={handleUpdatePassword} />
                </div>
            </SectionCard>

            <SectionCard>
                <div className="px-6 py-4 border-b border-slate-50"><p className="text-sm font-semibold text-slate-700">Two-Factor Authentication</p></div>
                <FieldRow label="Authenticator app" description="Use an app like 1Password or Authy">
                    {twoFa.app
                        ? <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold flex items-center gap-1"><Check size={11} /> Enabled</span>
                        : <button onClick={() => setTwoFa(p => ({ ...p, app: true }))} className="px-4 py-1.5 text-xs font-semibold text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-all">Enable</button>}
                </FieldRow>
                <FieldRow label="SMS authentication" description="Receive codes via text message">
                    {twoFa.sms
                        ? <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold flex items-center gap-1"><Check size={11} /> Enabled</span>
                        : <button onClick={() => setTwoFa(p => ({ ...p, sms: true }))} className="px-4 py-1.5 text-xs font-semibold text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">Set up</button>}
                </FieldRow>
            </SectionCard>

            <SectionCard>
                <div className="px-6 py-4 border-b border-slate-50"><p className="text-sm font-semibold text-slate-700">Active Sessions</p></div>
                <AnimatePresence>
                    {sessions.map(s => (
                        <motion.div key={s.id} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
                            <FieldRow label={s.device} description={s.location}>
                                {s.current
                                    ? <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Current</span>
                                    : <button onClick={() => revokeSession(s.id)} className="text-xs text-red-500 font-semibold hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all border border-transparent hover:border-red-100">Revoke</button>}
                            </FieldRow>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </SectionCard>
        </motion.div>
    )
}