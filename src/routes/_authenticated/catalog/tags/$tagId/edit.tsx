"use client"

import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router"
import { useCatalogTagsRetrieve, useCatalogTagsUpdate } from "@/api/generated/shop/catalog/catalog"
import { TagForm } from "@/components/tags/TagForm"
import { toast } from "sonner"

function EditTagPage() {
  const navigate = useNavigate()
  const { tagId } = useParams({ from: "/_authenticated/catalog/tags/$tagId/edit" })
  const updateMutation = useCatalogTagsUpdate()
  
  const { data: tag, isLoading, error } = useCatalogTagsRetrieve(Number(tagId))

  const handleSubmit = async (formData: { name: string; slug: string }) => {
    await updateMutation.mutateAsync({ 
      id: Number(tagId), 
      data: formData 
    })
    toast.success("Tag updated successfully")
    navigate({ to: "/catalog/tags" })
  }

  const handleCancel = () => {
    navigate({ to: "/catalog/tags" })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (error || !tag) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center text-red-600">Failed to load tag</div>
      </div>
    )
  }

  return (
    <TagForm
      title="Edit Tag"
      description="Update tag information"
      initialData={{
        name: tag.name,
        slug: tag.slug
      }}
      onSubmit={handleSubmit}
      submitButtonText="Update Tag"
      isSubmitting={updateMutation.isPending}
      onCancel={handleCancel}
    />
  )
}

export const Route = createFileRoute('/_authenticated/catalog/tags/$tagId/edit')({
  component: EditTagPage,
}) 