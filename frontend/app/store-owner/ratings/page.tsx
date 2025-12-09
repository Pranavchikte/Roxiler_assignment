"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { DataTable } from "@/components/data-table"
import { RatingStars } from "@/components/rating-stars"
import { mockRatings } from "@/lib/mock-data"

export default function StoreOwnerRatingsPage() {
  // Mock: Store owner with store id "1"
  const storeRatings = mockRatings.filter((r) => r.storeId === "1")

  const columns = [
    { key: "userName", label: "User", sortable: true },
    {
      key: "rating",
      label: "Rating",
      sortable: true,
      render: (item: (typeof mockRatings)[0]) => (
        <div className="flex items-center gap-2">
          <RatingStars rating={item.rating} size="sm" />
          <span>{item.rating}/5</span>
        </div>
      ),
    },
    { key: "createdAt", label: "Date", sortable: true },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentPath="/store-owner/ratings" role="store_owner" />
      <div className="flex-1 flex flex-col">
        <Header breadcrumb={["Store Owner", "Ratings"]} />
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-semibold text-foreground mb-8">All Ratings</h1>
          <DataTable data={storeRatings} columns={columns} filterKeys={["userName"]} />
        </main>
      </div>
    </div>
  )
}
