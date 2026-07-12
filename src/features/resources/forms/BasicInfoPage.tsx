import BasicInfoView from './BasicInfoView'
import { useBasicInfoController } from './useBasicInfoController'

const BasicInfoPage = () => {
  return <BasicInfoView {...useBasicInfoController()} />
}

export default BasicInfoPage
