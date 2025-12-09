"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { StatsCard } from "@/components/stats-card"
import { RatingStars } from "@/components/rating-stars"
import { mockRatings } from "@/lib/mock-data"

export default function StoreOwnerDashboard() {
  // Mock: Store owner with store id "1"
  const storeRatings = mockRatings.filter((r) => r.storeId === "1")
  const averageRating =
    storeRatings.length > 0 ? storeRatings.reduce((acc, r) => acc + r.rating, 0) / storeRatings.length : 0

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentPath="/store-owner" role="store_owner" />
      <div className="flex-1 flex flex-col">
        <Header breadcrumb={["Store Owner", "Dashboard"]} />
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-semibold text-foreground mb-8">Store Dashboard</h1>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <StatsCard label="Total Ratings" value={storeRatings.length} />
            <div className="border border-border bg-background p-6">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Average Rating</p>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-semibold text-foreground">{averageRating.toFixed(1)}</span>
                <RatingStars rating={Math.round(averageRating)} size="lg" />
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <section className="border border-border bg-background">
            <div className="border-b border-border px-6 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">Recent Ratings</h2>
            </div>
            <div className="divide-y divide-border">
              {storeRatings.slice(0, 5).map((rating) => (
                <div key={rating.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-foreground font-medium">{rating.userName}</p>
                    <p className="text-xs text-muted-foreground">{rating.createdAt}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <RatingStars rating={rating.rating} size="sm" />
                    <span className="text-sm text-foreground">{rating.rating}/5</span>
                  </div>
                </div>
              ))}
              {storeRatings.length === 0 && (
                <div className="px-6 py-8 text-center">
                  <p className="text-muted-foreground">No ratings yet.</p>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
