import ResourceDetailsView from './ResourceDetailsView'
import { useResourceDetailsController } from './useResourceDetailsController'

const ResourceDetailsPage = () => {
  return <ResourceDetailsView {...useResourceDetailsController()} />
}

export default ResourceDetailsPage
