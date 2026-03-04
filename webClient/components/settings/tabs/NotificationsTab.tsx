'use client'
import { useState } from "react"
import { INITIAL_NOTIFICATIONS } from "../constants/setting.constants"
import { NotificationSettings } from "../types/settings.types"
import { Mail, Bell, Zap, Smartphone } from "lucide-react"
import { motion } from "framer-motion"
import { SectionCard, NotificationItem, SaveButton } from "../ui/SharedUI"


export const NotificationsTab: React.FC = () => {
    const [settings, setSettings] = useState<NotificationSettings>(INITIAL_NOTIFICATIONS)
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)

    const set = (key: keyof NotificationSettings) => (val: boolean) => setSettings(p => ({ ...p, [key]: val }))

    const handleSave = async () => {
        setLoading(true)
        await new Promise(r => setTimeout(r, 800))
        setLoading(false); setSaved(true); setTimeout(() => setSaved(false), 2500)
    }

    return (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <SectionCard>
                <div className="px-6 py-4 border-b border-slate-50"><p className="text-sm font-semibold text-slate-700">Email</p></div>
                <NotificationItem icon={Mail} label="Task assignments" description="When you're assigned to a task" checked={settings.taskAssignments} onChange={set("taskAssignments")} color="#6366f1" />
                <NotificationItem icon={Bell} label="Project updates" description="Mentions, comments & status changes" checked={settings.projectUpdates} onChange={set("projectUpdates")} color="#6366f1" />
                <NotificationItem icon={Zap} label="Weekly digest" description="Summary of your week every Monday" checked={settings.weeklyDigest} onChange={set("weeklyDigest")} color="#6366f1" />
            </SectionCard>
            <SectionCard>
                <div className="px-6 py-4 border-b border-slate-50"><p className="text-sm font-semibold text-slate-700">Push & Mobile</p></div>
                <NotificationItem icon={Smartphone} label="Push notifications" description="Real-time alerts on desktop & mobile" checked={settings.pushNotifications} onChange={set("pushNotifications")} color="#8b5cf6" />
                <NotificationItem icon={Bell} label="Due date reminders" description="24h and 1h before deadlines" checked={settings.dueDateReminders} onChange={set("dueDateReminders")} color="#8b5cf6" />
            </SectionCard>
            <div className="flex justify-end">
                <SaveButton loading={loading} saved={saved} onClick={handleSave} />
            </div>
        </motion.div>
    )
}