"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { StatsCard } from "@/components/stats-card"
import { mockUsers, mockStores, mockRatings } from "@/lib/mock-data"

export default function AdminDashboard() {
  const totalUsers = mockUsers.length
  const totalStores = mockStores.length
  const totalRatings = mockRatings.length

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentPath="/admin" role="admin" />
      <div className="flex-1 flex flex-col">
        <Header breadcrumb={["Admin", "Overview"]} />
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-semibold text-foreground mb-8">Dashboard Overview</h1>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard label="Total Users" value={totalUsers} />
            <StatsCard label="Total Stores" value={totalStores} />
            <StatsCard label="Total Ratings" value={totalRatings} />
          </div>
        </main>
      </div>
    </div>
  )
}
