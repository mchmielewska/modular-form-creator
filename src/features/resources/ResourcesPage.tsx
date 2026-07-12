import { ResourcesView } from './ResourcesView'
import { useResourcesController } from './useResourcesController'

export function ResourcesPage() {
  const controller = useResourcesController()
  return <ResourcesView {...controller} />
}
