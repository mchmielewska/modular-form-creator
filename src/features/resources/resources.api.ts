import type {
  BasicInfo,
  ProjectDetails,
  Resource,
  ResourceListResponse,
  ResourceStatus,
} from './resource.types'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5001/api'

export interface ListResourcesParams {
  page?: number
  pageSize?: number
  status?: ResourceStatus | ''
  name?: string
  sortOrder?: 'asc' | 'desc'
}

interface ApiErrorBody {
  message?: string
}

const request = async <Response>(path: string, options?: RequestInit) => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ApiErrorBody
    throw new Error(body.message || 'Something went wrong. Please try again.')
  }

  return response.json() as Promise<Response>
}

export const listResources = (params: ListResourcesParams = {}, signal?: AbortSignal) => {
  const query = new URLSearchParams()
  query.set('page', String(params.page ?? 1))
  query.set('pageSize', String(params.pageSize ?? 10))
  query.set('sortOrder', params.sortOrder ?? 'desc')

  if (params.status) query.set('status', params.status)
  if (params.name?.trim()) query.set('name', params.name.trim())

  return request<ResourceListResponse>(`/resources?${query.toString()}`, { signal })
}

export const createResource = (resourceName: string) =>
  request<Resource>('/resources', {
    method: 'POST',
    body: JSON.stringify({ resourceName }),
  })

export const deleteResource = (resourceId: number) =>
  request<Resource>(`/resources/${resourceId}`, { method: 'DELETE' })

export const getResource = (resourceId: number, signal?: AbortSignal) =>
  request<Resource>(`/resources/${resourceId}`, { signal })

export const provisionResource = (resourceId: number) =>
  request<Resource>(`/resources/${resourceId}/provisioning`, { method: 'PATCH' })

export const updateBasicInfo = (resourceId: number, basicInfo: BasicInfo) =>
  request<Resource>(`/resources/${resourceId}/basic-info`, {
    method: 'PATCH',
    body: JSON.stringify(basicInfo),
  })

export const updateProjectDetails = (
  resourceId: number,
  projectDetails: ProjectDetails,
) =>
  request<Resource>(`/resources/${resourceId}/project-details`, {
    method: 'PATCH',
    body: JSON.stringify(projectDetails),
  })
