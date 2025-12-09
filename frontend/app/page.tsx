"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else if (user.role === "admin") {
      router.push("/admin")
    } else if (user.role === "store_owner") {
      router.push("/store-owner")
    } else {
      router.push("/user")
    }
  }, [user, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-muted-foreground">Redirecting...</p>
    </div>
  )
}
