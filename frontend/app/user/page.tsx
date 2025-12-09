"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { RatingStars } from "@/components/rating-stars"
import { Modal } from "@/components/modal"
import { mockStores } from "@/lib/mock-data"
import type { Store } from "@/lib/types"

export default function UserDashboard() {
  const [searchName, setSearchName] = useState("")
  const [searchAddress, setSearchAddress] = useState("")
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)
  const [userRatings, setUserRatings] = useState<Record<string, number>>({})

  const filteredStores = mockStores.filter((store) => {
    const matchesName = store.name.toLowerCase().includes(searchName.toLowerCase())
    const matchesAddress = store.address.toLowerCase().includes(searchAddress.toLowerCase())
    return matchesName && matchesAddress
  })

  const handleRate = (storeId: string, rating: number) => {
    setUserRatings((prev) => ({ ...prev, [storeId]: rating }))
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentPath="/user" role="user" />
      <div className="flex-1 flex flex-col">
        <Header breadcrumb={["User", "Browse Stores"]} />
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-semibold text-foreground mb-8">Browse Stores</h1>

          {/* Search Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by store name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="flex-1 min-w-48 px-3 py-2 text-sm border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
            />
            <input
              type="text"
              placeholder="Search by address..."
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              className="flex-1 min-w-48 px-3 py-2 text-sm border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>

          {/* Store List */}
          <div className="space-y-4">
            {filteredStores.map((store) => (
              <div key={store.id} className="border border-border bg-background p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <h2
                      className="text-lg font-semibold text-foreground cursor-pointer hover:underline"
                      onClick={() => setSelectedStore(store)}
                    >
                      {store.name}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">{store.address}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs uppercase tracking-wide text-muted-foreground">Overall Rating:</span>
                      <RatingStars rating={Math.round(store.rating)} size="sm" />
                      <span className="text-sm text-foreground">({store.rating.toFixed(1)})</span>
                    </div>
                  </div>
                  <div className="border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Your Rating</p>
                    <RatingStars
                      rating={userRatings[store.id] || 0}
                      interactive
                      onRate={(rating) => handleRate(store.id, rating)}
                    />
                    {userRatings[store.id] && (
                      <p className="text-xs text-muted-foreground mt-1">You rated: {userRatings[store.id]} stars</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {filteredStores.length === 0 && (
              <div className="border border-border bg-background p-8 text-center">
                <p className="text-muted-foreground">No stores found matching your search criteria.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      <Modal isOpen={!!selectedStore} onClose={() => setSelectedStore(null)} title="Store Details">
        {selectedStore && (
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Store Name</p>
              <p className="text-foreground">{selectedStore.name}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Address</p>
              <p className="text-foreground">{selectedStore.address}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Description</p>
              <p className="text-foreground">{selectedStore.description}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Overall Rating</p>
              <div className="flex items-center gap-2">
                <RatingStars rating={Math.round(selectedStore.rating)} />
                <span className="text-foreground">
                  {selectedStore.rating.toFixed(1)} ({selectedStore.totalRatings} ratings)
                </span>
              </div>
            </div>
            <div className="pt-4 border-t border-border">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Rate this store</p>
              <RatingStars
                rating={userRatings[selectedStore.id] || 0}
                interactive
                onRate={(rating) => handleRate(selectedStore.id, rating)}
                size="lg"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
