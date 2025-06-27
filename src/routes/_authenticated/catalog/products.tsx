import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/products/data-table'
import { createProductColumns } from '@/components/products/columns'

import {
  useCatalogProductsList,
  useCatalogProductsDestroy,
} from '@/api/generated/catalog/catalog'
import type { ProductDetail } from '@/api/generated/schemas'

/**
 * Products management page using shadcn-ui data table pattern
 * Simple and follows official shadcn-ui documentation
 */
function ProductsPage() {
  // Fetch products
  const { data, isLoading, refetch } = useCatalogProductsList({
    page: 1,
    ordering: '-created_at',
  })

  // Delete product mutation
  const deleteProduct = useCatalogProductsDestroy({
    mutation: {
      onSuccess: () => {
        refetch()
        toast.success('Product deleted successfully')
      },
      onError: () => {
        toast.error('Failed to delete product')
      },
    },
  })

  // Event handlers
  const handleEdit = (product: ProductDetail) => {
    toast.info(`Edit: ${product.name}`)
    // TODO: Open edit dialog
  }

  const handleDelete = (product: ProductDetail) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      deleteProduct.mutate({ id: product.id })
    }
  }

  const handleCreateNew = () => {
    toast.info('Create new product')
    // TODO: Open create dialog
  }

  // Get data safely
  const products = data?.data?.results || []
  
  // Create columns with actions
  const columns = createProductColumns({ onEdit: handleEdit, onDelete: handleDelete })

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-32">
          <p>Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your product catalog
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Data Table */}
      <DataTable 
        columns={columns} 
        data={products} 
        searchKey="name"
        searchPlaceholder="Search products..."
      />
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/catalog/products')({
  component: ProductsPage,
})