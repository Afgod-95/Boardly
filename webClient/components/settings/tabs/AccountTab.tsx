'use client'
import { useState } from "react"
import { AlertTriangle, ChevronRight, Download, Globe, LogOut, Trash2 } from "lucide-react"
import { INITIAL_WORKSPACE } from "../constants/setting.constants"
import { WorkspaceData } from "../types/settings.types"
import { motion } from "framer-motion"
import { FieldRow, PlanBadge, SectionCard, SaveButton } from "../ui/SharedUI"
import { ConfirmModal } from "../ui/SharedUI"

export const AccountTab: React.FC = () => {
    const [workspace, setWorkspace] = useState<WorkspaceData>(INITIAL_WORKSPACE)
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)
    const [modal, setModal] = useState<"leave" | "delete" | null>(null)

    const set = (field: keyof WorkspaceData) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setWorkspace(p => ({ ...p, [field]: e.target.value }))

    const handleSave = async () => {
        setLoading(true)
        await new Promise(r => setTimeout(r, 900))
        setLoading(false); setSaved(true); setTimeout(() => setSaved(false), 2500)
    }

    const handleExport = () => {
        const blob = new Blob([JSON.stringify({ workspace, exportedAt: new Date().toISOString() }, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = "boardly-export.json"; a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <SectionCard>
                <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-700">Workspace</p>
                    <PlanBadge plan="Pro" />
                </div>
                <FieldRow label="Workspace name" description="Visible to all members">
                    <input value={workspace.name} onChange={set("name")}
                        className="text-sm px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300/40 focus:border-indigo-400 w-40 transition-all" />
                </FieldRow>
                <FieldRow label="Workspace URL" description="boardly.app/your-slug">
                    <input value={workspace.slug} onChange={set("slug")}
                        className="text-sm px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300/40 focus:border-indigo-400 w-40 transition-all" />
                </FieldRow>
                <FieldRow label="Region" description="Data residency location">
                    <span className="text-sm text-slate-500 flex items-center gap-1.5"><Globe size={13} /> {workspace.region}</span>
                </FieldRow>
                <div className="px-6 py-4 flex justify-end">
                    <SaveButton loading={loading} saved={saved} onClick={handleSave} />
                </div>
            </SectionCard>

            <SectionCard>
                <div className="px-6 py-4 border-b border-slate-50">
                    <p className="text-sm font-semibold text-slate-700">Data & Export</p>
                </div>
                <div className="p-6">
                    <button onClick={handleExport}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all group">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                                <Download size={14} className="text-indigo-600" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-medium text-slate-700">Export all data</p>
                                <p className="text-xs text-slate-400">Download a full JSON backup</p>
                            </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
                    </button>
                </div>
            </SectionCard>

            <SectionCard>
                <div className="px-6 py-4 border-b border-red-50 bg-red-50/40">
                    <p className="text-sm font-semibold text-red-600 flex items-center gap-2"><AlertTriangle size={14} /> Danger Zone</p>
                </div>
                <div className="p-6 space-y-3">
                    {[
                        { icon: LogOut, label: "Leave workspace", desc: "You will lose access immediately", action: () => setModal("leave") },
                        { icon: Trash2, label: "Delete account", desc: "Permanently remove all your data", action: () => setModal("delete") },
                    ].map(({ icon: Icon, label, desc, action }) => (
                        <button key={label} onClick={action}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-red-100 hover:border-red-300 hover:bg-red-50 transition-all text-left">
                            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                                <Icon size={14} className="text-red-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-red-600">{label}</p>
                                <p className="text-xs text-red-400">{desc}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </SectionCard>

            <ConfirmModal open={modal === "leave"} onClose={() => setModal(null)} onConfirm={() => setModal(null)}
                title="Leave workspace?" description="You'll lose access to all projects and won't be able to rejoin without an invite."
                confirmLabel="Leave Workspace" />
            <ConfirmModal open={modal === "delete"} onClose={() => setModal(null)} onConfirm={() => setModal(null)}
                title="Delete account?" description="This will permanently delete your account and all associated data. This action cannot be undone."
                confirmLabel="Delete Account" />
        </motion.div>
    )
}