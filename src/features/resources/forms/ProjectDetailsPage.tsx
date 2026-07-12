import ProjectDetailsView from './ProjectDetailsView'
import { useProjectDetailsController } from './useProjectDetailsController'

const ProjectDetailsPage = () => {
  return <ProjectDetailsView {...useProjectDetailsController()} />
}

export default ProjectDetailsPage
