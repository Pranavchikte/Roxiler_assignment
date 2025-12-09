"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { FormInput } from "@/components/form-input"
import { validateEmail } from "@/lib/validation"
import type { UserRole } from "@/lib/types"

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState<Record<string, string | null>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: null }))
    setLoginError(null)
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string | null> = {
      email: validateEmail(formData.email),
      password: formData.password ? null : "Password is required",
    }
    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error !== null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const success = await login(formData.email, formData.password)
      if (success) {
        // Determine role based on email for demo purposes
        let role: UserRole = "user"
        if (formData.email.includes("admin")) role = "admin"
        else if (formData.email.includes("store") || formData.email.includes("owner")) role = "store_owner"

        if (role === "admin") router.push("/admin")
        else if (role === "store_owner") router.push("/store-owner")
        else router.push("/user")
      }
    } catch {
      setLoginError("Invalid email or password")
    }
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="border border-border bg-background">
          <div className="border-b border-border px-6 py-4">
            <h1 className="text-xl font-semibold text-foreground">Login</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to your account</p>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {loginError && (
              <div className="p-3 border border-destructive bg-destructive/10 text-sm text-destructive">
                {loginError}
              </div>
            )}
            <FormInput
              label="Email"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              error={errors.email}
            />
            <FormInput
              label="Password"
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              error={errors.password}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-2.5 bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <div className="border-t border-border px-6 py-4">
            <p className="text-sm text-muted-foreground text-center">
              {"Don't have an account? "}
              <Link href="/signup" className="text-foreground underline hover:no-underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
        <div className="mt-4 p-4 border border-border bg-muted text-xs text-muted-foreground">
          <p className="font-medium mb-2">Demo Login:</p>
          <p>Admin: admin@store.com</p>
          <p>Store Owner: store@owner.com</p>
          <p>User: user@email.com</p>
        </div>
      </div>
    </div>
  )
}
