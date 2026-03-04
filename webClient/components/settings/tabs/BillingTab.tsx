'use client'
import { motion } from "framer-motion"
import { SectionCard, FieldRow } from "../ui/SharedUI"
import { Invoice } from "../types/settings.types"
import { Download } from "lucide-react"
import { INVOICES } from "../constants/setting.constants"



export const BillingTab: React.FC = () => {
    const handleDownloadInvoice = (invoice: Invoice) => {
        const content = `INVOICE\n${invoice.invoiceNumber}\nDate: ${invoice.date}\nAmount: ${invoice.amount}\nStatus: ${invoice.status}`
        const blob = new Blob([content], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = `${invoice.invoiceNumber}.txt`; a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="rounded-2xl p-6 text-white relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)" }}>
                <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
                <div className="absolute -right-2 bottom-0 w-20 h-20 rounded-full bg-white/5 pointer-events-none" />
                <p className="text-indigo-200 text-xs font-semibold uppercase tracking-widest">Current Plan</p>
                <div className="flex items-end gap-2 mt-1">
                    <p className="text-4xl font-black">$29</p>
                    <p className="text-indigo-200 text-base mb-1">/ month · Pro</p>
                </div>
                <p className="text-indigo-200 text-sm mt-2">Next billing on April 2, 2026</p>
                <button className="mt-4 px-5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-sm font-semibold transition-all backdrop-blur-sm border border-white/20">
                    Manage Subscription
                </button>
            </div>

            <SectionCard>
                <div className="px-6 py-4 border-b border-slate-50"><p className="text-sm font-semibold text-slate-700">Payment Method</p></div>
                <div className="p-6">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-7 rounded-md bg-slate-800 flex items-center justify-center shrink-0">
                                <span className="text-[9px] font-black text-white">VISA</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-700">•••• •••• •••• 4242</p>
                                <p className="text-xs text-slate-400">Expires 09/27</p>
                            </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Default</span>
                    </div>
                    <button className="mt-3 w-full py-2.5 rounded-xl border-2 border-dashed border-slate-200 text-sm text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-all font-medium">
                        + Add payment method
                    </button>
                </div>
            </SectionCard>

            <SectionCard>
                <div className="px-6 py-4 border-b border-slate-50"><p className="text-sm font-semibold text-slate-700">Invoices</p></div>
                {INVOICES.map((inv) => (
                    <FieldRow key={inv.invoiceNumber} label={inv.date} description={inv.invoiceNumber}>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-slate-700">{inv.amount}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                inv.status === "Paid" ? "bg-green-100 text-green-700"
                                : inv.status === "Pending" ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}>{inv.status}</span>
                            <button onClick={() => handleDownloadInvoice(inv)} title="Download" className="text-slate-400 hover:text-indigo-500 transition-colors">
                                <Download size={14} />
                            </button>
                        </div>
                    </FieldRow>
                ))}
            </SectionCard>
        </motion.div>
    )
}