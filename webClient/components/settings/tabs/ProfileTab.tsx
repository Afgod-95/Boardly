
import React, { useState, useCallback } from "react"
import { Camera, Upload } from "lucide-react"
import { INITIAL_PROFILE, TIMEZONES } from "../constants/setting.constants"
import { ProfileData } from "../types/settings.types"
import { motion } from "framer-motion"
import { InputField, SectionCard, SelectField } from "../ui/SharedUI"
import { SaveButton } from "../ui/SharedUI"


export const ProfileTab: React.FC = () => {
    const [data, setData] = useState<ProfileData>(INITIAL_PROFILE)
    const [errors, setErrors] = useState<Partial<ProfileData>>({})
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)

    const set = useCallback((field: keyof ProfileData) => (val: string) => {
        setData(p => ({ ...p, [field]: val }))
        setErrors(e => ({ ...e, [field]: undefined }))
    }, [])

    const validate = (): boolean => {
        const newErrors: Partial<ProfileData> = {}
        if (!data.firstName.trim()) newErrors.firstName = "Required"
        if (!data.lastName.trim()) newErrors.lastName = "Required"
        if (!data.email.trim()) newErrors.email = "Required"
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) newErrors.email = "Invalid email"
        if (!data.displayName.trim()) newErrors.displayName = "Required"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSave = async () => {
        if (!validate()) return
        setLoading(true)
        await new Promise(r => setTimeout(r, 1000))
        setLoading(false)
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
    }

    return (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <SectionCard>
                <div className="p-6 border-b border-slate-50">
                    <div className="flex items-center gap-5">
                        <div className="relative group cursor-pointer">
                            <div className="h-20 w-20 rounded-full flex items-center justify-center text-2xl font-black text-white shadow-lg select-none"
                                style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}>
                                {data.firstName[0]}{data.lastName[0]}
                            </div>
                            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Camera size={18} className="text-white" />
                            </div>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800">{data.firstName} {data.lastName}</p>
                            <p className="text-sm text-slate-400">{data.email}</p>
                            <button className="mt-2 text-xs text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1 transition-colors">
                                <Upload size={11} /> Upload new photo
                            </button>
                        </div>
                    </div>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField label="First Name" placeholder="John" value={data.firstName} onChange={set("firstName")} error={errors.firstName} />
                    <InputField label="Last Name" placeholder="Doe" value={data.lastName} onChange={set("lastName")} error={errors.lastName} />
                    <div className="sm:col-span-2">
                        <InputField label="Display Name" placeholder="@johndoe" value={data.displayName} onChange={set("displayName")} error={errors.displayName} />
                    </div>
                    <div className="sm:col-span-2">
                        <InputField label="Job Title" placeholder="Product Manager" value={data.jobTitle} onChange={set("jobTitle")} />
                    </div>
                    <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bio</label>
                        <textarea
                            value={data.bio}
                            onChange={e => set("bio")(e.target.value)}
                            className="w-full min-h-22.5 px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 transition-all resize-none placeholder:text-slate-300"
                            placeholder="Tell your team about yourself…"
                        />
                    </div>
                </div>
            </SectionCard>

            <SectionCard>
                <div className="px-6 py-4 border-b border-slate-50">
                    <p className="text-sm font-semibold text-slate-700">Contact Info</p>
                </div>
                <div className="p-6 grid sm:grid-cols-2 gap-4">
                    <InputField label="Email" type="email" placeholder="you@company.com" value={data.email} onChange={set("email")} error={errors.email} />
                    <InputField label="Phone" type="tel" placeholder="+1 (555) 000-0000" value={data.phone} onChange={set("phone")} />
                    <div className="sm:col-span-2">
                        <SelectField label="Timezone" value={data.timezone} options={TIMEZONES} onChange={set("timezone")} />
                    </div>
                </div>
            </SectionCard>

            <div className="flex justify-end gap-3">
                <button onClick={() => { setData(INITIAL_PROFILE); setErrors({}) }}
                    className="px-5 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-all">
                    Reset
                </button>
                <SaveButton loading={loading} saved={saved} onClick={handleSave} />
            </div>
        </motion.div>
    )
}