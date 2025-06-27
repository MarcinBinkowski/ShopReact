import React from 'react'
import { Search, MoreHorizontal, Package } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface DataTableProps<T> {
  title?: string
  data: T[]
  loading?: boolean
  children: (item: T) => React.ReactNode
  actions?: Array<{
    label: string
    onClick: (item: T) => void
    variant?: 'default' | 'destructive'
  }>
  onSearch?: (term: string) => void
  emptyMessage?: string
}

/**
 * Super simple data table - just pass data and render function
 * Perfect for student projects - easy to understand and use
 */
export function DataTable<T extends { id: number | string }>({
  title,
  data,
  loading = false,
  children,
  actions = [],
  onSearch,
  emptyMessage = "No data found"
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = React.useState("")

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    onSearch?.(value)
  }

  if (loading) {
    return (
      <Card>
        {title && <CardHeader><CardTitle>{title}</CardTitle></CardHeader>}
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center">
            <Package className="h-8 w-8 mx-auto text-gray-400 mb-2 animate-pulse" />
            <p className="text-gray-500">Loading...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      {title && <CardHeader><CardTitle>{title}</CardTitle></CardHeader>}
      <CardContent className="space-y-4">
        {/* Simple Search */}
        {onSearch && (
          <div className="flex items-center space-x-2 max-w-sm">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        )}

        {/* Simple Table */}
        <div className="border rounded-lg">
          <Table>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center py-8">
                    <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">{emptyMessage}</p>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="w-full">
                      {children(item)}
                    </TableCell>
                    {actions.length > 0 && (
                      <TableCell className="w-16">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {actions.map((action, index) => (
                              <DropdownMenuItem
                                key={index}
                                onClick={() => action.onClick(item)}
                                className={action.variant === 'destructive' ? 'text-red-600' : ''}
                              >
                                {action.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}