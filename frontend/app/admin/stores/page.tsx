"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { DataTable } from "@/components/data-table"
import { Modal } from "@/components/modal"
import { RatingStars } from "@/components/rating-stars"
import { mockStores } from "@/lib/mock-data"
import type { Store } from "@/lib/types"

export default function AllStoresPage() {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)

  const columns = [
    { key: "name", label: "Store Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "address", label: "Address", sortable: true },
    {
      key: "rating",
      label: "Rating",
      sortable: true,
      render: (store: Store) => (
        <div className="flex items-center gap-2">
          <RatingStars rating={Math.round(store.rating)} size="sm" />
          <span className="text-muted-foreground">({store.rating.toFixed(1)})</span>
        </div>
      ),
    },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentPath="/admin/stores" role="admin" />
      <div className="flex-1 flex flex-col">
        <Header breadcrumb={["Admin", "All Stores"]} />
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-semibold text-foreground mb-8">All Stores</h1>
          <DataTable
            data={mockStores}
            columns={columns}
            filterKeys={["name", "email", "address"]}
            onRowClick={setSelectedStore}
          />
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
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Email</p>
              <p className="text-foreground">{selectedStore.email}</p>
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
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Owner</p>
              <p className="text-foreground">{selectedStore.ownerName}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Rating</p>
              <div className="flex items-center gap-2">
                <RatingStars rating={Math.round(selectedStore.rating)} />
                <span className="text-foreground">
                  {selectedStore.rating.toFixed(1)} ({selectedStore.totalRatings} ratings)
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
