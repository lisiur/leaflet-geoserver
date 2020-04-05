import L from 'leaflet'
import getFeature, { GetFeatureParams } from '../wfsService/getFeature'

export interface GetBoundsParams extends GetFeatureParams {}

export default async function getBounds(params: GetBoundsParams) {
  const { features } = await getFeature(params)
  if (features.length === 0) {
    return null
  }
  const bounds = features.map(feature => L.geoJSON(feature.geometry).getBounds())
  return bounds.reduce((prev, curr) => {
    return prev.extend(curr)
  }, bounds[0])
}