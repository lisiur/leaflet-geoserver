import L from 'leaflet'

interface GetFeatureParams {
  wfsUrl: string
  layers: string
  cqlFilter: string
}

export default async function getFeature(params: GetFeatureParams) {
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
  const url = params.wfsUrl + L.Util.getParamString(queryParams)
  return (await fetch(url)).json()
}