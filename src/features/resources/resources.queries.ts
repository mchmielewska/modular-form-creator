import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createResource,
  deleteResource,
  getResource,
  listResources,
  provisionResource,
  replaceCompletedResource,
  updateBasicInfo,
  updateProjectDetails,
  type ListResourcesParams,
} from './resources.api'
import type { BasicInfo, ProjectDetails, ResourceUpdatePayload } from './resource.types'

export const resourceKeys = {
  all: ['resources'] as const,
  lists: () => [...resourceKeys.all, 'list'] as const,
  list: (params: ListResourcesParams) => [...resourceKeys.lists(), params] as const,
  details: () => [...resourceKeys.all, 'detail'] as const,
  detail: (resourceId: number) => [...resourceKeys.details(), resourceId] as const,
}

export const useResources = (params: ListResourcesParams) =>
  useQuery({
    queryKey: resourceKeys.list(params),
    queryFn: ({ signal }) => listResources(params, signal),
    placeholderData: keepPreviousData,
  })

export const useCreateResource = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (resourceName: string) => createResource(resourceName),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: resourceKeys.lists() }),
  })
}

export const useDeleteResource = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (resourceId: number) => deleteResource(resourceId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: resourceKeys.lists() }),
  })
}

export const useResource = (resourceId: number) =>
  useQuery({
    queryKey: resourceKeys.detail(resourceId),
    queryFn: ({ signal }) => getResource(resourceId, signal),
    enabled: Number.isInteger(resourceId) && resourceId > 0,
  })

export const useProvisionResource = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (resourceId: number) => provisionResource(resourceId),
    onSuccess: (resource) => {
      queryClient.setQueryData(resourceKeys.detail(resource.resourceId), resource)
      return queryClient.invalidateQueries({ queryKey: resourceKeys.lists() })
    },
  })
}

export const useUpdateBasicInfo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ resourceId, data }: { resourceId: number; data: BasicInfo }) =>
      updateBasicInfo(resourceId, data),
    onSuccess: (resource) => updateResourceCache(queryClient, resource),
  })
}

export const useUpdateProjectDetails = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ resourceId, data }: { resourceId: number; data: ProjectDetails }) =>
      updateProjectDetails(resourceId, data),
    onSuccess: (resource) => updateResourceCache(queryClient, resource),
  })
}

export const useReplaceCompletedResource = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ resourceId, data }: { resourceId: number; data: ResourceUpdatePayload }) =>
      replaceCompletedResource(resourceId, data),
    onSuccess: (resource) => updateResourceCache(queryClient, resource),
  })
}

const updateResourceCache = (
  queryClient: ReturnType<typeof useQueryClient>,
  resource: Awaited<ReturnType<typeof updateBasicInfo>>,
) => {
  queryClient.setQueryData(resourceKeys.detail(resource.resourceId), resource)
  return queryClient.invalidateQueries({ queryKey: resourceKeys.lists() })
}
