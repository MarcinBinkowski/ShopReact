"use client"

import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { profileAddressesCreateBody, profileAddressesUpdateBody } from "@/api/generated/shop/profile/profile.zod"
import { AddressForm } from "@/components/addresses/AddressForm"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { z } from "zod"
import { useState } from "react"
import { useProfileAddressesCreate } from "@/api/generated/shop/profile/profile"

// Use the generated Zod schema types - union type to match AddressForm expectations
type AddressCreateData = z.infer<typeof profileAddressesCreateBody>
type AddressUpdateData = z.infer<typeof profileAddressesUpdateBody>
type AddressFormData = AddressCreateData | AddressUpdateData

function NewAddressPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedProfileId, setSelectedProfileId] = useState<number | undefined>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const createMutation = useProfileAddressesCreate()

  const handleSubmit = async (formData: AddressFormData & { profile?: number }) => {
    try {
      setIsSubmitting(true)
      const validatedData = profileAddressesCreateBody.parse(formData)
      await createMutation.mutateAsync({ data: validatedData })
      queryClient.invalidateQueries({ queryKey: ["/api/profile/addresses/"] })
      toast.success("Address created successfully")
      navigate({ to: "/addresses" })
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Failed to create address: ${error.message}`)
      } else {
        toast.error("Failed to create address")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate({ to: "/addresses" })
  }

  const handleProfileChange = (profileId: number) => {
    setSelectedProfileId(profileId)
  }

  return (
    <AddressForm
      title="Create New Address"
      description="Add a new shipping or billing address"
      onSubmit={handleSubmit}
      submitButtonText="Create Address"
      isSubmitting={isSubmitting}
      onCancel={handleCancel}
    />
  )
}

export const Route = createFileRoute('/_authenticated/addresses/new')({
  component: NewAddressPage,
}) 