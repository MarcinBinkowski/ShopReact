import { useState, useEffect, useCallback } from 'react'
import { z } from 'zod'

// Generic form state type
type FormState<T> = {
  data: T
  errors: Partial<Record<keyof T, string>>
  touched: Record<keyof T, boolean>
}

// Hook options
interface UseZodFormOptions<T> {
  schema: z.ZodObject<any>
  initialData?: Partial<T>
  onSubmit: (data: T) => Promise<void>
  autoGenerateSlug?: {
    fromField: keyof T
    toField: keyof T
    slugifyFn: (value: string) => string
  }
}

// Helper to create initial form state from Zod schema
function createInitialFormState<T>(
  schema: z.ZodObject<any>, 
  initialData?: Partial<T>
): FormState<T> {
  const shape = schema.shape
  const data = {} as T
  const touched = {} as Record<keyof T, boolean>
  
  // Initialize all fields from schema
  Object.keys(shape).forEach(key => {
    const fieldKey = key as keyof T
    data[fieldKey] = (initialData?.[fieldKey] || "") as any
    touched[fieldKey] = false
  })
  
  return {
    data,
    errors: {},
    touched
  }
}

export function useZodForm<T>({
  schema,
  initialData,
  onSubmit,
  autoGenerateSlug
}: UseZodFormOptions<T>) {
  const [formState, setFormState] = useState<FormState<T>>(() => 
    createInitialFormState(schema, initialData)
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update form data when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      setFormState(prev => ({
        ...prev,
        data: { ...prev.data, ...initialData }
      }))
    }
  }, [initialData])

  // Auto-generate slug if configured
  useEffect(() => {
    if (autoGenerateSlug) {
      const { fromField, toField, slugifyFn } = autoGenerateSlug
      const fromValue = formState.data[fromField]
      const isToFieldTouched = formState.touched[toField]
      
      if (fromValue && !isToFieldTouched) {
        const generatedValue = slugifyFn(String(fromValue))
        setFormState(prev => ({
          ...prev,
          data: { ...prev.data, [toField]: generatedValue as any }
        }))
      }
    }
  }, [formState.data, formState.touched, autoGenerateSlug])

  // Validate field on blur
  const validateField = useCallback((field: keyof T, value: any) => {
    const fieldData = { ...formState.data, [field]: value }
    const result = schema.safeParse(fieldData)
    
    if (!result.success) {
      const fieldError = result.error.errors.find(err => 
        err.path.includes(String(field))
      )
      return fieldError?.message
    }
    
    return undefined
  }, [schema, formState.data])

  const handleFieldChange = useCallback((field: keyof T, value: any) => {
    setFormState(prev => ({
      ...prev,
      data: { ...prev.data, [field]: value },
      errors: { ...prev.errors, [field]: undefined }
    }))
  }, [])

  const handleFieldBlur = useCallback((field: keyof T) => {
    setFormState(prev => ({
      ...prev,
      touched: { ...prev.touched, [field]: true }
    }))
    
    const fieldError = validateField(field, formState.data[field])
    if (fieldError) {
      setFormState(prev => ({
        ...prev,
        errors: { ...prev.errors, [field]: fieldError }
      }))
    }
  }, [validateField, formState.data])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate entire form
    const result = schema.safeParse(formState.data)
    
    if (!result.success) {
      // Map Zod errors to field errors
      const fieldErrors: Partial<Record<keyof T, string>> = {}
      result.error.errors.forEach(error => {
        const field = error.path[0] as keyof T
        if (field) {
          fieldErrors[field] = error.message
        }
      })
      setFormState(prev => ({ ...prev, errors: fieldErrors }))
      return
    }

    // Clear errors and submit
    setFormState(prev => ({ ...prev, errors: {} }))
    setIsSubmitting(true)
    
    try {
      await onSubmit(result.data as T)
    } finally {
      setIsSubmitting(false)
    }
  }, [schema, formState.data, onSubmit])

  const isFormValid = schema.safeParse(formState.data).success

  return {
    formState,
    isSubmitting,
    isFormValid,
    handleFieldChange,
    handleFieldBlur,
    handleSubmit,
    setFormState
  }
} 