import React from 'react'
import Sidebar from '@/components/layouts/dashboard/Sidebar'
import BottomNavigator from '@/components/layouts/dashboard/MobileBottomNav'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-full">
      {/* Sidebar: show on tablet and desktop */}
      <aside className="hidden sm:flex">
        <Sidebar />
      </aside>

      {/* Bottom Navigator: show only on mobile */}
      <div className="flex sm:hidden">
        <BottomNavigator />
      </div>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto bg-background" id="dashboard-scroll">
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout
