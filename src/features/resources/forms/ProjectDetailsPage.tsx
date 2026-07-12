import { ProjectDetailsView } from './ProjectDetailsView'
import { useProjectDetailsController } from './useProjectDetailsController'

export function ProjectDetailsPage() {
  return <ProjectDetailsView {...useProjectDetailsController()} />
}
