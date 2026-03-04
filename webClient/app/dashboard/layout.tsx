import React from 'react'
import DashboardNav from '@/components/layouts/dashboard/DashboardNav'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-full">
      {/* Navigator show on mobile, tablet and desktop */}
      <DashboardNav />

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto bg-background" id="dashboard-scroll">
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout
