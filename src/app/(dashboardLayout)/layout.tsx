import React from 'react'

import TutorSidebar from '@/components/shared/TutorSidebar'

const DashboardLayout = ({ tutor }: { tutor: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen flex-col lg:flex-row">
        <TutorSidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="min-h-[calc(100vh-4rem)]">
            {tutor}
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
