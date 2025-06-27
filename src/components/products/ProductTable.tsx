import { Edit, Trash2, Image as ImageIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/ui/data-table'
import type { ProductDetail } from '@/api/generated/schemas'

interface ProductTableProps {
  products: ProductDetail[]
  onEdit: (product: ProductDetail) => void
  onDelete: (product: ProductDetail) => void
  loading?: boolean
  onSearch?: (term: string) => void
}

/**
 * Simple products table using render props pattern
 * Much easier to understand - just define how each product should look
 */
export function ProductTable({ 
  products, 
  onEdit, 
  onDelete, 
  loading = false,
  onSearch
}: ProductTableProps) {
  
  const actions = [
    { label: 'Edit', onClick: onEdit },
    { label: 'Delete', onClick: onDelete, variant: 'destructive' as const },
  ]

  return (
    <DataTable
      title="Products"
      data={products}
      loading={loading}
      actions={actions}
      onSearch={onSearch}
      emptyMessage="No products found. Add your first product to get started."
    >
      {(product) => (
        <div className="flex items-center justify-between w-full">
          {/* Product Info */}
          <div className="flex items-center space-x-4">
            {/* Product Image */}
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              {product.primary_image ? (
                <img
                  src={product.primary_image}
                  alt={product.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              ) : (
                <ImageIcon className="h-6 w-6 text-gray-400" />
              )}
            </div>
            
            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">
                {product.name}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>SKU: {product.sku || 'N/A'}</span>
                <Badge variant="outline">
                  {product.category?.name || 'No category'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Product Stats */}
          <div className="flex items-center space-x-6 text-sm">
            <div className="text-right">
              <div className="font-medium">${product.current_price || product.price || '0.00'}</div>
              <div className="text-gray-500">Price</div>
            </div>
            
            <div className="text-right">
              <div className={`font-medium ${
                (product.stock_quantity || 0) > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {product.stock_quantity || 0}
              </div>
              <div className="text-gray-500">Stock</div>
            </div>
            
            <div className="text-right">
              <Badge variant={
                product.status === 'active' ? 'default' :
                product.status === 'draft' ? 'secondary' : 'outline'
              }>
                {product.status?.replace('_', ' ') || 'Unknown'}
              </Badge>
            </div>
          </div>
        </div>
      )}
    </DataTable>
  )
}