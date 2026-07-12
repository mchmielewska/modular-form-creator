import ResourcesView from './ResourcesView'
import { useResourcesController } from './useResourcesController'

const ResourcesPage = () => {
  const controller = useResourcesController()
  return <ResourcesView {...controller} />
}

export default ResourcesPage
