"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { catalogTagsCreateBody } from "@/api/generated/shop/catalog/catalog.zod"
import { slugify } from "@/lib/utils"
import { useZodForm } from "@/hooks/useZodForm"
import { z } from "zod"

// Use the Zod schema to infer the exact type
type TagFormData = z.infer<typeof catalogTagsCreateBody>

interface TagFormProps {
  title: string
  description: string
  initialData?: Partial<TagFormData>
  onSubmit: (data: TagFormData) => Promise<void>
  submitButtonText: string
  isSubmitting: boolean
  onCancel: () => void
}

export function TagForm({
  title,
  description,
  initialData,
  onSubmit,
  submitButtonText,
  isSubmitting: externalIsSubmitting,
  onCancel
}: TagFormProps) {
  const {
    formState,
    isSubmitting: hookIsSubmitting,
    isFormValid,
    handleFieldChange,
    handleFieldBlur,
    handleSubmit
  } = useZodForm({
    schema: catalogTagsCreateBody,
    initialData,
    onSubmit,
    autoGenerateSlug: {
      fromField: 'name',
      toField: 'slug',
      slugifyFn: slugify
    }
  })

  // Use external isSubmitting if provided, otherwise use hook's
  const isSubmitting = externalIsSubmitting || hookIsSubmitting

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formState.data.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              onBlur={() => handleFieldBlur('name')}
              placeholder="Enter tag name"
              className={formState.errors.name ? "border-red-500" : ""}
            />
            {formState.errors.name && (
              <p className="text-sm text-red-500">{formState.errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={formState.data.slug}
              onChange={(e) => handleFieldChange('slug', e.target.value)}
              onBlur={() => handleFieldBlur('slug')}
              placeholder="Enter tag slug"
              className={formState.errors.slug ? "border-red-500" : ""}
            />
            {formState.errors.slug && (
              <p className="text-sm text-red-500">{formState.errors.slug}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Only letters, numbers, hyphens, and underscores allowed
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className="flex-1"
            >
              {isSubmitting ? "Saving..." : submitButtonText}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 