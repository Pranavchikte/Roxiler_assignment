"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { PasswordChangeForm } from "@/components/password-change-form"

export default function AdminSettingsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentPath="/admin/settings" role="admin" />
      <div className="flex-1 flex flex-col">
        <Header breadcrumb={["Admin", "Settings"]} />
        <main className="flex-1 p-8">
          <div className="max-w-md">
            <h1 className="text-2xl font-semibold text-foreground mb-8">Settings</h1>
            <section className="border border-border bg-background">
              <div className="border-b border-border px-6 py-4">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">Change Password</h2>
              </div>
              <div className="p-6">
                <PasswordChangeForm />
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
