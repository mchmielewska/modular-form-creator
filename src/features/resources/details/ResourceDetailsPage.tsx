import { ResourceDetailsView } from './ResourceDetailsView'
import { useResourceDetailsController } from './useResourceDetailsController'

export function ResourceDetailsPage() {
  return <ResourceDetailsView {...useResourceDetailsController()} />
}
