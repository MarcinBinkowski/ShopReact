import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse, } from 'axios';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore'


export const shopApiClient = axios.create({
//   baseURL: import.meta.env.VITE_SHOP_API_BASE_URL || 'http://localhost:8000/api',
  baseURL: 'http://localhost:8000/',
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Response interceptor to handle authentication failures globally
 */
shopApiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const status = error.response?.status

    if (status === 401 || status === 403) {
      const { clearSession } = useAuthStore.getState()
      
      clearSession()
      
      toast.error('Your session has expired. Please log in again.')
      
      const currentPath = window.location.pathname
      if (currentPath !== '/login') {
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`
      }
    }

    if (status === 404) {
      toast.error('Resource not found')
    } else if (status === 500) {
      toast.error('Server error. Please try again later.')
    } else if (status >= 400 && status < 500) {
      const message = error.response?.data?.detail || 
                     error.response?.data?.message || 
                     'An error occurred'
      toast.error(message)
    }

    return Promise.reject(error)
  }
)


export const shopInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  return shopApiClient({
    ...config,
  }).then(({ data }) => data)
}

export default shopInstance