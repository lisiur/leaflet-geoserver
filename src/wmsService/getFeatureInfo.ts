import L from 'leaflet'

interface GetFeatureInfoParams {
  wmsUrl: string
  map: L.Map
  latLng: L.LatLng
  layers: string
  styles: string
  srs?: string
  cqlFilter?: string
}

interface FeatureInfo {
  type: 'FeatureCollection'
  crs: {
    type: string
    properties: {
      name: string
    } | null
  }
  features: Array<{
    type: 'Feature'
    id: string
    geometry: L.GeoJSON
    geometry_name: string
    properties: {
      [prop: string]: any
    }
  }>
}

export default async function getFeatureInfo(params: GetFeatureInfoParams) {
  const { x, y } = params.map.latLngToContainerPoint(params.latLng)
  const queryParams = {
    service: 'WMS',
    version: '1.1.1',
    request: 'GetFeatureInfo',
    layers: params.layers,
    styles: params.styles,
    srs: params.srs ?? 'EPSG:4326',
    bbox: params.map.getBounds().toBBoxString(),
    width: params.map.getSize().x,
    height: params.map.getSize().y,
    query_layers: params.layers,
    x,
    y,
    info_format: 'application/json',
    cql_filter: params.cqlFilter,
  }
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value === void 0) {
      delete queryParams[key as keyof typeof queryParams]
    }
  })
  const url = params.wmsUrl + L.Util.getParamString(queryParams)
  return await (await fetch(url)).json() as FeatureInfo
}