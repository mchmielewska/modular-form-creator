import { BasicInfoView } from './BasicInfoView'
import { useBasicInfoController } from './useBasicInfoController'

export function BasicInfoPage() {
  return <BasicInfoView {...useBasicInfoController()} />
}
