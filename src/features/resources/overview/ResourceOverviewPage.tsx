import { ResourceOverviewView } from './ResourceOverviewView'
import { useResourceOverviewController } from './useResourceOverviewController'

export function ResourceOverviewPage() {
  const controller = useResourceOverviewController()
  return <ResourceOverviewView {...controller} />
}
