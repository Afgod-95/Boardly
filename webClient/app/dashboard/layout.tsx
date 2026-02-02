import React from 'react'
import Sidebar from '@/components/layouts/dashboard/Sidebar'
import BottomNavigator from '@/components/layouts/dashboard/Mobile'

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
      <main className="flex-1 overflow-y-auto bg-background">
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout
