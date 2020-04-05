import L from 'leaflet'
import { FeatureCollection } from '../typings/geometry'

export interface GetFeatureInfoParams {
  wmsUrl: string
  map: L.Map
  latLng: L.LatLng
  layers: string
  styles?: string
  srs?: string
  featureCount: number
  cqlFilter?: string
  buffer?: number
  propertyName?: string
}

type FeatureInfo = FeatureCollection

export default async function getFeatureInfo(params: GetFeatureInfoParams) {
  const { x, y } = params.map.latLngToContainerPoint(params.latLng)
  const queryParams = {
    service: 'WMS',
    version: '1.1.1',
    request: 'GetFeatureInfo',
    layers: params.layers,
    styles: params.styles,
    srs: params.srs,
    transparent: true,
    bbox: params.map.getBounds().toBBoxString(),
    feature_count: params.featureCount ?? 999,
    width: params.map.getSize().x,
    height: params.map.getSize().y,
    query_layers: params.layers,
    x: Math.round(x),
    y: Math.round(y),
    info_format: 'application/json',
    cql_filter: params.cqlFilter,
    buffer: params.buffer,
    propertyName: params.propertyName,
  }
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value === void 0) {
      delete queryParams[key as keyof typeof queryParams]
    }
  })
  const wmsUrl = params.wmsUrl
  if (!wmsUrl) {
    throw new Error(`wmsUrl is empty`)
  }
  const url = wmsUrl + L.Util.getParamString(queryParams)
  return await (await fetch(url)).json() as FeatureInfo
}