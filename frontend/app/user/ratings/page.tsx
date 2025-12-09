"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { RatingStars } from "@/components/rating-stars"
import { mockRatings, mockStores } from "@/lib/mock-data"

export default function UserRatingsPage() {
  // Filter ratings for current user (mock: user id "2")
  const userRatings = mockRatings.filter((r) => r.userId === "2")

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentPath="/user/ratings" role="user" />
      <div className="flex-1 flex flex-col">
        <Header breadcrumb={["User", "My Ratings"]} />
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-semibold text-foreground mb-8">My Ratings</h1>

          {userRatings.length > 0 ? (
            <div className="space-y-4">
              {userRatings.map((rating) => {
                const store = mockStores.find((s) => s.id === rating.storeId)
                return (
                  <div key={rating.id} className="border border-border bg-background p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-semibold text-foreground">{store?.name || "Unknown Store"}</h2>
                        <p className="text-sm text-muted-foreground mt-1">Rated on {rating.createdAt}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <RatingStars rating={rating.rating} />
                        <span className="text-foreground font-medium">{rating.rating}/5</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="border border-border bg-background p-8 text-center">
              <p className="text-muted-foreground">You have not rated any stores yet.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
