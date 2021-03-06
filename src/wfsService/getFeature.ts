import L from 'leaflet'
import { FeatureCollection } from '../typings/geometry'

export interface GetFeatureParams {
  wfsUrl: string
  layers: string
  cqlFilter: string
}

export default async function getFeature(params: GetFeatureParams): Promise<FeatureCollection> {
  const queryParams = {
    service: 'wfs',
    version: '2.0.0',
    request: 'GetFeature',
    outputFormat: 'application/json',
    typeNames: params.layers,
    cql_filter: params.cqlFilter,
  }
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value === void 0) {
      delete queryParams[key as keyof typeof queryParams]
    }
  })
  const wfsUrl = params.wfsUrl
  if (!wfsUrl) {
    throw new Error(`wfsUrl is empty`)
  }
  const url = wfsUrl + L.Util.getParamString(queryParams)
  return (await fetch(url)).json()
}