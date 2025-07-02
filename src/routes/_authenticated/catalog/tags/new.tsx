"use client"

import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useCatalogTagsCreate } from "@/api/generated/shop/catalog/catalog"
import { TagForm } from "@/components/tags/TagForm"
import { toast } from "sonner"

function NewTagPage() {
  const navigate = useNavigate()
  const createMutation = useCatalogTagsCreate()

  const handleSubmit = async (formData: { name: string; slug: string }) => {
    await createMutation.mutateAsync({ data: formData })
    toast.success("Tag created successfully")
    navigate({ to: "/catalog/tags" })
  }

  const handleCancel = () => {
    navigate({ to: "/catalog/tags" })
  }

  return (
    <TagForm
      title="Create New Tag"
      description="Add a new tag to your catalog"
      onSubmit={handleSubmit}
      submitButtonText="Create Tag"
      isSubmitting={createMutation.isPending}
      onCancel={handleCancel}
    />
  )
}

export const Route = createFileRoute('/_authenticated/catalog/tags/new')({
  component: NewTagPage,
}) 