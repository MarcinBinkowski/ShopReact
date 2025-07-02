"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Loader2 } from "lucide-react"

export interface ProductFormData {
  name: string
  description: string
  category: string
  brand: string
  price: string
  stock: string
  sku: string
  isActive: boolean
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData>
  productId?: string
  onSubmit: (data: ProductFormData) => Promise<void>
  onCancel: () => void
  loading?: boolean
  error?: string
}

const defaultFormData: ProductFormData = {
  name: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  stock: "",
  sku: "",
  isActive: true,
}

export default function ProductForm({
  initialData,
  productId,
  onSubmit,
  onCancel,
  loading = false,
  error,
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>(defaultFormData)

  // Determine edit mode based on presence of initialData
  const isEdit = Boolean(initialData)

  // Initialize form data
  useEffect(() => {
    if (initialData) {
      setFormData({ ...defaultFormData, ...initialData })
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const handleInputChange = (
    field: keyof ProductFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Product Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
                <CardDescription>
                  Basic details about your product
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      handleInputChange("name", e.target.value)
                    }
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Enter product description"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        handleInputChange("category", value)
                      }
                    >

                      <SelectContent>
                        <SelectItem value="shoes">Shoes</SelectItem>
                        <SelectItem value="clothing">Clothing</SelectItem>
                        <SelectItem value="equipment">
                          Equipment
                        </SelectItem>
                        <SelectItem value="accessories">
                          Accessories
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="brand">Brand</Label>
                    <Select
                      value={formData.brand}
                      onValueChange={(value) =>
                        handleInputChange("brand", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nike">Nike</SelectItem>
                        <SelectItem value="adidas">Adidas</SelectItem>
                        <SelectItem value="puma">Puma</SelectItem>
                        <SelectItem value="under-armour">
                          Under Armour
                        </SelectItem>
                        <SelectItem value="wilson">Wilson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing & Inventory</CardTitle>
                <CardDescription>
                  Set pricing and stock information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        handleInputChange("price", e.target.value)
                      }
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) =>
                        handleInputChange("stock", e.target.value)
                      }
                      placeholder="0"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) =>
                        handleInputChange("sku", e.target.value)
                      }
                      placeholder="Enter SKU"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      handleInputChange("isActive", checked)
                    }
                  />
                  <Label htmlFor="active">Active Product</Label>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Inactive products won't be visible to customers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
                <CardDescription>Upload product images</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Current Images - only show in edit mode */}
                  {isEdit && (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <img
                          src="/placeholder.svg?height=100&width=100"
                          alt="Product"
                          className="w-full h-24 object-cover rounded-md border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Upload Images */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <Button variant="outline" type="button">
                        {isEdit ? "Upload More Images" : "Upload Images"}
                      </Button>
                      <p className="text-sm text-gray-600 mt-2">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product ID - only show in edit mode */}
            {isEdit && productId && (
              <Card>
                <CardHeader>
                  <CardTitle>Product ID</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">ID: {productId}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    This ID cannot be changed
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEdit ? "Updating..." : "Creating..."}
              </>
            ) : isEdit ? (
              "Update Product"
            ) : (
              "Create Product"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
