import { Feature } from '../typings/geometry'
interface ExtraPrams {
  id?: string | string[]
  geometryField?: string
}
export function featureToData(feature: Feature, params?: ExtraPrams) {
  const id = params?.id ?? ['id']
  const idKeys = Array.isArray(id) ? id : [id]
  const [tableName, ...ids] = feature.id.split('.')
  let { properties, geometry, geometry_name } = feature
  const geometryField = params?.geometryField ?? geometry_name ?? 'geometry'
  const data = { ...properties }
  idKeys.forEach((key, index) => {
    data[key] = ids[index]
  })
  data[geometryField] = geometry
  return {
    tableName,
    data,
  }
}
