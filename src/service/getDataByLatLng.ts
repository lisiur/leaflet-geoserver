import getFeatureInfo, { GetFeatureInfoParams } from '../wmsService/getFeatureInfo'
import { featureToData } from './utils'

export interface GetDataByLatLngParams extends GetFeatureInfoParams {
  idField?: string | string[]
  geometryField?: string
}

export default async function getDataByLatLng(params: GetDataByLatLngParams) {
  const { features } = await getFeatureInfo(params)
  return features.map(feature => featureToData(feature, {
    id: params.idField ?? 'id',
    geometryField: params.geometryField ?? 'geometry',
  }))
}