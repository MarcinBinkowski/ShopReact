"use client"

import { createFileRoute, useNavigate, Link } from "@tanstack/react-router"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import ProductForm, { type ProductFormData } from "@/components/products/ProductForm"

function NewProductPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (formData: ProductFormData) => {
    setLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("Product data:", formData)

      // Redirect back to products page
      navigate({ to: "/catalog/products" })
    } catch (err) {
      setError("Failed to create product")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate({ to: "/catalog/products" })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/catalog/products">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600">Create a new product for your store</p>
        </div>
      </div>

      <ProductForm onSubmit={handleSubmit} onCancel={handleCancel} loading={loading} error={error} />
    </div>
  )
}

export const Route = createFileRoute("/_authenticated/catalog/products/new")({
  component: NewProductPage,
})
