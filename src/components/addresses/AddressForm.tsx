"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/customui/spinner"
import { profileAddressesCreateBody, profileAddressesUpdateBody } from "@/api/generated/shop/profile/profile.zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import type { Address } from '@/api/generated/shop/schemas'
import { z } from "zod"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useGeographicCountriesList, geographicCountriesList } from "@/api/generated/shop/geographic/geographic"
import { useProfileProfilesList } from "@/api/generated/shop/profile/profile"
import { AsyncPaginateSelect, OptionType } from "@/components/customui/AsyncPaginateSelect"
import { SingleValue } from "react-select"

// Use the generated Zod schema types
type AddressCreateData = z.infer<typeof profileAddressesCreateBody>
type AddressUpdateData = z.infer<typeof profileAddressesUpdateBody>
type AddressFormData = AddressCreateData | AddressUpdateData

interface AddressFormProps {
  title: string
  description: string
  initialData?: Address
  onSubmit: (data: AddressFormData) => Promise<void>
  submitButtonText: string
  isSubmitting: boolean
  onCancel?: () => void
  selectedProfileId?: number
  onProfileChange?: (profileId: number) => void
}

export function AddressForm({
  title,
  description,
  initialData,
  onSubmit,
  submitButtonText,
  isSubmitting,
  onCancel,
  selectedProfileId,
  onProfileChange,
}: AddressFormProps) {
  const isEditMode = !!initialData
  
  // Fetch profiles for admin users
  const { data: profilesData, isLoading: profilesLoading } = useProfileProfilesList(
    undefined, // No params needed for listing all profiles
    {
      query: {
        enabled: !isEditMode, // Only fetch for create mode
      },
    }
  )
  
  const form = useForm<AddressFormData>({
    resolver: zodResolver(isEditMode ? profileAddressesUpdateBody : profileAddressesCreateBody),
    defaultValues: {
      address: "",
      city: "",
      postal_code: "",
      country: 1, // Default to first country
      ...(isEditMode ? {} : { address_type: "shipping" as const }),
      is_default: false,
      label: "",
    },
  })

  // Fetch countries for default options
  const { data: defaultCountries } = useGeographicCountriesList({ page: 1, page_size: 50 })
  const defaultCountryOptions = defaultCountries?.results?.map(c => ({ value: c.id, label: c.name })) || []

  useEffect(() => {
    if (initialData) {
      form.reset({
        address: initialData.address,
        city: initialData.city,
        postal_code: initialData.postal_code,
        country: initialData.country,
        address_type: initialData.address_type,
        is_default: initialData.is_default || false,
        label: initialData.label || "",
      })
    }
  }, [initialData, form])

  const handleSubmit = async (data: AddressFormData) => {
    try {
      await onSubmit(data)
    } catch (error) {
      console.error("Form submission error:", error)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Address Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Profile Selector for Create Mode */}
            {!isEditMode && (
              <div className="space-y-2">
                <Label htmlFor="profile">Select User Profile</Label>
                <Select
                  value={selectedProfileId?.toString() || ""}
                  onValueChange={(value) => {
                    const profileId = parseInt(value)
                    onProfileChange?.(profileId)
                  }}
                  disabled={profilesLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={profilesLoading ? "Loading profiles..." : "Select user profile"} />
                  </SelectTrigger>
                  <SelectContent>
                    {profilesData?.results?.map((profile) => (
                      <SelectItem key={profile.id} value={profile.id.toString()}>
                        {profile.display_name} (ID: {profile.id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {profilesLoading && (
                  <p className="text-sm text-muted-foreground">Loading user profiles...</p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  {...form.register("address")}
                  placeholder="123 Main St, Apt 4B"
                />
                {form.formState.errors.address && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.address.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  {...form.register("city")}
                  placeholder="New York"
                />
                {form.formState.errors.city && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.city.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="postal_code">Postal Code</Label>
                <Input
                  id="postal_code"
                  {...form.register("postal_code")}
                  placeholder="10001"
                />
                {form.formState.errors.postal_code && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.postal_code.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <AsyncPaginateSelect
                  value={(() => {
                    const id = form.watch("country")
                    if (!id) return null
                    const country = defaultCountries?.results?.find(c => c.id === id)
                    return country ? { value: country.id, label: country.name } : null
                  })()}
                  onChange={(option: SingleValue<OptionType>) => form.setValue("country", option ? option.value : 1)}
                  isDisabled={isSubmitting}
                  error={form.formState.errors.country && String(form.formState.errors.country.message)}
                  placeholder="Select country"
                  isMulti={false}
                  fetcher={geographicCountriesList}
                  mapOption={c => ({ value: c.id, label: c.name })}
                  defaultOptions={defaultCountryOptions}
                  instanceId="country-async-paginate"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!isEditMode && (
                <div className="space-y-2">
                  <Label htmlFor="address_type">Address Type</Label>
                  <Select
                    value={form.watch("address_type")}
                    onValueChange={(value) => form.setValue("address_type", value as "shipping" | "billing")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select address type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shipping">Shipping</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                    </SelectContent>
                  </Select>
                  {(form.formState.errors as any).address_type && (
                    <p className="text-sm text-red-600">
                      {(form.formState.errors as any).address_type.message}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="label">Label (Optional)</Label>
                <Input
                  id="label"
                  {...form.register("label")}
                  placeholder="Home, Office, etc."
                />
                {form.formState.errors.label && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.label.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_default"
                checked={form.watch("is_default")}
                onCheckedChange={(checked) => form.setValue("is_default", checked as boolean)}
              />
              <Label htmlFor="is_default">Set as default address</Label>
            </div>
            {form.formState.errors.is_default && (
              <p className="text-sm text-red-600">
                {form.formState.errors.is_default.message}
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner size="sm" className="mr-2" />
                {submitButtonText}...
              </>
            ) : (
              submitButtonText
            )}
          </Button>
        </div>
      </form>
    </div>
  )
} 