"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { CreateUserForm } from "@/components/create-user-form"

export default function CreateUserPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentPath="/admin/create-user" role="admin" />
      <div className="flex-1 flex flex-col">
        <Header breadcrumb={["Admin", "Create User"]} />
        <main className="flex-1 p-8">
          <div className="max-w-2xl">
            <h1 className="text-2xl font-semibold text-foreground mb-8">Create User</h1>
            <CreateUserForm />
          </div>
        </main>
      </div>
    </div>
  )
}
