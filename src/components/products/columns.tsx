"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Edit, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import type { ProductDetail } from "@/api/generated/schemas"

export type ProductActionsProps = {
  onEdit: (product: ProductDetail) => void
  onDelete: (product: ProductDetail) => void
}

export const createProductColumns = ({ onEdit, onDelete }: ProductActionsProps): ColumnDef<ProductDetail>[] => [
  {
    accessorKey: "name",
    header: "Product",
    cell: ({ row }) => {
      const product = row.original
      return (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            {product.primary_image ? (
              <img
                src={product.primary_image}
                alt={product.name}
                className="w-10 h-10 rounded-lg object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-200 rounded-lg" />
            )}
          </div>
          <div>
            <div className="font-medium">{product.name}</div>
            <div className="text-sm text-muted-foreground">
              SKU: {product.sku || 'N/A'}
            </div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.original.category
      return (
        <Badge variant="outline">
          {category?.name || 'No category'}
        </Badge>
      )
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const product = row.original
      const currentPrice = product.current_price || product.price || '0.00'
      const isOnSale = product.is_on_sale && product.price !== currentPrice

      return (
        <div>
          <div className="font-medium">${currentPrice}</div>
          {isOnSale && (
            <div className="text-sm text-muted-foreground line-through">
              ${product.price}
            </div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "stock_quantity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Stock
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const stock = row.original.stock_quantity || 0
      return (
        <div className={`font-medium ${
          stock > 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {stock}
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status
      const getStatusVariant = (status: string) => {
        switch (status) {
          case 'active': return 'default'
          case 'draft': return 'secondary'
          case 'inactive': return 'outline'
          case 'out_of_stock': return 'destructive'
          default: return 'outline'
        }
      }

      return (
        <Badge variant={getStatusVariant(status || 'unknown')}>
          {status?.replace('_', ' ') || 'Unknown'}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(product)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(product)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]