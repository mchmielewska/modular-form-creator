import ResourceOverviewView from './ResourceOverviewView'
import { useResourceOverviewController } from './useResourceOverviewController'

const ResourceOverviewPage = () => {
  const controller = useResourceOverviewController()
  return <ResourceOverviewView {...controller} />
}

export default ResourceOverviewPage
