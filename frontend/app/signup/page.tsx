"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { FormInput } from "@/components/form-input"
import { validateName, validateEmail, validatePassword, validateAddress } from "@/lib/validation"

export default function SignupPage() {
  const { signup } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string | null>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: null }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string | null> = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      address: validateAddress(formData.address),
      password: validatePassword(formData.password),
      confirmPassword: formData.password !== formData.confirmPassword ? "Passwords do not match" : null,
    }
    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error !== null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    const success = await signup(formData.name, formData.email, formData.address, formData.password)
    if (success) {
      router.push("/user")
    }
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="border border-border bg-background">
          <div className="border-b border-border px-6 py-4">
            <h1 className="text-xl font-semibold text-foreground">Sign Up</h1>
            <p className="text-sm text-muted-foreground mt-1">Create a new account</p>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <FormInput
              label="Name"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name (20-60 characters)"
              error={errors.name}
            />
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
              label="Address"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address (max 400 characters)"
              error={errors.address}
              textarea
              rows={2}
            />
            <FormInput
              label="Password"
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="8-16 chars, 1 uppercase, 1 special"
              error={errors.password}
            />
            <FormInput
              label="Confirm Password"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              error={errors.confirmPassword}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-2.5 bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </button>
          </form>
          <div className="border-t border-border px-6 py-4">
            <p className="text-sm text-muted-foreground text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-foreground underline hover:no-underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
