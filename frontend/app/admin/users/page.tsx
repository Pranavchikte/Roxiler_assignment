"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { DataTable } from "@/components/data-table"
import { Modal } from "@/components/modal"
import { RatingStars } from "@/components/rating-stars"
import { mockUsers } from "@/lib/mock-data"
import type { User } from "@/lib/types"

export default function AllUsersPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const roleLabels = {
    admin: "Admin",
    user: "Normal User",
    store_owner: "Store Owner",
  }

  const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "address", label: "Address", sortable: true },
    {
      key: "role",
      label: "Role",
      sortable: true,
      render: (user: User) => (
        <span className="px-2 py-1 text-xs uppercase tracking-wide border border-border">{roleLabels[user.role]}</span>
      ),
    },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentPath="/admin/users" role="admin" />
      <div className="flex-1 flex flex-col">
        <Header breadcrumb={["Admin", "All Users"]} />
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-semibold text-foreground mb-8">All Users</h1>
          <DataTable
            data={mockUsers}
            columns={columns}
            filterKeys={["name", "email", "address", "role"]}
            onRowClick={setSelectedUser}
          />
        </main>
      </div>

      <Modal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} title="User Details">
        {selectedUser && (
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Name</p>
              <p className="text-foreground">{selectedUser.name}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Email</p>
              <p className="text-foreground">{selectedUser.email}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Address</p>
              <p className="text-foreground">{selectedUser.address}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Role</p>
              <span className="px-2 py-1 text-xs uppercase tracking-wide border border-border">
                {roleLabels[selectedUser.role]}
              </span>
            </div>
            {selectedUser.role === "store_owner" && selectedUser.rating && (
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Store Rating</p>
                <div className="flex items-center gap-2">
                  <RatingStars rating={Math.round(selectedUser.rating)} />
                  <span className="text-foreground">{selectedUser.rating.toFixed(1)}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
