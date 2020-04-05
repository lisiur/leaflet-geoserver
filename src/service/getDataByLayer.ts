import getFeature, { GetFeatureParams } from '../wfsService/getFeature'
import { featureToData } from './utils'

export interface GetDataByLayerParams extends GetFeatureParams {
  idField?: string | string[]
  geometryField?: string
}

export default async function getDataByLayer(params: GetDataByLayerParams) {
  const { features } = await getFeature(params)
  return features.map(feature => featureToData(feature, {
    id: params.idField ?? 'id',
    geometryField: params.geometryField ?? 'geometry',
  }))
}